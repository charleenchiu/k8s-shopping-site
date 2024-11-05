# db_connection_pool.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 從環境變數取得 MongoDB 連線資訊
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = 'ShoppingSiteDB'

# 建立 MongoDB 連線池
client = MongoClient(MONGODB_URI)

# 獲取指定的資料庫
db = client[DB_NAME]

# 將資料庫物件導出
def get_db():
    return db
