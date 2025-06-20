FROM node:23.10.0-alpine

WORKDIR /libs-src

COPY interfaces ./interfaces
COPY helpers ./helpers
COPY docker-entrypoint.sh /

COPY package.json ./

RUN npm i

RUN mkdir /libs

RUN mkdir /scripts

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]