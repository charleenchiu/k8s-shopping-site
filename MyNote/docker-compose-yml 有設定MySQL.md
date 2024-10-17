如果你目前的專案還未用到資料庫，那麼 MongoDB 的設定並不是必須的。等到你未來決定加入 MySQL 資料庫時，再修改 `docker-compose.yml` 加入 MySQL 的配置即可。

### 當加入 MySQL 時的 `docker-compose.yml` 範例：
當你未來需要用到 MySQL，可以這樣修改 `docker-compose.yml`，並讓微服務連接到 MySQL：

```yaml
version: '3'
services:
  order-service:
    build: ./order-service
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=example
      - DB_NAME=shop_db
    depends_on:
      - mysql
    networks:
      - backend

  payment-service:
    build: ./payment-service
    ports:
      - "5002:5002"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=example
      - DB_NAME=shop_db
    depends_on:
      - mysql
    networks:
      - backend

  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: shop_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - backend

networks:
  backend:
    driver: bridge

volumes:
  mysql-data:
```

### 說明：
1. **`mysql` 容器**：這裡定義了一個 MySQL 服務，設定了 `MYSQL_ROOT_PASSWORD` 和要創建的資料庫 `shop_db`。
2. **連接到 MySQL 的環境變數**：
   - 在微服務容器中，你可以用環境變數來設定資料庫的連接資訊（`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`），讓微服務可以通過這些變數來連接到 MySQL。
   - 這裡的 `DB_HOST=mysql` 表示服務會連接到名為 `mysql` 的容器，這個名稱對應 `docker-compose.yml` 中的 MySQL 服務。
3. **`depends_on`**：表示微服務依賴於 MySQL 服務，確保 MySQL 先啟動後再啟動微服務。

### 總結：
- 當前不需要資料庫時，可以先不加 MongoDB 或 MySQL。
- 未來如果加入 MySQL，可以按照上述方式將 MySQL 添加到 `docker-compose.yml` 並配置好微服務的連接資訊。

這樣你的架構會更靈活，等到有需求時再增加資料庫支援。