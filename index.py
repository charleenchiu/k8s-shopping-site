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