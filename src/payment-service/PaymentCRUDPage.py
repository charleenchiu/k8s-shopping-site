from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)  # 啟用 CORS 支援

# 設定 MongoDB 連接
client = MongoClient(os.getenv('MONGODB_URI'))  # 從環境變數獲取 MongoDB URI
db = client['payment_db']  # 替換為你的資料庫名稱
payments_collection = db['payments']  # 替換為你的集合名稱

@app.route('/payments', methods=['GET'])
def get_payments():
    payments = list(payments_collection.find({}))
    # 將 MongoDB 文件轉換為 JSON 格式
    for payment in payments:
        payment['_id'] = str(payment['_id'])  # 將 ObjectId 轉換為字串
    return jsonify(payments)

@app.route('/payments', methods=['POST'])
def add_payment():
    data = request.json
    payments_collection.insert_one(data)
    return jsonify(data), 201

@app.route('/payments/<string:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    data = request.json
    payments_collection.update_one({'_id': payment_id}, {'$set': data})
    return jsonify(data)

@app.route('/payments/<string:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    payments_collection.delete_one({'_id': payment_id})
    return jsonify({'message': 'Deleted successfully'}), 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3004)
