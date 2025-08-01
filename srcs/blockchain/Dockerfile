FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade
RUN apk add openssl

WORKDIR /sarif

COPY tsconfig.json /sarif

COPY package.json /sarif
RUN npm i

COPY hardhat.config.cjs /sarif

COPY srcs/ ./srcs

ARG PROVIDER
ARG PRIVATE_KEY
ENV PROVIDER=${PROVIDER}
ENV PRIVATE_KEY=${PRIVATE_KEY}

COPY ./docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
