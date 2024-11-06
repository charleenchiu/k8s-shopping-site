cd C:\charleen\LearnDevops\myPractice

==========================================================================


JenkinsServerURL_PrivateIP = "http://172.16.10.31:8080"
JenkinsServerURL_PublicIP = "http://34.201.132.161:8080"
JenkinsServer_SSH = "ssh -i jenkins-key.pem ubuntu@34.201.132.161"
SonarServerURL_PrivateIP = "http://172.16.10.32:9000"
SonarServerURL_PublicIP = "http://3.95.176.196:9000"
SonarServer_SSH = "ssh -i sonar-key.pem ubuntu@3.95.176.196"

==========================================================================
sudo su - jenkins

如何刪除先前jenkins建置失敗，但terraform已建立的AWS資源：
ssh 連線進入Jenkins server EC2
# cd /var/lib/jenkins/workspace/<item name>/terraform
cd /var/lib/jenkins/workspace/K8S_Shopping_Site/terraform

# sudo chmod +x ./delete_ecr_images.sh && ./delete_ecr_images.sh
自動
sudo chmod +x ./ManulCleanup.sh && ./ManulCleanup.sh

或手動
sudo su - jenkins
helm repo remove bitnami
helm repo remove fluent
helm uninstall k8s-site
helm uninstall aws-for-fluent-bit

sudo nano main.tf
最前面加上
provider "aws" {
  region = "us-east-1"
  access_key = <access_key>
  secret_key = <secret_key>
}
ctrl + X 離開 按Y選擇存檔
sudo chmod +x ./delete_ecr_images.sh && ./delete_ecr_images.sh

#清除所有未使用的 build cache
docker builder prune -f
#刪除未使用的容器：
docker container prune -f
#刪除未使用的映像：
docker image prune -a -f
#刪除未使用的卷：
docker volume prune -f

sudo terraform destroy -auto-approve
sudo rm -rf .terraform*
sudo rm -rf terraform.tfstate*


※在window command：
# del /s /q .terraform*
# del /s /q terraform.tfstate*
Remove-Item -Recurse -Force .terraform*
Remove-Item -Recurse -Force terraform.tfstate*

//===========================================================
k8s-shopping-site

檢視k8s(helm)佈署結果
sudo su - jenkins
helm list --all-namespaces
# service.yaml裡的service type要指定為 LoadBalancer
kubectl get deployments
kubectl get nodes -o wide
kubectl get pods
kubectl get services

helm uninstall k8s-site
helm uninstall aws-for-fluent-bit

minikube stop


======================================================================
JenkinsServerImg17_upgrade_instancetype_and_ebs with t3.medium EBS 20G

ECS_Service_ALB_URL = "http://ecs-alb-973217915.us-east-1.elb.amazonaws.com:80"

aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/j5a0e3h8

public.ecr.aws/j5a0e3h8/charleen_vprofileappimg

4api_docker_website/user_service

telnet 172.16.10.32 9000
telnet 172.16.10.31 8080

vprofile-QG

jenkins-ci-webhook
http://172.16.10.31:8080/sonarqube-webhook

JenkinsServerImg16_RoleForECS with t2.small
cd C:\charleen\LearnDevops\vprofile-project\CreateNSetEC2

cd C:\charleen\LearnDevops\ManulTestDocker

cd C:\charleen\LearnDevops\myPractice


※在window command：
# del /s /q .terraform*
# del /s /q terraform.tfstate*
Remove-Item -Recurse -Force .terraform*
Remove-Item -Recurse -Force terraform.tfstate*
