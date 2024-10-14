# 第一階段：構建階段
# 使用 Node.js 作為基礎映像
FROM node:14 AS build

# 設定工作目錄
WORKDIR /web-client

# 複製 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安裝應用程式依賴
RUN yarn install

# 複製應用程式代碼
COPY . .

# 構建應用程式
# 這個命令會把源代碼編譯打包，生成的靜態文件就會存放在 ./dist 目錄中。
RUN yarn run build

# 第二階段：最小化映像
# 使用更輕量的基礎映像（例如 alpine 版本的 nginx）
FROM nginx:alpine

# 複製構建的檔案到 nginx 預設的網站根目錄
COPY --from=build /web-client/dist /usr/share/nginx/html

# 指定 port
EXPOSE 3000

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
