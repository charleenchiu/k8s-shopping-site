# 第一階段：構建階段
# 使用官方 Node.js 映像作為基礎映像
FROM node:14 AS build

# 設定工作目錄
# 建立應用程式目錄
# 用途：設定容器內的工作目錄。之後所有的 COPY、ADD、RUN 等指令都會基於這個目錄運行。
# 功能：如果目標目錄不存在，Docker 會自動建立它。
# COPY . .會將Dockerfile所在目錄（即order-service）中的所有檔案複製到容器內的這個目錄。
# 確保在order-service目錄下運行docker build命令，這樣才能正確地將檔案複製到容器中。如果在其他目錄運行，可能會出現檔案路徑的錯誤。
WORKDIR /user-service

# 複製 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安裝Application dependencies
RUN yarn install

# 複製Application code到工作目錄(包括src/和test/(要用pipeline做測試))
COPY . .

# 執行構建指令（如果有）
# 為什麼這個Dockerfile不用"RUN yarn run build"
# "RUN yarn run build" 這行指令通常用於在構建過程中執行應用程式的構建步驟，例如打包前端資源、編譯代碼或生成生產環境所需的檔案。如果你的應用程式需要進行這些步驟，那麼 "RUN yarn run build" 是必要的。
# 如果你的應用程式不需要額外的構建步驟，例如只是純粹的後端服務或已經包含所有必要的檔案，那麼就不需要使用 "RUN yarn run build"。要視你的應用程式具體情況而定。
# 所以，最終是否需要這行指令，取決於你的應用程式是否有這樣的構建需求。如果你確定需要，請將 "RUN yarn run build" 加入到第一階段中，讓構建過程能夠完成所有必要的步驟。
# RUN yarn run build

# 第二階段：最小化映像
FROM node:14

# 設定工作目錄
WORKDIR /user-service

# 從第一階段複製需要的檔案到工作目錄
COPY --from=build /user-service .

# 安裝應用程式依賴（只複製必要的檔案）
RUN yarn install --only=production

# 暴露(指定)應用程式的端口
EXPOSE 3003

# 啟動應用程式
# 這行命令設定了 Docker 容器啟動時要執行的命令。在這裡，node 是要啟動的主程式
CMD ["node", "src/user-service.js"]