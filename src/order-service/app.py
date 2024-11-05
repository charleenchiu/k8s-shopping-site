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

# 載入環境變數 (.env) 檔案
dotenv_path = Path('../../.env')
load_dotenv(dotenv_path=dotenv_path)

# 連接 MongoDB 資料庫
client = MongoClient(os.getenv('MONGO_URI'))
db = client['order_database']  # 資料庫名稱
orders_collection = db['orders']  # 訂單集合 (Collection)

# 建立 Flask 應用程式
app = Flask(__name__)

# 取得所有訂單
@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = list(orders_collection.find())  # 從資料庫查詢所有訂單
        for order in orders:
            order['_id'] = str(order['_id'])  # 將 ObjectId 轉為字串方便 JSON 格式
        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 取得單一訂單
@app.route('/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = orders_collection.find_one({'_id': ObjectId(order_id)})  # 查詢單一訂單
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        order['_id'] = str(order['_id'])
        return jsonify(order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 新增訂單
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    user_id = data.get('userId')
    order_time = data.get('orderTime')
    details = data.get('details', [])

    try:
        # 新增訂單的主資訊
        order = {
            'userId': user_id,
            'orderTime': order_time,
            'details': details
        }
        result = orders_collection.insert_one(order)
        order_id = str(result.inserted_id)
        order['_id'] = order_id
        return jsonify(order), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 更新訂單
@app.route('/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.get_json()
    user_id = data.get('userId')
    order_time = data.get('orderTime')
    details = data.get('details', [])

    try:
        # 更新訂單的主要資訊
        updated_order = {
            'userId': user_id,
            'orderTime': order_time,
            'details': details
        }
        result = orders_collection.update_one({'_id': ObjectId(order_id)}, {'$set': updated_order})
        
        if result.matched_count == 0:
            return jsonify({'error': 'Order not found'}), 404
        
        updated_order['_id'] = order_id
        return jsonify(updated_order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 刪除訂單
@app.route('/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        result = orders_collection.delete_one({'_id': ObjectId(order_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Order not found'}), 404
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 啟動伺服器
if __name__ == '__main__':
    app_port = int(os.getenv('ORDER_SERVICE_PORT', 3003))  # 預設埠號為 3003
    app.run(host='0.0.0.0', port=app_port)
