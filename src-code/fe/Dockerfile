# Dockerfile cho Frontend (React)

# Stage 1: Build ứng dụng với Node.js
FROM  node:20.18.0-alpine3.20 as build

WORKDIR /app

# Copy các file package và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source và build ứng dụng
COPY . .
RUN npm run build

# Stage 2: Sử dụng Nginx để phục vụ ứng dụng đã build
FROM  nginx:alpine

# Cài đặt envsubst (thuộc gói gettext) để cho phép thay thế biến môi trường
RUN apk add --no-cache gettext

# Copy file cấu hình Nginx (được đặt tên template) và các chứng chỉ SSL vào container
COPY ./nginx/default.conf /etc/nginx/templates/default.conf.template

# Copy các file build từ stage build vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose cổng 80 và 443 (cho HTTP và HTTPS)
EXPOSE 80
EXPOSE 443

# CMD: Thay thế biến môi trường trong file cấu hình và chạy Nginx ở foreground
CMD ["/bin/sh", "-c", "envsubst '$BACKEND_HOST $BACKEND_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
