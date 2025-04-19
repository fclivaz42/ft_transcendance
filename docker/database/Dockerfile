FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

EXPOSE 3000

ENTRYPOINT ["sh", "start.sh"]
