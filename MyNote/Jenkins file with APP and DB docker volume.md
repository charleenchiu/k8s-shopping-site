# 這個Jenkinsfile包含了構建Docker映像、推送映像到Docker Hub、上傳Volume備份到EC2，以及在EC2上部署和恢復Volume的所有步驟。

1.手動壓縮Docker Volume：

我在windows上做開發，如何製作出ubuntu可用的壓縮檔呢：
在Windows上運行以下命令：
使用Ubuntu Docker容器來壓縮Docker Volume，這行命令會使用Ubuntu Docker容器來壓縮Volume，並將壓縮檔保存到當前工作目錄：

若開發機是Windows上：
```sh
#%cd%：這是Windows命令提示符中的變數，用來表示當前工作目錄（Current Directory）。
docker run --rm -v my_mysql_data:/volume -v %cd%:/backup ubuntu tar czf /backup/mysql_volume.tar.gz -C /volume .
```

※若開發機是類Unix系統（如Linux或macOS）：
```sh
# $(pwd)：這是類Unix系統（如Linux和macOS）中用來表示當前工作目錄的命令。pwd代表“print working directory”，用來輸出當前工作目錄路徑。
docker run --rm -v my_mysql_data:/volume -v $(pwd):/backup ubuntu tar czf /backup/mysql_volume.tar.gz -C /volume .
```

然後手動將生成的mysql_volume.tar.gz文件保存在專案的某個目錄下，並上傳到GitHub。

2.在Jenkinsfile中處理其餘工作：

在Jenkins pipeline中包含構建Docker映像、上傳映像到Docker Hub、以及在EC2上部署和恢復Volume的步驟。

以下是示例Jenkinsfile：

```groovy
pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        EC2_IP = 'your-ec2-public-dns'
        EC2_USER = 'ubuntu'
        PEM_FILE = 'path/to/your-key.pem'
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('your-dockerhub-username/mysql')
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        docker.image('your-dockerhub-username/mysql').push()
                    }
                }
            }
        }
        stage('Upload Volume Backup to EC2') {
            steps {
                sh 'scp -i ${PEM_FILE} backup/mysql_volume.tar.gz ${EC2_USER}@${EC2_IP}:/home/ubuntu'
            }
        }
        stage('Deploy on EC2') {
            steps {
                sh '''
                    ssh -i ${PEM_FILE} ${EC2_USER}@${EC2_IP} << EOF
                        sudo apt-get update
                        sudo apt-get install -y docker.io
                        sudo systemctl start docker
                        sudo systemctl enable docker
                        docker login -u ${DOCKERHUB_CREDENTIALS_USR} -p ${DOCKERHUB_CREDENTIALS_PSW}
                        docker pull your-dockerhub-username/mysql
                        docker volume create my_mysql_data
                        docker run --rm -v my_mysql_data:/volume -v /home/ubuntu:/backup ubuntu tar xzf /backup/mysql_volume.tar.gz -C /volume
                        docker run -d -v my_mysql_data:/var/lib/mysql --name my_mysql your-dockerhub-username/mysql
                    EOF
                '''
            }
        }
    }
}
```
