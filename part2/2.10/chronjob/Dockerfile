FROM alpine:3.10
WORKDIR /app
RUN apk add --no-cache --upgrade bash && apk add curl 
COPY . .
CMD ["/bin/bash", "./script.sh"]
