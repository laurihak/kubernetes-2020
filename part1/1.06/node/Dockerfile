FROM node:14-alpine

WORKDIR /app

COPY /node/package*.json ./
COPY ./node ./
RUN npm install

CMD node app.js
