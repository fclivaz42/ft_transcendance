FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

COPY srcs/ ./srcs
COPY package.json /sarif

RUN npm i

EXPOSE 443

ENTRYPOINT ["sh", "-c", "npm run ${RUNMODE}"]
