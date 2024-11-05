# 使用官方 Python 3.9 基礎映像
FROM python:3.9

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 requirements.txt 到容器中
COPY requirements.txt ./

# 安裝依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製當前目錄的內容到容器中的工作目錄
COPY . .

# 設定環境變數
ENV NODE_ENV=production

# 開放容器的 3000 端口
EXPOSE 3000

# 指定執行的命令
CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "3000"]
