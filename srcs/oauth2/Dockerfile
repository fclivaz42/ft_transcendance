FROM node:24.4.0-alpine

RUN apk update
RUN apk upgrade

RUN apk add openssl

WORKDIR /sarif

COPY srcs ./srcs
COPY package.json ./

RUN npm i

COPY docker-entrypoint.sh ./


RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
