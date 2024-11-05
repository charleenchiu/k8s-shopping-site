from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

# 設定 MongoDB 連線
client = MongoClient('mongodb://localhost:27017/')  # 根據實際設定修改 MongoDB 的 URI
db = client['your_database_name']  # 替換為你的資料庫名稱
orders_collection = db['orders']  # 替換為你的集合名稱

# 獲取所有訂單
@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(orders_collection.find())
    for order in orders:
        order['_id'] = str(order['_id'])  # 將 ObjectId 轉換為字串
    return jsonify(orders), 200

# 新增訂單
@app.route('/orders', methods=['POST'])
def add_order():
    data = request.json
    order_id = orders_collection.insert_one(data).inserted_id
    return jsonify({'id': str(order_id)}), 201

# 更新訂單
@app.route('/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    result = orders_collection.update_one({'_id': ObjectId(order_id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': '訂單未找到'}), 404
    return jsonify({'message': '訂單更新成功'}), 200

# 刪除訂單
@app.route('/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    result = orders_collection.delete_one({'_id': ObjectId(order_id)})
    if result.deleted_count == 0:
        return jsonify({'error': '訂單未找到'}), 404
    return jsonify({'message': '訂單刪除成功'}), 200

if __name__ == '__main__':
    app.run(debug=True)
