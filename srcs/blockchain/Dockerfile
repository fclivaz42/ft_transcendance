FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY srcs/ ./srcs
COPY tsconfig.json /sarif
COPY package.json /sarif
COPY hardhat.config.cjs /sarif

RUN npm i
EXPOSE 80

ENTRYPOINT ["sh", "-c", "node srcs/scripts/main.ts"]
