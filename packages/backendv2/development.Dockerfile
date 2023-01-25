FROM node:11-alpine

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python

COPY --chown=node . /app
ENV BASE_PATH /v2

USER node
WORKDIR /app

RUN npm ci
RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "dev" ]