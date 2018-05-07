#/bin/bash
bucketName=$1
regionName=$2
	aws s3api create-bucket --bucket ${bucketName} --region ${regionName} && echo "Bucket ${bucketName} successfully created in region ${regionName}." && \
	sed -i "s/Bucket-Name/${bucketName}/" scripts/cicd/s3PublicReadAccessPolicy.json && echo "Policy created." && \
	aws s3api put-bucket-policy --bucket ${bucketName} --policy file://scripts/cicd/s3PublicReadAccessPolicy.json && echo "Policy attached." && \
	aws s3 website s3://${bucketName}/ --index-document index.html --error-document index.html && echo "Static hosting configured." && \
	aws s3api put-bucket-versioning --bucket ${bucketName} --versioning-configuration Status=Enabled && echo "Versioning enabled" && echo "Script executed successfully."
