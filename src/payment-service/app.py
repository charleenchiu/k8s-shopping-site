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

# 連接到 MongoDB 資料庫
client = MongoClient(os.getenv('MONGO_URI'))
db = client['payment_database']  # 設定資料庫名稱
payments_collection = db['payments']  # 設定付款的 Collection

# 建立 Flask 應用程式
app = Flask(__name__)

# 獲取所有付款
@app.route('/payments', methods=['GET'])
def get_payments():
    try:
        payments = list(payments_collection.find())
        for payment in payments:
            payment['_id'] = str(payment['_id'])  # 將 ObjectId 轉成字串
        return jsonify(payments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 獲取指定的一筆付款
@app.route('/payments/<payment_id>', methods=['GET'])
def get_payment(payment_id):
    try:
        payment = payments_collection.find_one({'_id': ObjectId(payment_id)})
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        payment['_id'] = str(payment['_id'])
        return jsonify(payment)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 新增付款
@app.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    order_id = data.get('orderId')
    amount = data.get('amount')

    try:
        # 插入新的付款資料
        payment = {
            'orderId': order_id,
            'amount': amount
        }
        result = payments_collection.insert_one(payment)
        payment_id = str(result.inserted_id)
        payment['_id'] = payment_id
        return jsonify(payment), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 更新付款
@app.route('/payments/<payment_id>', methods=['PUT'])
def update_payment(payment_id):
    data = request.get_json()
    order_id = data.get('orderId')
    amount = data.get('amount')

    try:
        # 更新付款資料
        updated_payment = {
            'orderId': order_id,
            'amount': amount
        }
        result = payments_collection.update_one({'_id': ObjectId(payment_id)}, {'$set': updated_payment})
        
        if result.matched_count == 0:
            return jsonify({'error': 'Payment not found'}), 404
        
        updated_payment['_id'] = payment_id
        return jsonify(updated_payment)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 刪除付款
@app.route('/payments/<payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    try:
        result = payments_collection.delete_one({'_id': ObjectId(payment_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Payment not found'}), 404
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 啟動伺服器
if __name__ == '__main__':
    app_port = int(os.getenv('PAYMENT_SERVICE_PORT', 5000))  # 預設埠號 5000
    app.run(host='0.0.0.0', port=app_port)
