FROM node:11-alpine

RUN apk add --no-cache librdkafka

COPY --chown=node package.json package-lock.json /app/

USER node
WORKDIR /app

RUN env BUILD_LIBRDKAFKA=0 npm ci

COPY --chown=node . /app

ENV BASE_PATH /v2

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "start" ]
