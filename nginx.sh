#!/bin/sh

# Стартираме PHP-FPM като фонов процес (-D / daemonize)
php-fpm85 -D

cd /usr/share/nginx/html/app/platform

# npm run dev -- --host &

# Стартираме Nginx на преден план (държи контейнера пуснат)
nginx -g "daemon off;"