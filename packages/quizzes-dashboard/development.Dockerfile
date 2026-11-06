# Build context is the repository root (see docker-compose.yml): the pnpm workspace files and
# lockfile live there.
FROM node:26.13.0-alpine

RUN mkdir -p /app && chown -R node /app

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')" \
    && rm /tmp/package.json

USER node

WORKDIR /app

COPY --chown=node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --chown=node packages/quizzes-dashboard/package.json /app/packages/quizzes-dashboard/

RUN pnpm install --frozen-lockfile --filter ./packages/quizzes-dashboard

COPY --chown=node packages/quizzes-dashboard /app/packages/quizzes-dashboard

WORKDIR /app/packages/quizzes-dashboard

EXPOSE 5000

CMD [ "pnpm", "run", "dev" ]
