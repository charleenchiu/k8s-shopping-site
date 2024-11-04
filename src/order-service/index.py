import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pymongo import MongoClient
import requests

app = FastAPI()
client = MongoClient("mongodb://username:password@host:port/")
db = client["shopping_site"]

@app.post("/orders")
def create_order(order: dict):
    # 檢查使用者和商品有效性
    user = requests.get(f"http://user-service-url/users/{order['user_id']}").json()
    product = requests.get(f"http://product-service-url/products/{order['product_id']}").json()
    if not user or not product:
        return {"error": "無效的使用者或商品"}
    db.orders.insert_one(order)
    return {"message": "訂單建立成功"}