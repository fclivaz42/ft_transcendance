FROM node:23.10.0-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

EXPOSE 443

ENTRYPOINT ["sh", "start.sh"]
