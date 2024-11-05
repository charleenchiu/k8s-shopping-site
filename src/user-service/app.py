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


# 讀取 .env 文件的設定
dotenv_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path)

# 取得 MongoDB 連線 URL，並初始化連接
mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
client = MongoClient(mongo_url)
db = client['ShoppingSiteDB']
users_collection = db['users']

app = Flask(__name__)

# 定義路由，取得所有使用者資料
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find())
        for user in users:
            user['_id'] = str(user['_id'])  # 將 ObjectId 轉為字串
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 定義路由，透過 ID 取得特定使用者資料
@app.route('/users/<string:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        user['_id'] = str(user['_id'])  # 將 ObjectId 轉為字串
        return jsonify(user)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 啟動伺服器，並監聽指定的埠號
if __name__ == '__main__':
    user_service_port = int(os.getenv('USER_SERVICE_PORT', 3001))
    print(f"User service listening at port {user_service_port}")
    app.run(host='0.0.0.0', port=user_service_port)
