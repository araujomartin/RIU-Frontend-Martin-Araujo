FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx configuration and dist files
COPY nginx.conf /etc/nginx/conf.d
COPY ./dist/RIU-frontend/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80