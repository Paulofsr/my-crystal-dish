FROM alpine:3.6

RUN apk update && \
    apk add nodejs && \
    apk add nodejs-npm && \
    mkdir /www

WORKDIR /www

ENV PORT=4200

COPY ./web .

RUN npm install

RUN chmod +x start.sh

EXPOSE 4200

CMD ["./start.sh"]
