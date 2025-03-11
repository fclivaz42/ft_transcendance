FROM node:22.13.1-alpine

RUN apk update
RUN apk upgrade

WORKDIR /sarif

EXPOSE 3000

# RUN yarn global add fastify-cli

ENTRYPOINT ["sh", "start.sh"]
