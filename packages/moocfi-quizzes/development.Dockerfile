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
      util-linux \
      python

COPY --chown=node . /quizzes/moocfi-quizzes

USER node
WORKDIR /quizzes/moocfi-quizzes

RUN npm ci
RUN (cd ./example && npm ci)
RUN npx browserslist@latest --update-db

EXPOSE 1234
ENTRYPOINT ["/bin/sh", "-c"]
CMD [ "cd example && npm start" ]