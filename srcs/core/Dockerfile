FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

ARG KEYPATH
ARG CERTPATH

WORKDIR /sarif

RUN openssl req -x509 -newkey rsa:2048 -nodes -keyout ${KEYPATH} -out ${CERTPATH} -days 365 -subj "/C=FR/ST=SG/L=St-Gallen/O=Bloem/OU=Dev/CN=localhost"

COPY package.json /sarif
RUN npm i

COPY srcs/ ./srcs

EXPOSE 443

ENTRYPOINT ["npm", "run", "start"]
