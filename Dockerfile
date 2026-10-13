FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN apk --no-cache add php php-fpm php-mysqli nodejs npm

COPY ./www.conf /etc/php85/php-fpm.d/www.conf

COPY ./nginx.sh /nginx.sh

#RUN npm create vue@latest app --yes -- --router --default && \
    # cd app && \
    # npm install


CMD ["/nginx.sh"]
