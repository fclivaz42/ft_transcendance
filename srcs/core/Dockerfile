FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade
RUN apk add curl openssl

ARG KEYPATH
ARG CERTPATH

WORKDIR /sarif

RUN openssl req -x509 -newkey rsa:2048 -nodes -keyout ${KEYPATH} -out ${CERTPATH} -days 365 -subj "/C=CH/ST=Vaud/L=Lausanne/O=42/OU=42/CN=42lausanne.ch/UID=SARIF"

COPY package.json /sarif
RUN npm i

COPY srcs/ ./srcs

EXPOSE 443

ENTRYPOINT ["npm", "run", "start"]
