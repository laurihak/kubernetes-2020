FROM node:14-alpine AS build-step

WORKDIR /usr/src/app

COPY /package* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.18
COPY --from=build-step /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

