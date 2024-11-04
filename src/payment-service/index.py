import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI()
client = MongoClient("mongodb://username:password@host:port/")
db = client["shopping_site"]

@app.post("/payments")
def process_payment(payment: dict):
    # 假設付款處理邏輯
    payment_status = "成功"  # 假設付款成功
    db.payments.insert_one({"order_id": payment["order_id"], "status": payment_status})
    return {"message": f"付款{payment_status}"}