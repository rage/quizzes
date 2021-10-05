FROM node:11-alpine

USER node
VOLUME /quizzes/dashboard
WORKDIR /quizzes/dashboard

EXPOSE 5000
ENTRYPOINT ["/bin/sh", "-c"]
CMD [ "npm ci && npm run build && npm run dev" ]