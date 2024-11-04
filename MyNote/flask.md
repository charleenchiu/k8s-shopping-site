要將這段 JavaScript 代碼轉換為 Python 的 `index.py`，你可以使用 Flask 框架來實現相同的功能。Flask 是一個輕量級的 Python Web 框架，適合用來搭建簡單的 web 應用程式和 API。以下是如何在 Python 中建立相同功能的範例：

### 安裝 Flask 和 requests 庫

在開始之前，確保你的環境中已安裝 Flask 和 requests 庫。你可以使用以下命令安裝它們：

```bash
pip install Flask requests
```

### `index.py` 檔案內容

以下是 `index.py` 的內容，實現了與你提供的 JavaScript 代碼相同的功能：

```python
from flask import Flask, redirect, url_for, request
import os
import requests

app = Flask(__name__)

# 設定環境變數：本地和 EKS 環境的不同微服務 URL
user_service_url = os.environ.get('USER_SERVICE_URL', 'http://user-service:3001')
product_service_url = os.environ.get('PRODUCT_SERVICE_URL', 'http://product-service:3002')
order_service_url = os.environ.get('ORDER_SERVICE_URL', 'http://order-service:3003')
payment_service_url = os.environ.get('PAYMENT_SERVICE_URL', 'http://payment-service:3004')

# 根目錄，顯示各微服務的 URL
@app.route('/')
def index():
    return f'''
        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: {user_service_url}</li>
            <li><a href="/product-service">Product Service</a> - URL: {product_service_url}</li>
            <li><a href="/order-service">Order Service</a> - URL: {order_service_url}</li>
            <li><a href="/payment-service">Payment Service</a> - URL: {payment_service_url}</li>
        </ul>
    '''

# 使用 requests 模組將請求轉發到對應的微服務
@app.route('/user-service', methods=['GET', 'POST'])
def user_service():
    response = requests.request(
        method=request.method,
        url=user_service_url + request.full_path,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False
    )
    return (response.content, response.status_code, response.headers.items())

@app.route('/product-service', methods=['GET', 'POST'])
def product_service():
    response = requests.request(
        method=request.method,
        url=product_service_url + request.full_path,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False
    )
    return (response.content, response.status_code, response.headers.items())

@app.route('/order-service', methods=['GET', 'POST'])
def order_service():
    response = requests.request(
        method=request.method,
        url=order_service_url + request.full_path,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False
    )
    return (response.content, response.status_code, response.headers.items())

@app.route('/payment-service', methods=['GET', 'POST'])
def payment_service():
    response = requests.request(
        method=request.method,
        url=payment_service_url + request.full_path,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False
    )
    return (response.content, response.status_code, response.headers.items())

if __name__ == '__main__':
    host = os.environ.get('HOST', 'localhost')
    port = int(os.environ.get('PORT', 3000))
    app.run(host=host, port=port)
```

### 說明

1. **Flask 應用**：使用 Flask 來建立 web 應用。
2. **環境變數**：通過 `os.environ.get()` 來讀取環境變數，設置微服務的 URL。
3. **根目錄路由**：當用戶訪問 `/` 時，會顯示所有微服務的 URL。
4. **代理請求**：使用 `requests` 庫來將請求轉發到相應的微服務。這樣無論是 `GET` 還是 `POST` 請求，都能夠正確轉發並返回相應的內容和狀態碼。
5. **啟動伺服器**：在指定的主機和埠上啟動 Flask 伺服器。

### 運行你的 Flask 應用

要運行這個應用，確保你在有該 `index.py` 的目錄中，然後執行以下命令：

```bash
python index.py
```

這樣就可以在 `http://localhost:3000` 訪問你的應用，並能看到相應的微服務鏈接了。根據需要，你可以在 Docker 環境中設置這個應用並運行。