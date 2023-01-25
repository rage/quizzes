FROM node:11-alpine

USER node
WORKDIR /quizzes/dashboard

EXPOSE 5000
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm build
ENTRYPOINT ["/bin/sh", "-c"]

USER root
CMD [ "npm run dev" ]