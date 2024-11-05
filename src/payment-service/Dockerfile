# 選擇官方 Python 3.9 基礎映像
FROM python:3.9-slim

# 設定工作目錄
WORKDIR /usr/src/app

# 複製當前目錄的內容到容器的工作目錄
COPY . .

# 安裝 Python 套件依賴
RUN pip install --no-cache-dir -r requirements.txt

# 開放服務埠 3004
EXPOSE 3004

# 設定環境變數，將 Flask 應用設為啟動模式
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# 設定預設埠號為 3004
ENV FLASK_RUN_PORT=3004

# 啟動 Flask 應用
CMD ["flask", "run", "--port=3004"]
