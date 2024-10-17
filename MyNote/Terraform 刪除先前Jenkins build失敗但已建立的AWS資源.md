如何刪除先前jenkins建置失敗，但terraform已建立的AWS資源：
ssh 連線進入Jenkins server EC2
```sh
cd /var/lib/jenkins/workspace/<item name>/terraform
```

編輯建立資源的tf檔
```sh
sudo nano main.tf
```

最前面加上
```js
provider "aws" {
  region = "us-east-1"
  access_key ="<我的帳戶access_key>"
  secret_key = "<我的帳戶secret_key>"
}
```
ctrl + X 離開 按Y選擇存檔

destroy已建的資源，刪除建置時留下的暫存檔
```sh
sudo terraform destroy -auto-approve
sudo rm -rf .terraform*
sudo rm -rf terraform.tfstate*
#刪除未使用的容器：
docker container prune
#刪除未使用的映像：
docker image prune -a
#刪除未使用的卷：
docker volume prune
```
