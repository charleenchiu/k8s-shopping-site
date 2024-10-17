**執行位置**
```sh
cd <terraform檔案所在目錄>
```

**debug**
```sh
terraform plan
```

**建立AWS resource**
```sh
terraform apply -auto-approve
```

**刪除**
```sh
terraform destroy -auto-approve
# 在window power shell command：
Remove-Item -Recurse -Force .terraform*
Remove-Item -Recurse -Force terraform.tfstate*
# 在Ubuntu：
rm -rf .terraform*
rm -rf terraform.tfstate*
```
