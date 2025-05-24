FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY tsconfig.json /sarif

COPY package.json /sarif
RUN npm i

COPY hardhat.config.cjs /sarif

COPY srcs/ ./srcs

# RUN npx hardhat compile

EXPOSE 80

ENTRYPOINT ["sh", "-c", "node srcs/scripts/main.ts"]
