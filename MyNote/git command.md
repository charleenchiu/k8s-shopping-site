# 剛建好repo
```sh
# 初始化一個新的 Git 儲存庫並推送第一個提交
echo "# k8s-shopping-site" >> README.md  # 建立一個 README.md 檔案並加入專案名稱
git init                                  # 初始化一個新的 Git 儲存庫
git add README.md                         # 將 README.md 檔案加入暫存區
git commit -m "first commit"              # 提交檔案並加入提交訊息 "first commit"
git branch -M main                        # 將分支名稱重命名為 main
git remote add origin https://github.com/charleenchiu/k8s-shopping-site.git  # 新增遠端儲存庫位址
git push -u origin main                   # 將 main 分支推送到遠端儲存庫
```
如果你已經初始化過儲存庫，只是要新增遠端儲存庫並推送：
```sh
# 新增遠端儲存庫並推送到 main 分支
git remote add origin https://github.com/charleenchiu/k8s-shopping-site.git  # 新增遠端儲存庫位址
git branch -M main                        # 將分支名稱重命名為 main
git push -u origin main                   # 將 main 分支推送到遠端儲存庫
```