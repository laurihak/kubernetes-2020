FROM node:14-alpine

WORKDIR /usr/src/app

COPY /package* ./
RUN npm install

COPY . .

CMD ["npm", "start"]

