對於你的 `web-client` 的 `package.json` 來說，基於你的架構以及你希望將其 Docker 化並進行測試的需求，`scripts` 段落可以這樣設置：

```json
{
  "scripts": {
    "start": "live-server --port=3000 --open=src/index.html",
    "build": "webpack --config webpack.config.js",
    "test": "mocha test/**/*.js",
    "docker-build": "docker build -t web-client:latest .",
    "docker-run": "docker run -p 80:80 web-client:latest"
  }
}
```

這樣的設置涵蓋了：

1. **start**: 使用 `live-server` 來啟動前端開發伺服器，並設置為監聽 80 端口。
2. **build**: 假設你使用 Webpack 打包 React 應用，可以填入 `webpack` 命令來進行構建。如果你還沒有 `webpack.config.js`，可以創建一個適合你的應用。
3. **test**: 使用 `mocha` 測試框架來運行測試，指向測試文件。
4. **docker-build**: 用來構建 Docker 映像，標記為 `web-client:latest`。
5. **docker-run**: 運行 Docker 映像，將 80 端口映射到宿主機的 80 端口，以便於在瀏覽器中查看應用。

確認一下你是否有 `webpack` 和相應的配置檔案，來完成 `build` 步驟。