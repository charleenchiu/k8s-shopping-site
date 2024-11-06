

```sh
docker volume create mysql-volume
```


```sh
#這次設定的資料庫名稱是：ShoppingSiteDB
#這次設定的root帳號密碼是：mysql
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_DATABASE=ShoppingSiteDB -v mysql-volume:/var/lib/mysql -p 3306:3306 -d mysql:latest
```

```sh
npm install mysql2
```

```sh
npm install mysql2
```

```sh
npm install mysql2
```

成功安裝了 `mysql2` 套件的回應訊息：
```sh
added 13 packages in 3s

1 package is looking for funding
  run `npm fund` for details
```  

我執行SQL的方法：
```sh
# 先編寫好init-db.js
cd vprofile-project\ShoppingSite
node init-db.js
```

===================================================
接下來可以使用 MySQL 客戶端或任何支持 MySQL 的工具來執行 `CREATE` 的 SQL 指令。以下是幾種常見的方法：

### 方法一：使用 MySQL 客戶端
1. **連接到 MySQL 容器**：
   - 使用以下命令連接到 MySQL 容器：
     ```bash
     docker exec -it mysql-container mysql -u root -p
     ```
   - 輸入您在啟動容器時設置的 MySQL root 密碼。

2. **執行 SQL 指令**：
   - 連接到 MySQL 後，您可以執行 `CREATE` 指令來創建資料庫和資料表。例如：
     ```sql
     CREATE DATABASE mydatabase;
     USE mydatabase;
     CREATE TABLE products (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         price DECIMAL(10, 2) NOT NULL
     );
     ```

### 方法二：使用 MySQL Workbench
1. **下載並安裝 MySQL Workbench**：
   - 您可以從 [MySQL 官網](https://dev.mysql.com/downloads/workbench/) 下載並安裝 MySQL Workbench。

2. **連接到 MySQL 伺服器**：
   - 打開 MySQL Workbench，並創建一個新的連接，使用以下連接資訊：
     - Hostname: `localhost`
     - Port: `3306`
     - Username: `root`
     - Password: 您設置的 MySQL root 密碼(這次設定的是：mysql)

3. **執行 SQL 指令**：
   - 連接成功後，您可以在 MySQL Workbench 中執行 `CREATE` 指令來創建資料庫和資料表。

### 方法三：使用 Node.js 腳本
1. **創建一個 Node.js 腳本**：
   - 您可以創建一個 Node.js 腳本來執行 SQL 指令。例如，創建一個名為 `init-db.js` 的檔案，內容如下：
     ```javascript
     import mysql from 'mysql2';

     const connection = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'my-secret-pw'
     });

     connection.connect();

     connection.query('CREATE DATABASE IF NOT EXISTS mydatabase', (err, results) => {
         if (err) throw err;
         console.log('Database created');
     });

     connection.query('USE mydatabase', (err, results) => {
         if (err) throw err;
     });

     connection.query(`
         CREATE TABLE IF NOT EXISTS products (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             price DECIMAL(10, 2) NOT NULL
         )
     `, (err, results) => {
         if (err) throw err;
         console.log('Table created');
     });

     connection.end();
     ```

2. **運行 Node.js 腳本**：
   - 在終端中運行以下命令來執行腳本：
     ```bash
     node init-db.js
     ```

這些方法都可以幫助您執行 `CREATE` 的 SQL 指令來創建資料庫和資料表。如果還有其他問題或需要進一步的幫助，隨時告訴我！