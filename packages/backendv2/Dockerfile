FROM node:11-alpine

COPY --chown=node package.json package-lock.json /app/

USER node
WORKDIR /app

RUN npm ci

COPY --chown=node . /app

ENV BASE_PATH /v2

RUN npm run build

EXPOSE 6000

CMD [ "npm", "run", "start" ]
