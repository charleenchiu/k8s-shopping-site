// Configuring the provider information
provider "aws" {
    region = "us-east-1"
}

data "aws_iam_role" "Jenkins_Role" {
  name = "Jenkins_Role"
}


// Launching new EC2 instance
resource "aws_instance" "JenkinsServer" {
  //ami = "ami-03e7e7eac160da024"  //JenkinsServerImg13_EBS_add_2GiB with t2.small
  //ami = "ami-0e0b480b46e7c831c"  //JenkinsServerImg14_SonarQG_Webhook with t2.small
  //ami = "ami-01154da512f2d3d4b"  //JenkinsServerImg15_Sonar_Docker_ECR with t2.small
  //這個好像忘了用？但ROLE不會建到AMI裡//ami = "ami-0c9398badf30203fb"  //JenkinsServerImg16_RoleFor_ECR_ECS with t2.small EBS 11G
  //ami = "ami-0093eb248654c6932"  //JenkinsServerImg17_upgrade_instancetype_and_ebs with t3.medium EBS 20G
  ami = "ami-0945b35a46339ddcc"  //JenkinsServerImg18_update_helm_kubectl with t3.medium EBS 20G
  instance_type = "t3.medium"
  key_name = "jenkins-key"
  vpc_security_group_ids = ["sg-0f8aa01fc499922a6"] //JenkinsSG
  subnet_id = "subnet-0153eaf2e8d59b0a0" //charleensideproject-web-1a
  private_ip = "172.16.10.31" //固定使用指定的private ip
  associate_public_ip_address = true //啟用公共IP
  iam_instance_profile = data.aws_iam_role.Jenkins_Role.name
  tags = {
      Name = "JenkinsServer"
  }
}



// Launching new EC2 instance
resource "aws_instance" "SonarServer" {
  //ami = "ami-0d0ff2521dcc4bb94"  //SonarServerImg4_QG_webhook_JKImg14 with t2.medium
  ami = "ami-02f743ccd2da10d1e"  //SonarServerImg5_k8s_site_QG_webhook_JKImg18 with t2.medium
  instance_type = "t2.medium"
  key_name = "sonar-key"
  vpc_security_group_ids = ["sg-045c57d2935ed51b9"] //SonarSG
  subnet_id = "subnet-0153eaf2e8d59b0a0" //charleensideproject-web-1a
  private_ip = "172.16.10.32"  //固定使用指定的private ip，好在jenkins的system設定上可以填固定的URL：http://172.16.10.133:9000
  associate_public_ip_address = true //啟用公共IP
  tags = {
      Name = "SonarServer"
  }
}


output "JenkinsServerURL_PrivateIP" {
  value = "http://${aws_instance.JenkinsServer.private_ip}:8080"
}
output "JenkinsServerURL_PublicIP" {
  value = "http://${aws_instance.JenkinsServer.public_ip}:8080"
}
output "JenkinsServer_SSH" {
  value = "ssh -i ${aws_instance.JenkinsServer.key_name}.pem ubuntu@${aws_instance.JenkinsServer.public_ip}"
}



output "SonarServerURL_PrivateIP" {
  value = "http://${aws_instance.SonarServer.private_ip}:9000"
}
output "SonarServerURL_PublicIP" {
  value = "http://${aws_instance.SonarServer.public_ip}:9000"
}
output "SonarServer_SSH" {
  value = "ssh -i ${aws_instance.SonarServer.key_name}.pem ubuntu@${aws_instance.SonarServer.public_ip}"
}
