在非虛擬環境（non-venv）中執行 `pip freeze > requirements.txt` 生成的 `requirements.txt` 文件，會包含當前全域 Python 環境中安裝的所有套件，而不僅僅是你的專案所需的套件。這可能會造成幾個問題：

1. **過多的依賴**：如果你的全域環境中有很多其他專案使用的套件，生成的 `requirements.txt` 會包含這些套件，這可能使文件變得臃腫且不必要。

2. **版本衝突**：當你在新的環境中安裝這些套件時，可能會遇到版本衝突，特別是當其他專案需要不同版本的相同套件時。

3. **移植性問題**：在其他開發環境或生產環境中使用這個 `requirements.txt` 可能會導致不必要的錯誤，因為某些套件可能並不適合該環境。

為了避免這些問題，通常建議在虛擬環境中生成 `requirements.txt`。這樣可以確保只包含專案需要的依賴，並且能夠為每個專案創建一個獨立的、可重現的環境。你可以使用以下命令來創建虛擬環境並安裝依賴：

```bash
# 建立虛擬環境
# python -m venv venv

# 啟用虛擬環境
# 在 Windows
venv\Scripts\activate
# 在 macOS/Linux
source venv/bin/activate

# 安裝專案所需的套件
pip install <your-packages>

# 生成 requirements.txt
pip freeze > requirements.txt
```

如果你已經在全域環境中生成了 `requirements.txt`，你可以手動清理這個文件，只保留你專案需要的依賴，然後在新的虛擬環境中安裝。