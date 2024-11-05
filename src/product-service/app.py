# 匯入 Flask 框架，用於建立 Web 應用程式，並提供 API 回應功能 (jsonify) 及處理請求資料 (request)
from flask import Flask, jsonify, request

# 匯入 MongoClient，用於連接 MongoDB 資料庫
from pymongo import MongoClient

# 匯入 ObjectId，這是 MongoDB 中 _id 欄位的預設格式，用於識別資料庫中的每個文件
from bson.objectid import ObjectId

# 匯入 os 模組，用於訪問作業系統的環境變數
import os

# 匯入 load_dotenv 函數，用於讀取 .env 文件並將環境變數載入到程序中
from dotenv import load_dotenv

# 匯入 Path 類別，這是一個處理檔案路徑的模組，方便獲取和管理 .env 檔案的路徑
from pathlib import Path


# 設定 .env 文件路徑並載入環境變數
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client['product_db']
products_collection = db['products']

# 定義 API 路由 (例如：獲取、創建、更新、刪除商品)
# ...

if __name__ == "__main__":
    port = int(os.getenv("PRODUCT_SERVICE_PORT", 5000))
    app.run(host="0.0.0.0", port=port)
