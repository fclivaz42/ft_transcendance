FROM node:23.10.0-alpine

WORKDIR /libs

COPY interfaces ./interfaces
COPY helpers ./helpers

COPY package.json ./

RUN npm i