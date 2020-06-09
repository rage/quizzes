FROM node:12-alpine

COPY --chown=node package.json package-lock.json /app/

USER node
WORKDIR /app

RUN npm ci

COPY --chown=node . /app

RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start" ]
