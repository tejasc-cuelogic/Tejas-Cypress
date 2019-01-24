#!/bin/bash
region=$1
environment=$2
ci_commit_ref=$3

settingEnv()
{

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

	REACT_APP_PROTECTION_API=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/protection\/api/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_PROTECTION_API=\).*#\1${REACT_APP_PROTECTION_API}#" .env

	#Credentials for Public uploads
    REACT_APP_UPLOADS_BUCKET=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/uploads\/bucket/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_UPLOADS_BUCKET=\).*#\1${REACT_APP_UPLOADS_BUCKET}#" .env

    REACT_APP_UPLOADS_ACCESS_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/uploads\/akey/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_UPLOADS_ACCESS_KEY=\).*#\1${REACT_APP_UPLOADS_ACCESS_KEY}#" .env

    REACT_APP_UPLOADS_SECRET_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/uploads\/skey/ { print $3 }')
	sed -i.bak "s#^\(REACT_APP_UPLOADS_SECRET_KEY=\).*#\1${REACT_APP_UPLOADS_SECRET_KEY}#" .env

	REACT_APP_PLAID_PUBLIC_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/plaid\/publicKey/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_PLAID_PUBLIC_KEY=\).*/\1${REACT_APP_PLAID_PUBLIC_KEY}/" .env

	REACT_APP_PLAID_ENV=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/plaid\/env/ { print $3 }')
	sed -i.bak "s/^\(REACT_APP_PLAID_ENV=\).*/\1${REACT_APP_PLAID_ENV}/" .env

	#Timestamp
	sed -i.bak "s#^\(REACT_APP_DEPLOY_TIME=\).*#\1$(git show -s --format=%cI HEAD)#" .env

	#BranchName
	sed -i.bak "s#^\(REACT_APP_DEPLOY_BRANCH=\).*#\1${CI_COMMIT_REF_NAME}#" .env

	#Public API endpoint- url
    REACT_APP_PUBLIC_API=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/api\/public\/url/ { print $3 }')
    sed -i.bak "s#^\(REACT_APP_PUBLIC_API=\).*#\1${REACT_APP_PUBLIC_API}#" .env

    #Public API endpoint- key
    REACT_APP_PUBLIC_API_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/api\/public\/key/ { print $3 }')
    sed -i.bak "s#^\(REACT_APP_PUBLIC_API_KEY=\).*#\1${REACT_APP_PUBLIC_API_KEY}#" .env

	if [ "$ci_commit_ref" = "develop" ] || [ "$ci_commit_ref" = "qa" ] || [ "$ci_commit_ref" = "demo" ] || [ "$ci_commit_ref" = "master" ]; then
		REACT_APP_BUG_SNAG_KEY=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/bugsnag\/apiKey/ { print $3 }')
		sed -i.bak "s#^\(REACT_APP_BUG_SNAG_KEY=\).*#\1${REACT_APP_BUG_SNAG_KEY}#" .env

		REACT_APP_BUG_SNAG_STAGE=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/bugsnag\/releaseStage/ { print $3 }')
		sed -i.bak "s#^\(REACT_APP_BUG_SNAG_STAGE=\).*#\1${REACT_APP_BUG_SNAG_STAGE}#" .env

		#Environment
		sed -i.bak "s#^\(REACT_APP_DEPLOY_ENV=\).*#\1${CI_COMMIT_REF_NAME}#" .env
	else
	    #Environment
		sed -i.bak "s#^\(REACT_APP_DEPLOY_ENV=\).*#\1review#" .env
	fi

	cat .env
}

if [ "$region" = "" ]; then
	echo "First parameter should be region name."
	exit 1
fi
if [ "$environment" = "" ]; then
	echo "Second parameter should be environment name."
	exit 1
fi

aws ssm get-parameters-by-path --recursive --path "/ns-client/" --region $region --output json| jq -r '.Parameters| .[] | .Name + " = " + .Value +""  ' > Env.txt || { echo "aws ssm command not executed properly in setEnvironmentVariables.sh script. Try again." ; exit 1; }

case $environment in
dev) 
	settingEnv
;;

qa)
	settingEnv
;;
demo) 
	settingEnv
;;
prod)
	settingEnv
;;
prod-temp)
	settingEnv
;;

*) 
	echo "Specified environment : $environment is not available."
	exit 1
;;

esac
