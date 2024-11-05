import requests
import os

# 設定 API 服務的 URL，假設服務運行在 localhost 且使用指定的埠號
BASE_URL = f"http://localhost:{os.getenv('ORDER_SERVICE_PORT', 5000)}"

def test_get_all_orders():
    response = requests.get(f"{BASE_URL}/orders")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_order():
    order_id = "613b1a2fcf1a4f3c8d2c08c4"  # 假設這個訂單 ID 存在
    response = requests.get(f"{BASE_URL}/orders/{order_id}")
    if response.status_code == 404:
        assert response.json() == {'error': 'Order not found'}
    else:
        assert response.status_code == 200
        order = response.json()
        assert isinstance(order, dict)
        assert order["_id"] == order_id

def test_get_nonexistent_order():
    non_existent_order_id = "9999"  # 一個你確定不存在的訂單 ID
    response = requests.get(f"{BASE_URL}/orders/{non_existent_order_id}")
    assert response.status_code == 404

def test_add_order():
    new_order = {
        "userId": 1,
        "orderTime": "2024-10-08T01:00:00Z",
        "details": [
            {"productId": 1, "quantity": 2},
            {"productId": 2, "quantity": 1}
        ]
    }
    response = requests.post(f"{BASE_URL}/orders", json=new_order)
    assert response.status_code == 201
    order = response.json()
    assert order["userId"] == new_order["userId"]
    assert isinstance(order["details"], list) and len(order["details"]) == 2

def test_update_order():
    order_id = "613b1a2fcf1a4f3c8d2c08c4"  # 假設這個訂單 ID 存在
    updated_order = {
        "userId": 1,
        "orderTime": "2024-10-08T02:00:00Z",
        "details": [
            {"productId": 1, "quantity": 3},
            {"productId": 2, "quantity": 2}
        ]
    }
    response = requests.put(f"{BASE_URL}/orders/{order_id}", json=updated_order)
    if response.status_code == 404:
        assert response.json() == {'error': 'Order not found'}
    else:
        assert response.status_code == 200
        order = response.json()
        assert order["userId"] == updated_order["userId"]
        assert isinstance(order["details"], list) and len(order["details"]) == 2

def test_delete_order():
    order_id = "613b1a2fcf1a4f3c8d2c08c4"  # 假設這個訂單 ID 存在
    response = requests.delete(f"{BASE_URL}/orders/{order_id}")
    if response.status_code == 404:
        assert response.json() == {'error': 'Order not found'}
    else:
        assert response.status_code == 204
