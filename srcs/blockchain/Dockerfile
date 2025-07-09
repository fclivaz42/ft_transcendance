FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY tsconfig.json /sarif

COPY package.json /sarif
RUN npm i

COPY hardhat.config.cjs /sarif
COPY docker-entrypoint.sh /sarif

COPY srcs/ ./srcs

ARG PROVIDER
ARG PRIVATE_KEY
ENV PROVIDER=${PROVIDER}
ENV PRIVATE_KEY=${PRIVATE_KEY}

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
