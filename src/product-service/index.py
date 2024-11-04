import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI()
client = MongoClient("mongodb://username:password@host:port/")
db = client["shopping_site"]

@app.post("/products")
def create_product(product: dict):
    db.products.insert_one(product)
    return {"message": "商品建立成功"}

@app.get("/products/{product_id}")
def get_product(product_id: str):
    product = db.products.find_one({"_id": product_id})
    return product