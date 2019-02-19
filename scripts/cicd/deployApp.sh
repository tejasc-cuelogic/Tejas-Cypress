
#!/bin/bash
bucketName=$1
env=$2

if [ "$bucketName" = "" ]; then
	echo "Bucket name argument is undefined."
	exit 1
fi

if [ "$env" = "review" ]; then
	bucketName="${env}-${bucketName}"
fi


# aws s3 sync ../../build/ s3://${bucketName}/ --delete
cd ../.. && \
aws s3 rm s3://${bucketName} --recursive && echo "S3 bucket ${bucketName} cleaned successfully." && \
aws s3 cp build/ s3://${bucketName}/ --recursive && echo "New files deployed successfully to s3 bucket ${bucketName}."