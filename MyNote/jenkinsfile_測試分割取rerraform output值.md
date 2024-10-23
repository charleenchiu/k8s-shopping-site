pipeline {
    agent any

    environment {
        TERRAFORM_OUTPUTS = '''
log_group_name = "/eks/k8s-shopping-site_task"
eks_cluster_arn = "arn:aws:eks:us-east-1:167804136284:cluster/k8s-shopping-site_cluster"
eks_cluster_url = "https://48374570160E00AAD1ABCC2641A93BA8.gr7.us-east-1.eks.amazonaws.com"
kubeconfig_certificate_authority_data = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJR1lJWks3TlpjNVV3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRFd01qTXdOVFUzTlRaYUZ3MHpOREV3TWpFd05qQXlOVFphTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUURqOHJuaVZZMkpUREIxUzdBWURZNnZRb0hNVHJ5cXZ3RCt5UjJiUlg3VGZFem1RbEltZmYyU0hmYWEKMHdoaFZyNmJYRGVBdDhvbS9YUzdxYUcwQVh4MlVTRi9qWlYxWWN4bDNQOG1acnU5WW5BOFk5WGg3cHZhcVhoTApwaFV0cnpQazVRT2FTT1YwR0RQbFhjSm1vdkt6blJGclUxb0t4SnJmbDBWcXhhMy9qdDRIZWpXd09LRGc3QjhGCklaMWxrZndhZVQ5VEU0a3lkcnVvTkQzSFUyOUVzaTRHTmlreGhpYXF0VitURE45dnJxS1pVT2pvUFNGY2VFM0cKMDJmUFpKR255aFFFK3B3YncwTXpTUmRDVEhVU2c2SUQvdHlNRzEzakhYNldrcW5CL2FGcnNVQUoreWFZUVBkTQpjQnJKVWdmNW9EWHlTbUp0QTRyQkR0TERiK2ExQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJUYUgxWFREdlpNTFhQWHNMRk80UUdVdlVpTDZ6QVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ2JPWm5peUk0agpqSHNQRmlzNTFFT2JQa2NNd0xWR2o3RW9tNk54c1ZWdmdLSDhWV1QrdldJME0zcFZtekYyUStFbjhKaWFhdEh0CjM1dGk2d3RtV21UK0tOOE9XUHdyMHpWV2M2YlhzYzFraU4wVVNjSW5rZkFIRXRzd2hROFNtZ1JMMTFyWlBMRmkKUFZLcG5ydG1yM1F0Vm1idTJoVnFYZzcwbjdkYWpjcmw5b0ZscnZPekRyd1lHR3VGSjY5dzFHNHhIM0FVbU9jawo0Zi9YazYwSERPd1JMRzNJN2hWMzBOQkFwSm1qci96b3JMVG0vOXV0cW9yYWU1UmY3c3NhOEhrV3Z4N2NJM0dQCklJTzNtSm9FaXRhK293N2NJM00yME1EOWYrc3NFeFA0NE5ZVjhqWldOTW1UWGlpcHBkTkRLQk9SaDJuaEJIOS8KSHlOd1JPaGJTNGJtCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
order_service_ecr_repo = "public.ecr.aws/j5a0e3h8/k8s-shopping-site/order_service"
payment_service_ecr_repo = "public.ecr.aws/j5a0e3h8/k8s-shopping-site/payment_service"
product_service_ecr_repo = "public.ecr.aws/j5a0e3h8/k8s-shopping-site/product_service"
site_ecr_repo = "public.ecr.aws/j5a0e3h8/k8s-shopping-site"
user_service_ecr_repo = "public.ecr.aws/j5a0e3h8/k8s-shopping-site/user_service"
        '''
        SITE_ECR_REPO = ''
        USER_SERVICE_ECR_REPO = ''
        PRODUCT_SERVICE_ECR_REPO = ''
        ORDER_SERVICE_ECR_REPO = ''
        PAYMENT_SERVICE_ECR_REPO = ''
        //EKS_CLUSTER_ARN = ''
        EKS_CLUSTER_URL = ''
        KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = ''
        LOG_GROUP_NAME = ''
    }

    stages {
        /*
        stage('Get Outputs By Regex') {
            steps {
                script {
                    // 獲取原始輸出
                    //echo "TERRAFORM_OUTPUTS: ${TERRAFORM_OUTPUTS}"

                    echo "=====用正則表達式==============================================================="
                    // 使用正規表達式來提取各個輸出值
                    env.LOG_GROUP_NAME = (TERRAFORM_OUTPUTS =~ /log_group_name\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.EKS_CLUSTER_ARN = (TERRAFORM_OUTPUTS =~ /eks_cluster_arn\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.EKS_CLUSTER_URL = (TERRAFORM_OUTPUTS =~ /eks_cluster_url\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.SITE_ECR_REPO = (TERRAFORM_OUTPUTS =~ /site_ecr_repo\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.USER_SERVICE_ECR_REPO = (TERRAFORM_OUTPUTS =~ /user_service_ecr_repo\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.PRODUCT_SERVICE_ECR_REPO = (TERRAFORM_OUTPUTS =~ /product_service_ecr_repo\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.ORDER_SERVICE_ECR_REPO = (TERRAFORM_OUTPUTS =~ /order_service_ecr_repo\s+=\s+\"([^\"]+)\"/)[0][1]
                    env.PAYMENT_SERVICE_ECR_REPO = (TERRAFORM_OUTPUTS =~ /payment_service_ecr_repo\s+=\s+\"([^\"]+)\"/)[0][1]

                    // 驗證輸出的變數
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_ARN: ${env.EKS_CLUSTER_ARN}"
                    echo "EKS_CLUSTER_URL: ${env.EKS_CLUSTER_URL}"
                    echo "LOG_GROUP_NAME: ${env.LOG_GROUP_NAME}"
                    
                }
            }
        }
        */

        stage('Get Outputs By Split') {
            steps {
                script {
                    // 獲取原始輸出
                    //echo "TERRAFORM_OUTPUTS: ${TERRAFORM_OUTPUTS}"

                    echo "=====用換行符號分割==============================================================="
                    //def outputs = TERRAFORM_OUTPUTS.replaceAll(/\r?\n/, "\n")
                    //def outputList = outputs.split('\n')
                    def outputList = TERRAFORM_OUTPUTS.split('\n').collect { it.trim() }
                    
                    env.EKS_CLUSTER_ARN = outputList.find { it.contains("eks_cluster_arn") }?.split('=')[1]?.trim()
                    echo "env.EKS_CLUSTER_ARN = ${env.EKS_CLUSTER_ARN}"

                    /*
                    //echo "是否有找到： ${outputList.find { it.contains("eks_cluster_arn") }.split('=')[1].trim()}"
                    //是否有找到： eks_cluster_arn = "arn:aws:eks:us-east-1:167804136284:cluster/k8s-shopping-site_cluster"
                    //是否有找到：  "arn:aws:eks:us-east-1:167804136284:cluster/k8s-shopping-site_cluster"

                    eks_cluster_arn = outputList.find { it.contains("eks_cluster_arn") }.split('=')[1].trim()

                    // 使用 withEnv 將環境變數設置為全域變數
                    withEnv(["EKS_CLUSTER_ARN=${eks_cluster_arn}"]) {
                        echo "eks_cluster_arn = ${eks_cluster_arn}"
                        echo "env.EKS_CLUSTER_ARN = ${env.EKS_CLUSTER_ARN}"  // 此時應該還是 null
                    }
                    
                    // 直接更新 env 變數
                    env.EKS_CLUSTER_ARN = eks_cluster_arn
                    echo "After assignment, env.EKS_CLUSTER_ARN = ${env.EKS_CLUSTER_ARN}"  // 此時應該有值
                    */

                    /*
                    env.LOG_GROUP_NAME = outputList[0].trim()
                    env.EKS_CLUSTER_ARN = outputList[1].trim()
                    env.EKS_CLUSTER_URL = outputList[2].trim()
                    env.KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = outputList[3].trim()
                    env.ORDER_SERVICE_ECR_REPO = outputList[4].trim()
                    env.PAYMENT_SERVICE_ECR_REPO = outputList[5].trim()
                    env.PRODUCT_SERVICE_ECR_REPO = outputList[6].trim()
                    env.USER_SERVICE_ECR_REPO = outputList[7].trim()
                    env.SITE_ECR_REPO = outputList[8].trim()

                    // 驗證輸出的變數
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_ARN: ${env.EKS_CLUSTER_ARN}"
                    echo "EKS_CLUSTER_URL: ${env.EKS_CLUSTER_URL}"
                    echo "LOG_GROUP_NAME: ${env.LOG_GROUP_NAME}"
                    */
                }
            }
        }
    }

    post {
        always {
            script {
                // 無論成功與否，確保清理 Jenkins workspace
                cleanWs(
                    // 如果構建未完成也進行清理
                    cleanWhenNotBuilt: false,
                    // 刪除目錄
                    deleteDirs: true,
                    // 禁用延遲清除
                    disableDeferredWipeout: true,
                    // 失敗時不會使構建失敗
                    notFailBuild: true,
                    // 包含與排除的檔案模式
                    patterns: [
                        // 包含 .gitignore 檔案
                        [pattern: '.gitignore', type: 'INCLUDE'],
                        // 排除 .propsfile 檔案
                        [pattern: '.propsfile', type: 'EXCLUDE']
                    ]
                )
            }
        }
    }
}
