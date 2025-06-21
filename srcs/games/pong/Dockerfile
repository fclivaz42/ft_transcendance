FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade
RUN apk add openssl

WORKDIR /sarif

COPY package.json /sarif

RUN npm i
COPY srcs/ ./srcs

RUN openssl req -x509 -newkey rsa:2048 -nodes -keyout /etc/ssl/private/sarif.key -out /etc/ssl/certs/sarif.crt -days 365 -subj "/C=CH/ST=Vaud/L=Lausanne/O=42/OU=42/CN=*.42lausanne.ch/UID=SARIF"

ENTRYPOINT ["npm", "run", "start"]
