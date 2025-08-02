FROM node:24.4.0-alpine

WORKDIR /app-srcs

COPY srcs ./srcs
COPY public ./public
COPY package.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY vite.config.js ./
COPY docker-entrypoint.sh ./

RUN npm i
RUN npm run build
RUN rm -rf ./public/index.html ./public/assets/*.css
RUN cp -rf ./public/* dist/
RUN rm -rf ./public
RUN mv ./dist /app

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
