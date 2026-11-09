# Build context is the repository root (see docker-compose.yml): the pnpm workspace files and
# lockfile live there.
FROM node:26.13.0-alpine

RUN apk add --no-cache \
      bash \
      build-base \
      ca-certificates \
      cyrus-sasl-dev \
      linux-headers \
      lz4-dev \
      openssl-dev \
      python3 \
      zlib-dev \
      zstd-dev

RUN mkdir -p /app && chown -R node /app

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')" \
    && rm /tmp/package.json

USER node

WORKDIR /app

COPY --chown=node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --chown=node packages/backendv2/package.json /app/packages/backendv2/

RUN pnpm install --frozen-lockfile --filter ./packages/backendv2

COPY --chown=node packages/backendv2 /app/packages/backendv2

WORKDIR /app/packages/backendv2

ENV BASE_PATH=/v2

RUN pnpm run build

EXPOSE 3003

CMD [ "pnpm", "run", "dev" ]
