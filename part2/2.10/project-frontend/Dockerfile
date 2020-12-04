FROM node:14-alpine

WORKDIR /usr/src/app

COPY /package* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.18
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

