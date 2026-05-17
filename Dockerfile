# Stage 1: Build mã nguồn VueJS sử dụng Docker Cache để tăng tốc
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build

# Stage 2: Đẩy thành phẩm vào Nginx production
FROM nginx:1.25-alpine AS production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]