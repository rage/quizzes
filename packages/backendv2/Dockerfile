FROM node:13-alpine

COPY --chown=node package.json package-lock.json /app/

USER node
WORKDIR /app

RUN npm ci

COPY --chown=node . /app

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
