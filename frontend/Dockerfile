# --- Stage 1: Build Vue App ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# 複製編譯後的靜態檔案到 Nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自定義的 Nginx 設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]