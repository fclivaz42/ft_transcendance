FROM node:23.10.0-alpine

WORKDIR /app

COPY srcs ./srcs
COPY public ./public
COPY package.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY vite.config.js ./
COPY docker-entrypoint.sh ./

RUN npm i

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]