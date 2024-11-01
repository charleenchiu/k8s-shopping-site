# 功能說明書：User Service

## 一、概述

`user-service` 是一個用於處理用戶相關操作的微服務，基於 Node.js 和 Express 框架實現。該服務運行在指定的埠號上，並提供基本的 HTTP 接口以回應請求。

## 二、核心組件

### 1. `index.js`

`index.js` 是應用的主要入口文件，負責啟動 Express 應用並設置路由。

#### 主要功能：
- **引入 Express 模組**：通過 `const express = require('express');` 引入 Express 框架。
- **創建應用實例**：使用 `const app = express();` 創建一個新的 Express 應用實例。
- **設置埠號**：根據環境變數 `PORT` 設定服務運行的埠號，默認為 `3001`。
- **路由定義**：
  - 當用戶訪問根路由 `/` 時，回應訊息 "Hi, this is user-service!"。
- **啟動伺服器**：使用 `app.listen(port, '0.0.0.0', () => { ... });` 監聽指定埠，並在啟動時輸出訊息以確認服務運行狀態。

#### 代碼範例：
```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hi, this is user-service!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`User Service listening at http://0.0.0.0:${port}`);
});
```

### 2. `package.json`

`package.json` 文件包含應用的元數據和依賴管理。

#### 主要功能：
- **應用名稱**：`"name": "user-service"` 指定了應用的名稱。
- **版本號**：`"version": "1.0.0"` 標示應用的版本。
- **主檔案**：`"main": "index.js"` 表示應用的主入口檔案。
- **腳本命令**：`"scripts"` 中定義了可以通過 `yarn` 執行的命令。
  - `"test": "node index.js"`：定義測試命令，實際上這裡是用來啟動應用。
- **依賴**：`"dependencies"` 中列出了應用所需的 npm 包。
  - `express` 是主要的 Web 框架。

#### 代碼範例：
```json
{
  "name": "user-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "node index.js"
  },
  "dependencies": {
    "express": "^4.21.1"
  }
}
```

### 3. `Dockerfile`

`Dockerfile` 定義了如何構建 `user-service` 的 Docker 映像。

#### 主要功能：
- **基礎映像**：使用 Node.js 官方映像作為基礎映像，版本為 `14`。
- **設置工作目錄**：`WORKDIR /usr/src/app` 設定應用的工作目錄。
- **複製依賴文件**：將 `package.json` 和 `package-lock.json` 複製到映像中。
- **安裝依賴**：使用 `RUN yarn install` 安裝應用所需的依賴。
- **複製應用代碼**：將應用程式的所有代碼複製到映像中。
- **開放端口**：開放 `3001` 端口以接收外部請求。
- **啟動命令**：使用 `CMD ["node", "index.js"]` 指定容器啟動時運行的命令。

#### 代碼範例：
```dockerfile
# 使用 Node.js 官方映像
FROM node:14

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./ 

# 安裝依賴
RUN yarn install

# 複製應用程式代碼
COPY . .

# 開放端口
EXPOSE 3001

# 啟動應用程式
CMD ["node", "index.js"]
```

## 三、使用說明

1. **啟動服務**：
   - 在終端中執行 `yarn start` 或使用 Docker 啟動容器來運行服務。
2. **訪問服務**：
   - 使用瀏覽器或 HTTP 客戶端訪問 `http://localhost:3001/` 來查看服務的回應。

## 四、結論

`user-service` 提供了一個簡單的用戶服務接口，能夠響應基本的 HTTP 請求，並且具備可擴展性以支持後續功能的實現。透過 Docker 構建和部署，該服務可方便地集成至更大的微服務架構中。