FROM node:11-alpine

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}

RUN apk --no-cache update \
&& apk --no-cache add g++ make bash zlib-dev libpng-dev postgresql-client redis python2 \
&&  rm -fr /var/cache/apk/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "npm", "start" ]

ENV GIT_COMMIT=${GIT_COMMIT}