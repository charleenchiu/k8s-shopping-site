要在 Docker 上的 MongoDB 中創建一個同名且結構相似的資料庫，你可以按照以下步驟進行操作。由於 MongoDB 和 MySQL 之間有結構上的差異，資料庫的表格（tables）在 MongoDB 中對應於集合（collections）。以下是你如何在 MongoDB 中創建名為 `ShoppingSiteDB` 的資料庫以及對應的集合的步驟。

### 1. 進入 MongoDB Shell

首先，你需要進入正在運行的 MongoDB 容器的 shell。執行以下命令來進入 MongoDB 的 shell：

```bash
docker exec -it mongodb mongo
```

### 2. 創建資料庫

在 MongoDB shell 中，使用以下命令創建資料庫：

```javascript
use ShoppingSiteDB
```

這會創建一個名為 `ShoppingSiteDB` 的資料庫（如果尚未存在）。

### 3. 創建集合

接下來，你可以創建對應於 MySQL 中的表格的集合。在 MongoDB 中，你不需要明確定義資料結構，但你可以使用 `insert` 命令來添加資料並自動創建集合。以下是創建集合的命令：

```javascript
db.createCollection("users")
db.createCollection("products")
db.createCollection("orderDetails")
db.createCollection("orders")
db.createCollection("payments")
```

### 4. 定義資料結構（可選）

雖然 MongoDB 是一個無模式的資料庫，你可以隨意插入資料，但你可以定義一個基本的資料結構，來說明每個集合應該包含的欄位。例如，你可以這樣插入一些樣本資料：

```javascript
// 在 users 集合中插入資料
db.users.insertOne({
    name: "John Doe"
})

// 在 products 集合中插入資料
db.products.insertOne({
    name: "Product A",
    price: 100.00
})

// 在 orderDetails 集合中插入資料
db.orderDetails.insertOne({
    productId: 1,
    quantity: 2
})

// 在 orders 集合中插入資料
db.orders.insertOne({
    userId: 1,
    orderDetailId: 1
})

// 在 payments 集合中插入資料
db.payments.insertOne({
    orderId: 1,
    amount: 200.00
})
```

### 5. 確認資料結構

你可以通過查詢集合來確認資料是否正確插入：

```javascript
db.users.find()
db.products.find()
db.orderDetails.find()
db.orders.find()
db.payments.find()
```

### 小結

以上步驟將幫助你在 Docker 的 MongoDB 中創建與 MySQL 中相同名稱的資料庫和集合。由於 MongoDB 的無模式特性，資料結構相對靈活，因此你可以根據需求進行調整。如果你有任何問題或需要進一步的幫助，隨時告訴我！