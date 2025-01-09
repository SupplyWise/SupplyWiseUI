FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

COPY supplywise-ui/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]