FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN apk --no-cache add nodejs npm

COPY ./nginx.sh /nginx.sh


CMD ["/nginx.sh"]
