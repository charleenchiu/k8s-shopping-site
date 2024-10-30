#!/bin/bash

# 提示使用者輸入 access_key 和 secret_key
read -p "請輸入 AWS access_key: " access_key
read -p "請輸入 AWS secret_key: " secret_key

# 刪除 Helm 建立的資源，例如 ELB。但不會自動刪除 Docker 映像
# helm uninstall <release-name>
# 檢查 bitnami repository 是否存在再刪除
if helm repo list | grep -q 'bitnami'; then
    helm repo remove bitnami
else
    echo "bitnami repository 不存在，跳過刪除。"
fi

# 檢查 fluent repository 是否存在再刪除
if helm repo list | grep -q 'fluent'; then
    helm repo remove fluent
else
    echo "fluent repository 不存在，跳過刪除。"
fi

helm uninstall k8s-site
helm uninstall aws-for-fluent-bit
helm uninstall externaldns

# 檢查 Jenkins 專案目錄是否存在
cd /var/lib/jenkins/workspace/K8S_Shopping_Site/terraform || { echo "找不到 Jenkins 專案目錄，請確認路徑是否正確"; exit 1; }

# 修改 main.tf，將 access_key 和 secret_key 加入 Terraform 配置
echo "正在修改 main.tf 檔案..."

# 檢查 main.tf 是否已包含 provider "aws" 的配置
if ! grep -q 'provider "aws"' main.tf; then
    sudo sed -i '1i provider "aws" {\n  region = "us-east-1"\n  access_key = "'"$access_key"'"\n  secret_key = "'"$secret_key"'"\n}\n' main.tf

    if [ $? -ne 0 ]; then
        echo "修改 main.tf 失敗！"
        exit 1
    fi
else
    echo "main.tf 已包含 provider 'aws' 的配置，跳過修改。"
fi

echo "正在執行清理操作..."

# 執行 Docker 清理命令
echo "正在清理 Docker 資源..."
docker builder prune -f || { echo "清理 Docker build cache 失敗"; exit 1; }
docker container prune -f || { echo "清理未使用的容器失敗"; exit 1; }
docker image prune -a -f || { echo "清理未使用的映像失敗"; exit 1; }
docker volume prune -f || { echo "清理未使用的卷失敗"; exit 1; }

# 給清理腳本賦予執行權限
sudo chmod +x ./delete_ecr_images.sh
./delete_ecr_images.sh || { echo "清理 ECR 映像失敗"; exit 1; }

# 執行 terraform destroy 並清理 terraform 臨時檔案
sudo terraform destroy -auto-approve || { echo "Terraform 資源刪除失敗"; exit 1; }
sudo rm -rf .terraform* 
sudo rm -rf terraform.tfstate*

echo "所有操作已完成。"
