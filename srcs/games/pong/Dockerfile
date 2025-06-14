FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY package.json /sarif

RUN npm i
COPY srcs/ ./srcs

ENTRYPOINT ["npm", "run", "start"]
