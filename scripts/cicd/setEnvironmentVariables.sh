#!/bin/bash
region=$1
environment=$2
if [ "$region" = "" ]; then
	echo "First parameter should be region name."
	exit 1
fi
if [ "$environment" = "" ]; then
	echo "Second parameter should be environment name."
	exit 1
fi 
aws ssm get-parameters-by-path --recursive --path "/ns-client/" --region $region --output json| jq -r '.Parameters| .[] | .Name + " = " + .Value +""  ' > Env.txt || { echo "aws ssm command not executed properly in setEnvironmentVariables.sh script. Try again." ; exit 1; }

cat Env.txt

function settingEnv(){
	
	REACT_APP_AWS_REGION=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/region/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_AWS_REGION=\).*/\1${REACT_APP_AWS_REGION}/" .env
	
	REACT_APP_AWS_COGNITO_USER_POOL_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/userPool\/id/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_USER_POOL_ID=\).*/\1${REACT_APP_AWS_COGNITO_USER_POOL_ID}/" .env
	
	REACT_APP_AWS_COGNITO_CLIENT_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/userPool\/clientId/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_CLIENT_ID=\).*/\1${REACT_APP_AWS_COGNITO_CLIENT_ID}/" .env
	
	REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/identityPool\/id/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=\).*/\1${REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID}/" .env

	REACT_APP_API_URL=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/api\/url/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_API_URL=\).*#\1${REACT_APP_API_URL}#" .env

	REACT_APP_BOX_URL=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/box\/url/ { print $3 }')				
	sed -i.bak "s#^\(REACT_APP_BOX_URL=\).*#\1${REACT_APP_BOX_URL}#" .env

	REACT_APP_PLAID_URL=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/plaid\/url/ { print $3 }')				
	sed -i.bak "s#^\(REACT_APP_PLAID_URL=\).*#\1${REACT_APP_PLAID_URL}#" .env

	REACT_APP_PLAID_PUBLIC_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/plaid\/publicKey/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_PLAID_PUBLIC_KEY=\).*/\1${REACT_APP_PLAID_PUBLIC_KEY}/" .env

	REACT_APP_PLAID_ENV=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/plaid\/env/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_PLAID_ENV=\).*/\1${REACT_APP_PLAID_ENV}/" .env

	REACT_APP_SENTRY_URL=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/sentry\/url/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_SENTRY_URL=\).*#\1${REACT_APP_SENTRY_URL}#" .env

	cat .env
}

case $environment in
dev) 
	settingEnv
;;

qa)
	settingEnv
;;

prod)
	settingEnv
;;

*) 
	echo "Specified environment : $environment is not available."
	exit 1
;;

esac
