from pymongo import MongoClient
import os
from dotenv import load_dotenv

# 載入 .env 檔案中的環境變數
load_dotenv()

# 取得 EC2 私有 IP
ec2_private_ip = os.getenv('EC2_PRIVATE_IP')
print(ec2_private_ip)

# 定義資料庫名稱
db_name = 'ShoppingSiteDB'

# 連接到 MongoDB
client = MongoClient(f'mongodb://{ec2_private_ip}:27017/')
db = client[db_name]  # 創建或選擇資料庫

# 創建資料集合（相當於資料表）
# 客戶資料集合
users_collection = db.users
users_collection.create_index('id', unique=True)

# 商品資料集合
products_collection = db.products
products_collection.create_index('id', unique=True)

# 訂單細項資料集合
order_details_collection = db.order_details
order_details_collection.create_index('id', unique=True)

# 訂單資料集合
orders_collection = db.orders
orders_collection.create_index('id', unique=True)

# 付款資料集合
payments_collection = db.payments
payments_collection.create_index('id', unique=True)

print('Database and collections created successfully')

# 在結束時關閉 MongoDB 連線
client.close()
