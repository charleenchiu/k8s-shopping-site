
# Push 到 ECR Public Repo

## 登入

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

## 建置 Docker 映像

使用下列命令建置您的 Docker 映像。如需有關從頭開始建置 Docker 檔案的資訊，請參閲 [這裡](https://docs.docker.com/get-started/) 說明。如果您的映像已建置，則可以跳過此步驟：

```sh
docker build -t 4api_docker_website/user_service .
```

## 加上標籤

建置完成後，將您的映像加上標籤，以便將映像推送至此儲存庫：

```sh
docker tag 4api_docker_website/user_service:latest public.ecr.aws/j5a0e3h8/4api_docker_website/user_service:latest
```

## 推送映像

執行下列命令將此映像推送至新建立的 AWS 儲存庫：

```sh
docker push public.ecr.aws/j5a0e3h8/4api_docker_website/user_service:latest
```