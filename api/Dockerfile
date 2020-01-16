FROM alpine:3.6

RUN apk update && \
    apk add nodejs && \
    apk add nodejs-npm && \
    apk add mongodb && \
    mkdir /app && \
    mkdir /data && \
    mkdir /data/db

WORKDIR /app

ENV PORT=3000

COPY . .

RUN npm install

RUN chmod +x start.sh

EXPOSE 3000

CMD [".api/start.sh"]
