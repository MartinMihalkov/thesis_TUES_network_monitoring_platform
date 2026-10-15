FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN apk --no-cache add nodejs npm

COPY ./nginx.sh /nginx.sh

#RUN npm create vue@latest app --yes -- --router --default && \
    # cd app && \
    # npm install


CMD ["/nginx.sh"]
