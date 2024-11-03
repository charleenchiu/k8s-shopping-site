# k8s-shopping-site 專案

### **歡迎來到這個專案的 README 檔案！想要了解更多細節，請點擊這個連結：**
##   [📂 開啟 <span style="color:red;font-weight:bold;">README_專案說明</span> 資料夾](README_專案說明/)


### 簡介
本專案是基於 Kubernetes 的電子商務網站，旨在展示微服務架構下的 CI/CD 流程。透過 Jenkins 自動化工具，使用 Terraform 進行基礎架構的配置，並利用 Docker 和 Helm 來部署各微服務。

### 未來擴充計畫

1. **版本管理與標籤策略**  
   繼續實踐版本標籤策略，包括 `stable` 與 `canary` 版本的標籤管理，適用於每個服務，以支援滾動升級與版本控制。

2. **Docker 部署 MySQL**  
   將 MySQL 整合到服務中，並透過 Docker 容器管理資料庫，便於開發與測試環境的快速建置。

3. **改為 Node.js + MySQL 架構**  
   將目前的架構改為 Node.js + MySQL，模擬真實企業常用技術堆疊，展示後端整合的能力。目前已完成程式碼開發，將整合到本專案的CI/CD流程，並且使用canary標籤，實現滾動升級與版本控制。詳見：[2_nodejs_mysql](https://github.com/charleenchiu/k8s-shopping-site/tree/2_nodejs_mysql)

4. **開發 Python + NoSQL 版本**  
   在目前基礎上新增 Python + NoSQL 版本，擴展技術多樣性，展示對不同語言及資料庫的適應能力，強化專案的靈活性。

5. **Ansible 設置 AWS EC2 主機**  
   在 Tarraform 建置 AWS 資源後，呼叫 Ansible playbook 對主機進行設置。目前已完成開發及初步驗證。詳見：[4_jenkins_terraform_ansible](https://github.com/charleenchiu/k8s-shopping-site.git/tree/4_jenkins_terraform_ansible)


### **專案展示：**
![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_70_Helm佈署結果_site-service_3000.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3000_user-service.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3001.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3000_product-service.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3002.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3000_order-service.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3003.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3000_payment-service.png)

![alt text](README_專案說明/pictures/202410280050_k8s-shopping-site_1_simple_docker_compose_result_3004.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_61_helm_kubectl_get.png)

![alt text](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Jenkins_Helm_Deploy_Result_改成只有一個LoadBalance其餘ClusterIP.png)

![Jenkins stages 1](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Jenkins_Sonarqube_result_1.png)

![Jenkins stages 2](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Jenkins_Sonarqube_result_2.png)

![Jenkins stages 3](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Jenkins_Sonarqube_result_3.png)

![alt text](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Sonarqube_1_Project.png)

![alt text](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Sonarqube_2_QualityGate.png)

![alt text](README_專案說明/pictures/202410280053_k8s-shopping-site_1_simple_Sonarqube_3_Webhooks.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_1_ECR.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_010_Role.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_0101_eksClusterRole.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_0102_eksNodeGroupRole.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_0103_Jenkins_Role.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_0104_Jenkins_Role_ekspolicy.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_11_ECR_Image_k8s-shopping-site.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_12_ECR_Image_k8s-shopping-site_user_service.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_13_ECR_Image_k8s-shopping-site_product_service.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_14_ECR_Image_k8s-shopping-site_order_service.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_15_ECR_Image_k8s-shopping-site_payment_service.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_21_EKS_Cluster_k8s-shopping-site_cluster.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_22_EKS_NodeGroup_k8s-shopping-site_node_group.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_23_EKS_Node_Pods_ip-172-16-11-19.ec2.internal.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_3_EC2.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_31_EC2_JenkinsServer.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_311_EC2_JenkinsServer_AMI.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_312_EC2_JenkinsServer_SG.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_313_EC2_JenkinsServer_VPC.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_314_EC2_JenkinsServer_ENI.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_41_EC2_EKS建立的i-0d0a27725b24bf4e5.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_411_EC2_EKS建立的i-0d0a27725b24bf4e5_AMI.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_4121_EC2_EKS建立的i-0d0a27725b24bf4e5_SG.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_4122_EC2_EKS建立的i-0d0a27725b24bf4e5_SG_Rule.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_4131_EC2_EKS建立的i-0d0a27725b24bf4e5_Net_1.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_4132_EC2_EKS建立的i-0d0a27725b24bf4e5_Net_2.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_4133_EC2_EKS建立的i-0d0a27725b24bf4e5_Net_ENI.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_5_ELB.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_511_ELB_user-service.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_512_ELB_user-service_DNS.png)

![alt text](README_專案說明/pictures/202410260223_k8s-shopping-site_1_simple_用Helm佈署成功_513_ELB_user-service_PORT.png)
