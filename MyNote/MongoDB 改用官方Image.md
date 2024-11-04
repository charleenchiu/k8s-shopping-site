看起來你在 MongoDB 容器中遇到了一些問題，尤其是 `mongo` 命令和 `docker-compose` 都無法使用。這是因為 MongoDB 容器中並沒有安裝 MongoDB Shell（`mongo` CLI）。讓我們一步一步來解決這個問題。

### 1. 進入 MongoDB 容器

你已經成功進入了 MongoDB 容器的 bash shell，但 MongoDB Shell 可能並不包含在你當前使用的映像中。確認這一點，你可以使用以下命令來檢查已安裝的 MongoDB 版本：

```bash
mongod --version
```

如果這也返回 `command not found` 的錯誤，表示 MongoDB CLI 沒有安裝。

### 2. 使用 Docker 官方 MongoDB 映像

確保使用正確的 MongoDB 映像來運行你的容器。你可以執行以下命令來刪除目前的容器並使用官方的 MongoDB 映像：

```bash
docker stop mongodb
docker rm mongodb
```

接下來，運行 MongoDB 容器：

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

### 3. 進入新的 MongoDB 容器

現在你可以再次嘗試進入 MongoDB 容器並運行 `mongo` 命令：

```bash
docker exec -it mongodb mongo
```

這應該會進入 MongoDB shell，讓你可以執行 MongoDB 命令。

### 4. 使用 MongoDB Shell 創建數據庫和集合

在進入 MongoDB shell 之後，你可以創建數據庫和集合。使用以下命令來創建與 MySQL 中相同的數據庫和集合：

```javascript
use ShoppingSiteDB

db.createCollection("users")
db.createCollection("products")
db.createCollection("orderDetails")
db.createCollection("orders")
db.createCollection("payments")
```

### 5. 確認 Docker Compose 安裝（可選）

如果你希望使用 Docker Compose 而不是手動運行 Docker 命令，你需要先確認 Docker Compose 是否已安裝。可以在命令行中運行以下命令來檢查：

```bash
docker-compose --version
```

如果這返回版本號，那麼 Docker Compose 已經安裝。如果沒有，你可以按照 [Docker Compose 官方文檔](https://docs.docker.com/compose/install/) 中的指示安裝它。

### 結論

1. 確保使用官方的 MongoDB 映像運行容器。
2. 進入容器後，使用 `mongo` 進入 MongoDB shell。
3. 在 MongoDB shell 中創建相應的數據庫和集合。

如果你有其他問題或需要進一步的幫助，隨時告訴我！