#!/bin/bash
# 刪除所有名為 `k8s-shopping-site/*` 的 ECR Public 存儲庫中的映像

# 列出所有名為 k8s-shopping-site/* 的存儲庫
repos=$(aws ecr-public describe-repositories --query "repositories[?starts_with(repositoryName, 'k8s-shopping-site/')].repositoryName" --output text)

# 對每個存儲庫執行操作
for repo in $repos; do
    echo "Processing repository: $repo"

    # 列出映像
    image_ids=$(aws ecr-public describe-images --repository-name "$repo" --query "imageDetails[*].imageDigest" --output text)

    # 如果有映像，則刪除
    if [ -n "$image_ids" ]; then
        echo "Deleting images from $repo..."
        aws ecr-public batch-delete-image --repository-name "$repo" --image-ids $image_ids
    else
        echo "No images to delete in $repo."
    fi
done

# 如果希望刪除這些存儲庫本身，可以在清除映像後執行以下命令。但該留給terraform destroy：
# for repo in $repos; do
#     echo "Deleting repository: $repo"
#     aws ecr-public delete-repository --repository-name "$repo" --force
# done

echo "All images deleted."