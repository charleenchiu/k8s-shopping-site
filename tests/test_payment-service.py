import pytest
import requests
from bson import ObjectId
from pymongo import MongoClient

BASE_URL = "http://localhost:5000"  # 假設 Flask 伺服器在本地運行
client = MongoClient('mongodb://localhost:27017/')
db = client.payment_database  # 連接到你的 MongoDB 資料庫
payments = db.payments  # 付款集合

@pytest.fixture(scope="module")
def test_payment():
    """新增測試資料，在測試結束時自動清除"""
    test_payment = {"orderId": 1, "amount": 150.00}
    result = payments.insert_one(test_payment)
    yield result.inserted_id
    payments.delete_one({"_id": result.inserted_id})

def test_get_all_payments():
    """測試取得所有付款資料"""
    response = requests.get(f"{BASE_URL}/payments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_payment_by_id(test_payment):
    """測試根據 ID 取得單筆付款資料"""
    response = requests.get(f"{BASE_URL}/payments/{test_payment}")
    assert response.status_code == 200
    assert response.json()['_id'] == str(test_payment)

def test_get_nonexistent_payment():
    """測試取得不存在的付款資料，應該返回 404"""
    non_existent_payment_id = ObjectId()  # 生成一個不存在的 ID
    response = requests.get(f"{BASE_URL}/payments/{non_existent_payment_id}")
    assert response.status_code == 404

def test_create_payment():
    """測試新增一筆付款"""
    new_payment = {"orderId": 2, "amount": 200.00}
    response = requests.post(f"{BASE_URL}/payments", json=new_payment)
    assert response.status_code == 201
    response_data = response.json()
    assert response_data['orderId'] == new_payment['orderId']
    assert response_data['amount'] == new_payment['amount']
    payments.delete_one({"_id": ObjectId(response_data["_id"])})

def test_update_payment(test_payment):
    """測試更新付款資料"""
    updated_payment = {"orderId": 1, "amount": 250.00}
    response = requests.put(f"{BASE_URL}/payments/{test_payment}", json=updated_payment)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data['orderId'] == updated_payment['orderId']
    assert response_data['amount'] == updated_payment['amount']

def test_delete_payment(test_payment):
    """測試刪除付款資料"""
    response = requests.delete(f"{BASE_URL}/payments/{test_payment}")
    assert response.status_code == 204
    # 確認資料已被刪除
    assert payments.find_one({"_id": test_payment}) is None

def test_create_payment_with_invalid_format():
    """測試新增格式錯誤的付款資料"""
    invalid_payment = {"orderId": 1, "amount": "invalidAmount"}
    response = requests.post(f"{BASE_URL}/payments", json=invalid_payment)
    assert response.status_code == 400
