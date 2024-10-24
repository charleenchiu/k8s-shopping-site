# 如何刪除先前jenkins建置失敗，但terraform已建立的AWS資源：

1. 首先要確認Jenkins Server這台EC2存取其他資源的role "Jenkins_Role"(例如本專案會用到的EC2、ECR、EKS、CloudWatch等)有足夠的權限，例如：
政策名稱：
AmazonEC2ContainerRegistryFullAccess  (AWS 受管)
AmazonEC2ReadOnlyAccess  (AWS 受管)
AmazonECS_FullAccess  (AWS 受管)
AmazonEKSClusterPolicy  (AWS 受管)
AmazonEKSLocalOutpostClusterPolicy  (AWS 受管)
AmazonElasticContainerRegistryPublicFullAccess  (AWS 受管)
AmazonElasticContainerRegistryPublicReadOnly  (AWS 受管)
CloudWatchLogsReadOnlyAccess  (AWS 受管)
IAMReadOnlyAccess  (AWS 受管)
ekspolicy (客戶內嵌)

其中ekspolicy內容如下：
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"eks:DescribeCluster",
				"eks:ListClusters",
				"eks:UpdateClusterConfig",
				"eks:CreateCluster",
				"eks:DeleteCluster",
				"eks:DescribeNodegroup",
				"eks:ListNodegroups",
				"eks:CreateNodegroup",
				"eks:DeleteNodegroup",
				"eks:UpdateNodegroupConfig",
				"eks:DeleteCluster"
			],
			"Resource": [
				"arn:aws:eks:us-east-1:167804136284:cluster/k8s-shopping-site_cluster",
				"arn:aws:eks:us-east-1:167804136284:nodegroup/k8s-shopping-site_cluster/*"
			]
		},
		{
			"Effect": "Allow",
			"Action": [
				"logs:DeleteLogGroup",
				"logs:DescribeLogGroups",
				"logs:PutLogEvents",
				"logs:GetLogEvents"
			],
			"Resource": "arn:aws:logs:us-east-1:167804136284:log-group:/eks/k8s-shopping-site_task:*"
		}
	]
}
```


2. ssh 連線進入Jenkins server EC2：

```sh
cd C:\charleen\LearnDevops\myPractice
```

==========================================================================

JenkinsServerURL_PrivateIP = "http://172.16.10.31:8080"
JenkinsServerURL_PublicIP = "http://98.81.235.115:8080"
JenkinsServer_SSH = "ssh -i jenkins-key.pem ubuntu@98.81.235.115"

==========================================================================

3. 進入jenkins建置專案的資料夾
```sh
# cd /var/lib/jenkins/workspace/<item name>/terraform
cd /var/lib/jenkins/workspace/K8S_Shopping_Site/terraform
```

4. 修改terraform檔案，加Access Key
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

5. 依序執行下列指令，移除前次所建置的資源，並刪除臨時檔
```sh
sudo terraform destroy -auto-approve
sudo rm -rf .terraform*
sudo rm -rf terraform.tfstate*
```

6. 刪除docker的臨時檔
```sh
#清除所有未使用的 build cache
docker builder prune -f
#刪除未使用的容器：
docker container prune -f
#刪除未使用的映像：
docker image prune -a -f
#刪除未使用的卷：
docker volume prune -f
```