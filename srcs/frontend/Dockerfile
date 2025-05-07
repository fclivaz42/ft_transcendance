FROM node:23.10.0-alpine

WORKDIR /app

COPY srcs ./srcs
COPY public ./public
COPY package.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./

RUN npm i
RUN npm run build

WORKDIR /var/www/sarif-frontend

RUN mv /app/dist ./dist
RUN mv /app/public ./public
RUN rm -rf /app/
