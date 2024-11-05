from flask import Flask, request, jsonify
from pymongo import MongoClient
import os

app = Flask(__name__)

# MongoDB 連接設定
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client['user_db']  # 資料庫名稱
users_collection = db['users']  # 集合名稱

@app.route('/users', methods=['GET', 'POST'])
def manage_users():
    if request.method == 'GET':
        # 獲取所有使用者資料
        users = list(users_collection.find({}, {'_id': 0}))  # 排除 _id 欄位
        return jsonify(users), 200

    if request.method == 'POST':
        # 新增使用者資料
        user_data = request.json
        users_collection.insert_one(user_data)
        return jsonify(user_data), 201

@app.route('/users/<string:user_id>', methods=['PUT', 'DELETE'])
def user_detail(user_id):
    if request.method == 'PUT':
        # 更新使用者資料
        user_data = request.json
        users_collection.update_one({'id': user_id}, {'$set': user_data})
        return jsonify(user_data), 200

    if request.method == 'DELETE':
        # 刪除使用者資料
        users_collection.delete_one({'id': user_id})
        return jsonify({"message": "User deleted"}), 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
