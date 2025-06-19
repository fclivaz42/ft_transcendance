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
RUN npm run vitebuild
RUN rm -rf ./public/index.html ./public/assets/*.css
RUN cp -rf ./public/* dist/
RUN rm -rf ./public
RUN mkdir -p /var/www/sarif-frontend
RUN mv ./dist/* /var/www/sarif-frontend/

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
