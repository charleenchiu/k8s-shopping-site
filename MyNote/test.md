這段程式碼使用了 `Mocha` + `Chai` 和 `Chai-HTTP`，用來測試 `Order Service` 的 REST API。它定義了一系列測試案例來檢查各種路由的行為，如取得訂單、查詢單一訂單、新增訂單、更新訂單和刪除訂單。

如果你要將這段程式碼轉成 Python Flask 服務的測試，則可以使用 `pytest` 和 `requests` 模組來模擬 API 請求。以下是 Python 版本的測試程式碼，假設 `order-service.py` 已經在 Flask 中實作好。

### Python 測試程式碼

請先安裝所需的 Python 套件：
```bash
pip install pytest requests
```

接著，建立一個名為 `test_order_service.py` 的文件，並加入以下內容：

```python
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
```

### 說明

1. **`BASE_URL`**：設置 API 的根路徑，並允許從 `.env` 環境變數中指定 `ORDER_SERVICE_PORT`，默認為 `5000` 埠。

2. **測試案例**：
   - `test_get_all_orders`：測試 `GET /orders` 以獲取所有訂單。
   - `test_get_single_order`：測試 `GET /orders/<order_id>` 以獲取指定訂單。
   - `test_get_nonexistent_order`：測試不存在的訂單 ID，應回傳 404。
   - `test_add_order`：測試 `POST /orders` 以新增訂單。
   - `test_update_order`：測試 `PUT /orders/<order_id>` 更新訂單。
   - `test_delete_order`：測試 `DELETE /orders/<order_id>` 刪除訂單。

3. **斷言**：每個測試都檢查 HTTP 狀態碼和回應內容，確保 API 的行為符合預期。

### 執行測試

運行以下指令來執行測試：
```bash
pytest test_order_service.py
```

這將會執行測試並顯示結果。