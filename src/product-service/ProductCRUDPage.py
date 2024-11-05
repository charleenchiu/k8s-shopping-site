from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from flask_pymongo import PyMongo
from bson.objectid import ObjectId  # 引入 ObjectId

app = Flask(__name__)

# MongoDB 設定
app.config["MONGO_URI"] = os.getenv("MONGO_URI")  # 請在環境變數中設定 MongoDB 連接字串
mongo = PyMongo(app)

@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'GET':
        products = list(mongo.db.products.find())
        for product in products:
            product['_id'] = str(product['_id'])  # 將 ObjectId 轉為字串
        return jsonify(products)

    if request.method == 'POST':
        new_product = request.json
        mongo.db.products.insert_one(new_product)
        return jsonify(new_product), 201

@app.route('/api/products/<product_id>', methods=['PUT', 'DELETE'])
def product_detail(product_id):
    if request.method == 'PUT':
        mongo.db.products.update_one({'_id': ObjectId(product_id)}, {"$set": request.json})
        return jsonify({"message": "Product updated"}), 200  # 加上狀態碼

    if request.method == 'DELETE':
        mongo.db.products.delete_one({'_id': ObjectId(product_id)})
        return jsonify({"message": "Product deleted"}), 204  # 加上狀態碼

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
