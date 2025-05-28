FROM node:23.10.0-alpine

EXPOSE 3000

WORKDIR /sarif

COPY srcs ./srcs
COPY package.json ./

RUN npm i

COPY ./docker-entrypoint.sh ./docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]