FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY tsconfig.json /sarif

COPY package.json /sarif
RUN npm i

COPY hardhat.config.cjs /sarif

COPY srcs/ ./srcs

WORKDIR /sarif

EXPOSE 8080

ENTRYPOINT ["node", "srcs/scripts/main.ts"]
