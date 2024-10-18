# 輸出 網站的 Public ECR Repository URI
output "site_ecr_repo" {
    value = aws_ecrpublic_repository.k8s-shopping-site_repo.repository_uri  # 取得公共 k8s-shopping-site_repo 的 URI
}

# 輸出 User Service 的 Public ECR Repository URI
output "user_service_ecr_repo" {
    value = aws_ecrpublic_repository.user_service_repo.repository_uri  # 取得公共 user_service_repo 的 URI
}

# 輸出 Product Service 的 Public ECR Repository URI
output "product_service_ecr_repo" {
    value = aws_ecrpublic_repository.product_service_repo.repository_uri  # 取得公共 product_service_repo 的 URI
}

# 輸出 Order Service 的 Public ECR Repository URI
output "order_service_ecr_repo" {
    value = aws_ecrpublic_repository.order_service_repo.repository_uri  # 取得公共 order_service_repo 的 URI
}

# 輸出 Payment Service 的 Public ECR Repository URI
output "payment_service_ecr_repo" {
    value = aws_ecrpublic_repository.payment_service_repo.repository_uri  # 取得公共 payment_service_repo 的 URI
}

# 輸出 EKS Cluster 的 ARN
output "eks_cluster_arn" {
  value = aws_eks_cluster.k8s-shopping-site_cluster.arn  # 取得 EKS Cluster ARN
}

# 輸出 EKS Cluster 的 URL
output "eks_cluster_url" {
  value = aws_eks_cluster.k8s-shopping-site_cluster.endpoint  # 取得 EKS Cluster 的 API 端點 URL
}

# 輸出 CloudWatch aws_cloudwatch_log_group的資訊
output "cloudwatch_log_group_name" {
  value = aws_cloudwatch_log_group.k8s-shopping-site_log_group.name  # 取得 aws_cloudwatch_log_group的Name
}

# 輸出 Kubernetes 憑證授權中心的資料
output "kubeconfig_certificate_authority_data" {
  value = aws_eks_cluster.k8s-shopping-site_cluster.certificate_authority[0].data  # 取得 Kubernetes CA 資料
}