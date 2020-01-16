FROM alpine:3.6

RUN apk update && \
    apk add nodejs && \
    apk add nodejs-npm && \
    mkdir /www

WORKDIR /www

ENV PORT=4200

COPY . .

RUN npm install && \
    npm install -g mirror-config-china --registry=http://registry.npm.taobao.org && \
    npm install node-sass

RUN chmod +x start.sh

EXPOSE 4200

CMD ["./start.sh"]
