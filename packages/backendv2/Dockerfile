FROM node:11-alpine

RUN apk add --no-cache python2

COPY --chown=node package.json package-lock.json /app/

USER node
WORKDIR /app

RUN npm ci

COPY --chown=node . /app

ENV BASE_PATH /v2

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "start" ]
