# 使用 Node.js 官方映像
FROM node:14

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製應用程式程式碼
COPY . .

# 開放端口
EXPOSE 3004

# 啟動應用程式
CMD ["node", "index.js"]
