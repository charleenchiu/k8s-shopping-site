import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 讀取環境變數
ec2_private_ip = os.getenv('EC2_PRIVATE_IP')
use_container = os.getenv('USE_CONTAINER')
site_port = os.getenv('SITE_PORT')
user_service_port = os.getenv('USER_SERVICE_PORT')
product_service_port = os.getenv('PRODUCT_SERVICE_PORT')
order_service_port = os.getenv('ORDER_SERVICE_PORT')
payment_service_port = os.getenv('PAYMENT_SERVICE_PORT')

# 現在可以使用這些變數了
print(f"EC2 Private IP: {ec2_private_ip}")
print(f"Site Port: {site_port}")
