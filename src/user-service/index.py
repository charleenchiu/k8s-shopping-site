import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pymongo import MongoClient

# 載入環境變數
load_dotenv()

app = FastAPI()

# 連接到本地端 MongoDB (Docker 版本)
# client = MongoClient("mongodb://username:password@host:port/")
client = MongoClient("mongodb://localhost:27017/")
db = client["ShoppingSiteDB"]

@app.get("/")
async def read_root():
    return {"message": "Welcome to the User Service API"}

@app.get("/users")
async def get_users():
    # 查詢所有使用者（範例）資料
    users = list(db["users"].find({},{"_id":0}))
    return {"users":users}

@app.get("/users/{user_id}")
def get_user(user_id: str):
    user = db.users.find_one({"_id": user_id})
    return user

@app.post("/users")
def create_user(user: dict):
    db.users.insert_one(user)
    return {"message": "使用者建立成功"}

