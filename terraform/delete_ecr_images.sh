#!/bin/bash

# 將所有要處理的 repository 儲存到一個陣列中
repositories=("k8s-shopping-site" "k8s-shopping-site/payment_service" "k8s-shopping-site/product_service" "k8s-shopping-site/order_service" "k8s-shopping-site/user_service")

# 逐一處理每個 repository
for repo in "${repositories[@]}"; do
    echo "Processing repository: $repo"

    # 取得所有映像的 Digest
    image_digests=$(aws ecr describe-images --repository-name "$repo" --query 'imageDetails[].imageDigest' --output text 2>/dev/null)

    if [ -z "$image_digests" ]; then
        echo "No images found in $repo or repository does not exist."
        continue
    fi

    echo "Deleting images from $repo..."

    # 逐個刪除映像
    for digest in $image_digests; do
        echo "Deleting image with digest: $digest"
        aws ecr batch-delete-image --repository-name "$repo" --image-ids imageDigest="$digest"
        if [ $? -ne 0 ]; then
            echo "Failed to delete image with digest: $digest from $repo"
        else
            echo "Successfully deleted image with digest: $digest from $repo"
        fi
    done
done

echo "All images deleted."
