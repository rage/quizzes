FROM node:12-alpine as builder

RUN apk --no-cache update \
&& apk --no-cache add g++ make bash zlib-dev libpng-dev python2 \
&&  rm -fr /var/cache/apk/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci

ENV NODE_ENV=production

RUN npm run build

FROM nginx:1.15-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY dashboard-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
