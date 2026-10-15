#!/bin/sh

cd /usr/share/nginx/html/app/platform

# npm run dev -- --host &

# Стартираме Nginx на преден план (държи контейнера пуснат)
nginx -g "daemon off;"