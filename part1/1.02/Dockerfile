FROM node:14-alpine

WORKDIR /app

COPY /package*.json ./
COPY ./ ./
RUN npm install

CMD node app.js
