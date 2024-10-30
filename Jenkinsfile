pipeline {

    parameters {
        // 建立一個參數化的選項讓使用者決定是否自動執行 apply
        booleanParam(name: 'autoApprove', defaultValue: false, description: 'Automatically run apply after generating plan?')
    }

    environment {
        // 從 Jenkins 的憑證管理提取 AWS 憑證，確保敏感資料安全
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    agent any

    stages {
        // Git Clone 階段：從指定的分支拉取程式碼到 terraform 目錄
        stage('Git Clone'){
            steps{
                script{
                    dir("terraform"){
                        // 從 GitHub 拉取指定的分支
                        git branch: 'cicd-kube', url:'https://github.com/charleenchiu/vprofile-project.git'
                    }
                }
            }
            post {
                // 在拉取失敗時印出錯誤訊息
                failure {
                    echo "[*] git clone failure"
                }
                // 在拉取成功時印出成功訊息
                success {
                    echo "[*] git clone successful"
                }
            }
        }

        // Terraform Plan 階段：初始化 terraform 並生成計劃
        stage('Terraform Plan') {
            steps {
                // 檢查當前用戶身份和工作目錄
                sh 'whoami'
                sh 'pwd;cd terraform/ ; terraform init' // 初始化 terraform
                // 執行 terraform plan 並將計劃輸出到 tfplan 檔案
                sh 'pwd;cd terraform/ ; terraform plan -out tfplan'
                // 將計劃以文字形式儲存，便於人工審核
                sh 'pwd;cd terraform/ ; terraform show -no-color tfplan > tfplan.txt'
            }
        }

        // Terraform Approval 階段：若 autoApprove 設定為 false，則需人工確認
        stage('Terraform Approval'){
            when {
                // 若 autoApprove 為 false，則需要進行人工審核
                not {
                    equals expected: true, actual: params.autoApprove
                }
            }

            steps{
                script {
                    // 讀取 tfplan.txt 並顯示內容，供人工審核
                    def plan = readFile 'terraform/tfplan.txt'
                    input message: 'Do you want to apply the plan?',
                    parameters: [text(name: 'Plan', description: 'Please review the plan', defaultValue: plan)]
                }
            }
        }

        // Terraform Apply 階段：若獲得人工批准，則應用 terraform 計劃
        stage('Terraform Apply'){
            steps{
                // 執行 terraform apply，使用生成的 tfplan 進行應用
                sh 'pwd; cd terraform/ ; terraform apply -input=false tfplan'
            }
        }

        /* 可選：設定私鑰權限
        stage('Setup') {
            steps {
                // 設置私鑰的權限為 600，確保私密性
                sh 'chmod 600 /var/lib/jenkins/workspace/vprofile-project/terraform/charleen_Terraform_test_nfs.pem'
            }
        }
        */

        /* 可選：使用 Ansible 部署 playbook
        stage('Deploy') {
            steps {
                // 執行 Ansible playbook，並禁用 SSH 主機密鑰檢查
                sh 'ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -u ubuntu --private-key /var/lib/jenkins/workspace/vprofile-project/terraform/charleen_Terraform_test_nfs.pem -i "3.86.177.86," master.yml -e "efs_id=fs-03267e0cada2b466a"'
            }
        }
        */

        /* 檢查 Ansible 版本（可選階段）
        stage('Ansible Version'){
            steps{
                // 列出 Ansible 各工具的版本
                sh '''
                    ansible --version
                    ansible-playbook --version
                    ansible-galaxy --version
                '''
            }
        }
        */

        /* 取回 Terraform 生成的私鑰，改權限（可選階段）
        stage('Retrieve Private Key') {
            steps {
                script {
                    // 取得 terraform 的私鑰輸出並設置權限
                    def privateKey = sh(script: 'terraform output -raw private_key', returnStdout: true).trim()
                    writeFile file: '~/.ssh/jenkins_key', text: privateKey
                    sh 'chmod 600 ~/.ssh/jenkins_key'
                }
            }
        }
        */

        /* 將新建的 EC2 IP 寫入 Ansible inventory 檔，並執行 playbook（可選階段）
        stage('Run Ansible Playbook') {
            steps {
                script {
                    // 提取 EC2 的 IP 並寫入 inventory
                    def myWebOSIp = sh(script: 'terraform output -raw myWebOS_public_ip', returnStdout: true).trim()
                    writeFile file: 'inventory.ini', text: "[mywebos]\nmywebos ansible_host=${myWebOSIp} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/jenkins_key"
                    // 執行 Ansible playbook
                    sh 'ansible-playbook -i inventory.ini /path/to/master.yml'
                }
            }
        }
        */
    }
}
