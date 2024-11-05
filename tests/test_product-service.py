import requests
import os

# API 服務的 URL，假設服務運行在 localhost 且使用指定埠號
BASE_URL = f"http://localhost:{os.getenv('PRODUCT_SERVICE_PORT', 3002)}"

def test_get_all_products():
    response = requests.get(f"{BASE_URL}/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_product():
    product_id = "613b1a2fcf1a4f3c8d2c08c3"  # 假設這個商品ID存在
    response = requests.get(f"{BASE_URL}/products/{product_id}")
    if response.status_code == 404:
        assert response.json() == {'error': 'Product not found'}
    else:
        assert response.status_code == 200
        product = response.json()
        assert isinstance(product, dict)
        assert product["_id"] == product_id

def test_add_product():
    new_product = {"name": "Product 3", "price": 300}
    response = requests.post(f"{BASE_URL}/products", json=new_product)
    assert response.status_code == 201
    product = response.json()
    assert isinstance(product, dict)
    assert product["name"] == new_product["name"]
    assert product["price"] == new_product["price"]

def test_update_product():
    product_id = "613b1a2fcf1a4f3c8d2c08c3"  # 假設這個商品ID存在
    updated_product = {"name": "Updated Product", "price": 150}
    response = requests.put(f"{BASE_URL}/products/{product_id}", json=updated_product)
    if response.status_code == 404:
        assert response.json() == {'error': 'Product not found'}
    else:
        assert response.status_code == 200
        product = response.json()
        assert product["name"] == updated_product["name"]
        assert product["price"] == updated_product["price"]

def test_delete_product():
    product_id = "613b1a2fcf1a4f3c8d2c08c3"  # 假設這個商品ID存在
    response = requests.delete(f"{BASE_URL}/products/{product_id}")
    if response.status_code == 404:
        assert response.json() == {'error': 'Product not found'}
    else:
        assert response.status_code == 204
