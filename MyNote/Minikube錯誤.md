PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> minikube start
😄  minikube v1.34.0 on Microsoft Windows 11 Pro 10.0.22631.4317 Build 22631.4317
✨  Automatically selected the docker driver
📌  Using Docker Desktop driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.45 ...
💾  Downloading Kubernetes v1.31.0 preload ...
    > preloaded-images-k8s-v18-v1...:  326.69 MiB / 326.69 MiB  100.00% 1.67 Mi
    > gcr.io/k8s-minikube/kicbase...:  487.90 MiB / 487.90 MiB  100.00% 2.01 Mi
🔥  Creating docker container (CPUs=2, Memory=2200MB) ...
❗  Executing "docker ps -a --format {{.Names}}" took an unusually long time: 8.4625818s
💡  Restarting the docker service may improve performance.
❗  Executing "docker container inspect minikube --format={{.State.Status}}" took an unusually long time: 2.2485125s
💡  Restarting the docker service may improve performance.
✋  Stopping node "minikube"  ...
🛑  Powering off "minikube" via SSH ...
🔥  Deleting "minikube" in docker ...
🤦  StartHost failed, but will try again: creating host: create: creating: prepare kic ssh: unable to execute icacls to set permissions: �w�B�z���ɮ�: C:\Users\charl\.minikube\machines\minikube\id_rsa
�w���Q�B�z 1 ���ɮ�; 0 ���ɮ׳B�z����
: exec: canceling Cmd: TerminateProcess: Access is denied.
😿  Failed to start docker container. Running "minikube delete" may fix it: error loading existing host. Please try running [minikube delete], then run [minikube start] again: filestore "minikube": open C:\Users\charl\.minikube\machines\minikube\config.json: The system cannot find the file specified.

❌  Exiting due to GUEST_NOT_FOUND: Failed to start host: error loading existing host. Please try running [minikube delete], then run [minikube start] again: filestore "minikube": open C:\Users\charl\.minikube\machines\minikube\config.json: The system cannot find the file specified.
💡  Suggestion: minikube is missing files relating to your guest environment. This can be fixed by running 'minikube delete'
🍿  Related issue: https://github.com/kubernetes/minikube/issues/9130

