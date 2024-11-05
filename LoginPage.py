# app.py
from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

app = Flask(__name__)

# 連接到 MongoDB
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
db = client['ShoppingSiteDB']

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 在 MongoDB 中查詢使用者
    user = db.users.find_one({'username': username})

    # 驗證使用者
    if user and user['password'] == password:  # 簡單的密碼檢查
        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False}), 401

if __name__ == '__main__':
    app.run(debug=True)
