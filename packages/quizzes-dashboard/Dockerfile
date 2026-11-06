# Build context is the repository root (see bin/build-docker-dashboardv2.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-alpine AS build

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')"

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/quizzes-dashboard/package.json packages/quizzes-dashboard/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter ./packages/quizzes-dashboard

COPY packages/quizzes-dashboard packages/quizzes-dashboard
# Checkouts made under a strict umask would leave public/ unreadable to the runtime user.
RUN chmod -R a+rX packages/quizzes-dashboard/public

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter ./packages/quizzes-dashboard run build

FROM node:26.13.0-alpine

# The standalone server binds to $HOSTNAME, which the container runtime sets to the pod name.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=5000

# Standalone output mirrors the workspace layout from the repository root; static assets and
# public/ are not part of it.
WORKDIR /app
COPY --from=build /app/packages/quizzes-dashboard/.next/standalone ./
COPY --from=build /app/packages/quizzes-dashboard/.next/static packages/quizzes-dashboard/.next/static
COPY --from=build /app/packages/quizzes-dashboard/public packages/quizzes-dashboard/public

WORKDIR /app/packages/quizzes-dashboard

USER node

EXPOSE 5000

CMD [ "node", "server.js" ]
