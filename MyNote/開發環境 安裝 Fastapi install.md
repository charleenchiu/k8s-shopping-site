建立虛擬環境（推薦） 在專案目錄下使用虛擬環境來隔離安裝，這樣可以避開全域套件的安裝限制，同時有助於專案依賴管理：

bash
複製程式碼
python -m venv venv
.\venv\Scripts\activate  # 啟動虛擬環境
pip install fastapi pymongo uvicorn requests
使用虛擬環境不僅可以避免權限問題，也能夠避免全域環境的干擾。

這句指令只會安裝 Python 的四個套件：fastapi、pymongo、uvicorn 和 requests。不會安裝 Python 本身或 MongoDB 伺服器。

Python 必須先手動安裝，並確認已加入系統的 PATH 中才能使用 pip。
MongoDB 伺服器也需要獨立安裝。pymongo 是 Python 連接 MongoDB 的驅動程式，但它不會安裝或啟動 MongoDB 伺服器本身。