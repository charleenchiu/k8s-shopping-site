舊DB名稱：ShoppingSiteDB
新DB名稱：ShoppingSiteDB
docker volume：mysql-volume

你需要確認你的 MySQL 容器正確地掛載了 mysql-volume。以下是步驟，以確保你的資料庫操作在使用 Docker volume 的情況下順利進行：

1. 確保容器掛載了 Docker volume
確認你的 MySQL 容器是用 mysql-volume 啟動的，例如：

sh

Copy
docker run -it --name mysql-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD=yourpassword -v mysql-volume:/var/lib/mysql mysql:8
2. 進入 Docker 容器
打開命令提示符或終端，並進入 MySQL 容器：

sh

Copy
docker exec -it mysql-container /bin/bash
3. 備份現有資料庫
在 Docker 容器內執行：

sh

Copy
mysqldump -u root -p ShoppingSiteDB > /var/lib/mysql/ShoppingSiteDB.sql
這會將 ShoppingSiteDB 資料庫備份到 mysql-volume 中的 ShoppingSiteDB.sql 文件。

4. 建立新資料庫
接下來，創建新資料庫：

sh

Copy
mysql -u root -p -e "CREATE DATABASE ShoppingSiteDB"
5. 將資料導入新資料庫
然後將備份的資料導入到新資料庫：

sh

Copy
mysql -u root -p ShoppingSiteDB < /var/lib/mysql/ShoppingSiteDB.sql
6. 確認資料已正確轉移
檢查新資料庫中的資料是否完整。

7. 刪除舊資料庫
最後，刪除舊的資料庫：

sh

Copy
mysql -u root -p -e "DROP DATABASE ShoppingSiteDB"
這樣，你的資料庫就完成了更名過程。同時，你的資料會保存在 Docker volume 中，確保數據持久性。