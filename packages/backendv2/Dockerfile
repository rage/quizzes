# Build context is the repository root (see bin/build-docker-backendv2.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-alpine AS toolchain

# node-rdkafka compiles librdkafka on install.
RUN apk add --no-cache \
      bash \
      build-base \
      cyrus-sasl-dev \
      linux-headers \
      lz4-dev \
      openssl-dev \
      python3 \
      zlib-dev \
      zstd-dev

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')"

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backendv2/package.json packages/backendv2/

FROM toolchain AS build

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter ./packages/backendv2

COPY packages/backendv2 packages/backendv2

RUN pnpm --filter ./packages/backendv2 run build && rm -rf packages/backendv2/dist/tests

FROM toolchain AS prod-deps

# The addon needs only build/Release/*.node and the shared librdkafka in build/deps; the rest is
# librdkafka sources, objects and static archives.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --store-dir /pnpm/store --filter ./packages/backendv2 \
    && cd node_modules/.pnpm/node-rdkafka@*/node_modules/node-rdkafka \
    && rm -rf deps src build/Release/obj.target build/deps/*.a \
    && strip --strip-unneeded build/Release/*.node build/deps/*.so*

FROM node:26.13.0-alpine

# Shared libraries the node-rdkafka addon links against.
RUN apk add --no-cache cyrus-sasl lz4-libs zstd-libs

# New Relic logs to the working directory by default, which the node user cannot write.
ENV NODE_ENV=production \
    NEW_RELIC_LOG=/tmp/newrelic_agent.log

WORKDIR /app

COPY --from=prod-deps /app/node_modules node_modules
COPY --from=prod-deps /app/packages/backendv2/node_modules packages/backendv2/node_modules
# --chmod: a checkout made under a strict umask would leave it unreadable to `npm run`.
COPY --chmod=644 packages/backendv2/package.json packages/backendv2/
COPY --from=build /app/packages/backendv2/dist packages/backendv2/dist

WORKDIR /app/packages/backendv2

USER node

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

EXPOSE 3003

CMD [ "node", "--import", "./dist/instrument.js", "dist/server.js" ]
