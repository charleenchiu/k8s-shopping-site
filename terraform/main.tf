# 查詢現有的 IAM Cluster Role
data "aws_iam_role" "eksClusterRole" {
  name = "eksClusterRole"
}

# IAM Role Assume Policy Document for Cluster Role
data "aws_iam_policy_document" "eks_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

# IAM Role Policy Attachment for EKS Cluster Policy
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  count      = length(try(data.aws_iam_role.eksClusterRole,[])) == 0 ? 1 : 0
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = data.aws_iam_role.eksClusterRole.name
}

# IAM Role Policy Attachment for VPC Resource Controller
resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  count      = length(try(data.aws_iam_role.eksClusterRole,[])) == 0 ? 1 : 0
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = data.aws_iam_role.eksClusterRole.name
}

# IAM Role Policy Document for Cluster Role Permissions
data "aws_iam_policy_document" "eks_cluster_permissions_policy" {
  statement {
    actions = [
      "ecr:*",  # AmazonEC2ContainerRegistryFullAccess
      "eks:*",  # AmazonEKS_CNI_Policy, AmazonEKSClusterPolicy, AmazonEKSServicePolicy, AmazonEKSWorkerNodePolicy
      "logs:*"  # CloudWatchLogsFullAccess
    ]
    effect  = "Allow"
    resources = ["*"]
  }
}

# IAM Role Policy for Cluster Permissions
resource "aws_iam_policy" "eks_cluster_permissions" {
  count = length(try(data.aws_iam_role.eksClusterRole,[])) == 0 ? 1 : 0
  name  = "eksClusterPermissionsPolicy"
  
  policy = data.aws_iam_policy_document.eks_cluster_permissions_policy.json
}

# IAM Role Policy Attachment for Cluster Role Permissions
resource "aws_iam_role_policy_attachment" "eks_cluster_permissions_attachment" {
  count      = length(try(data.aws_iam_role.eksClusterRole,[])) == 0 ? 1 : 0
  policy_arn = aws_iam_policy.eks_cluster_permissions[0].arn  # 使用 [0] 來正確引用第一個實例
  role       = data.aws_iam_role.eksClusterRole.name
}

# 查詢現有的 Node Group Role
data "aws_iam_role" "eksNodeGroupRole" {
  name = "eksNodeGroupRole"
}

# IAM Role Assume Policy Document for Node Group Role
data "aws_iam_policy_document" "node_group_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# IAM Role Policy Attachment for Node Group Permissions
resource "aws_iam_role_policy_attachment" "node_group_permissions" {
  count       = length(try(data.aws_iam_role.eksNodeGroupRole,[])) == 0 ? 1 : 0
  policy_arn  = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role        = data.aws_iam_role.eksNodeGroupRole.name
}

# IAM Role Policy Attachment for ECR Permissions
resource "aws_iam_role_policy_attachment" "ecr_pull_policy" {
  count       = length(try(data.aws_iam_role.eksNodeGroupRole,[])) == 0 ? 1 : 0
  policy_arn  = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role        = data.aws_iam_role.eksNodeGroupRole.name
}

resource "aws_iam_role_policy_attachment" "ecr_pull_only_policy" {
  count       = length(try(data.aws_iam_role.eksNodeGroupRole,[])) == 0 ? 1 : 0
  policy_arn  = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPullOnly"
  role        = data.aws_iam_role.eksNodeGroupRole.name
}

# EKS Cluster Resource
resource "aws_eks_cluster" "k8s-shopping-site_cluster" {
  name     = "k8s-shopping-site_cluster"
  role_arn = length(data.aws_iam_role.eksClusterRole) > 0 ? data.aws_iam_role.eksClusterRole.arn : data.aws_iam_role.eksClusterRole.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller
  ]
}

# CloudWatch Log Group for EKS Cluster
resource "aws_cloudwatch_log_group" "k8s-shopping-site_log_group" {
  name              = "/eks/k8s-shopping-site_task"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [name]
  }
}

# EKS Node Group
resource "aws_eks_node_group" "k8s-shopping-site_node_group" {
  cluster_name    = aws_eks_cluster.k8s-shopping-site_cluster.name
  node_group_name = "k8s-shopping-site_node_group"
  node_role_arn   = data.aws_iam_role.eksNodeGroupRole.arn
  subnet_ids      = var.subnet_ids

/*
  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t2.micro"]
*/
  scaling_config {
    desired_size = 1  # 減少數量
    max_size     = 2
    min_size     = 1
  }

  instance_types = ["t3.medium"]  # 更換實例類型

  depends_on = [
    aws_eks_cluster.k8s-shopping-site_cluster,
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# 創建公共 ECR 儲存庫
resource "aws_ecrpublic_repository" "k8s-shopping-site_repo" {
  repository_name = "k8s-shopping-site"
}

resource "aws_ecrpublic_repository" "user_service_repo" {
  repository_name = "k8s-shopping-site/user_service"
}

resource "aws_ecrpublic_repository" "product_service_repo" {
  repository_name = "k8s-shopping-site/product_service"
}

resource "aws_ecrpublic_repository" "order_service_repo" {
  repository_name = "k8s-shopping-site/order_service"
}

resource "aws_ecrpublic_repository" "payment_service_repo" {
  repository_name = "k8s-shopping-site/payment_service"
}


/*相關資訊：
● cluster:k8s-shopping-site_cluster

● node_group:k8s-shopping-site_node_group

● eksClusterRole
ARN: arn:aws:iam::167804136284:role/eksClusterRole
permissions：
AmazonEC2ContainerRegistryFullAccess
AmazonEKS_CNI_Policy
AmazonEKSClusterPolicy
AmazonEKSServicePolicy
AmazonEKSWorkerNodePolicy
CloudWatchLogsFullAccess


● eksNodeGroupRole
ARN: arn:aws:iam::167804136284:role/eksNodeGroupRole
permissions：
AmazonEC2ContainerRegistryPullOnly
AmazonEC2ContainerRegistryReadOnly
AmazonEKS_CNI_Policy
AmazonEKSWorkerNodePolicy
CloudWatchLogsFullAccess

● ECR:
public repository name: 
k8s-shopping-site_repo
k8s-shopping-site_user_service_repo
k8s-shopping-site_product_service_repo
k8s-shopping-site_order_service_repo
k8s-shopping-site_payment_service_repo

● Cloud Watch Log Group:
/eks/k8s-shopping-site_task
*/