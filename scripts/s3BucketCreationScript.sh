#/bin/bash
bucketName=$1
regionName=$2

isBucketExist=$(aws s3 ls | grep -w "${bucketName}"| cut -d ' ' -f 3)
if [ "$isBucketExist" != "" ]; then
	echo "Bucket ${isBucketExist} already exist"
	exit 0
else
	echo "Bucket ${bucketName} does not exist."
	aws s3api create-bucket --bucket ${bucketName} --region ${regionName} && echo "Bucket ${bucketName} successfully created in region ${regionName}."
	sed -i "s/Bucket-Name/${bucketName}/" scripts/S3PublicReadAccessPolicy.json && echo "Policy created."
	aws s3api put-bucket-policy --bucket ${bucketName} --policy file://scripts/S3PublicReadAccessPolicy.json && echo "Policy attached."
	aws s3 website s3://${bucketName}/ --index-document index.html --error-document index.html && echo "Static hosting configured."
	aws s3api put-bucket-versioning --bucket ${bucketName} --versioning-configuration Status=Enabled && echo "Versioning enabled" && echo "Script executed successfully."
fi