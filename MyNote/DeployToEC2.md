# 將 Amazon ECR 公共儲存庫上的映像檔部署到 EC2

## 1. 登入 ECR 公共儲存庫

首先，你需要登入 ECR 公共儲存庫以獲取映像檔。使用以下指令：

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

注意：將 `us-east-1` 替換為你使用的 AWS 區域。

## 2. 拉取映像檔

使用 `docker pull` 指令從 ECR 公共儲存庫中拉取映像檔。例如：

```sh
docker pull public.ecr.aws/j5a0e3h8/4api_docker_website/user_service:latest
```

## 3. 啟動 EC2 實例

如果你還沒有 EC2 實例，請在 AWS 管理控制台中啟動一個新的 EC2 實例。確保選擇適當的 AMI（例如 Amazon Linux 2）和安全組設置，允許所需的埠（例如 3001）。

## 4. 連接到 EC2 實例

使用 SSH 連接到你的 EC2 實例。例如：

```sh
ssh -i "your-key-pair.pem" ec2-user@your-ec2-instance-public-dns
```

## 5. 安裝 Docker

在 EC2 實例上安裝 Docker。以下是安裝 Docker 的指令：

```sh
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

## 6. 登入 ECR 公共儲存庫（在 EC2 上）

在 EC2 實例上再次登入 ECR 公共儲存庫：

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

## 7. 拉取映像檔（在 EC2 上）

使用 `docker pull` 指令從 ECR 公共儲存庫中拉取映像檔：

```sh
docker pull public.ecr.aws/j5a0e3h8/4api_docker_website/user_service:latest
```

## 8. 運行 Docker 容器

使用 `docker run` 指令運行容器。例如：

```sh
docker run -d -p 3001:3001 public.ecr.aws/j5a0e3h8/4api_docker_website/user_service:latest
```

## 9. 解決問題

### 處理權限問題

如果出現權限問題，無法檢視到成果，請按照以下步驟操作：

#### 1. 添加使用者到 Docker 群組

```sh
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. 登入 ECR 公共儲存庫

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

注意：這個命令會顯示警告，表示你的密碼將以未加密的形式存儲在 `/home/ubuntu/.docker/config.json` 中。

#### 3. 修改 Docker 配置檔案

要修改 Docker 配置檔案，移除 `"credsStore": "desktop"` 這一行。

原檔案內容如下：

```json
{
	"auths": {
		"167804136284.dkr.ecr.us-east-1.amazonaws.com": {}
	},
    "credsStore": "desktop", //這行待刪除
	"currentContext": "desktop-linux",
	"plugins": {
		"-x-cli-hints": {
			"enabled": "true"
		},
		"debug": {
			"hooks": "exec"
		},
		"scout": {
			"hooks": "pull,buildx build"
		}
	},
	"features": {
		"hooks": "true"
	}
}
```

<span style="color:red;font-weight:bold;">修改後的檔案內容應該如下：</span>

```json
{
	"auths": {
		"167804136284.dkr.ecr.us-east-1.amazonaws.com": {}
	},
	"currentContext": "desktop-linux",
	"plugins": {
		"-x-cli-hints": {
			"enabled": "true"
		},
		"debug": {
			"hooks": "exec"
		},
		"scout": {
			"hooks": "pull,buildx build"
		}
	},
	"features": {
		"hooks": "true"
	}
}
```