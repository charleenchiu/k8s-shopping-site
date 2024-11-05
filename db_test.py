# db_test.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from config import get_orders_url  # 從 config.py 中引入 get_orders_url 函數

# 載入環境變數
load_dotenv()

# 從環境變數取得 MongoDB 連線資訊
MONGODB_URI = f"mongodb://{os.getenv('EC2_PRIVATE_IP', 'localhost')}:27017"
DB_NAME = 'ShoppingSiteDB'

# 建立 MongoDB 連線
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# 測試連接的自執行異步函數
def test_connection():
    try:
        # 執行一個簡單的查詢
        result = db.command('ping')
        print('Query result:', result)  # 應該回傳 { 'ok': 1 }
    except Exception as error:
        print('Database connection error:', error)

# 調用測試函數
if __name__ == '__main__':
    test_connection()
