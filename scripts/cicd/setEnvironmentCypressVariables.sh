#!/bin/bash
region=$1
environment=$2
ci_commit_ref=$3

settingEnv()
{

	REACT_APP_AWS_REGION=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/region/ { print $3 }')
	# sed -i.bak "s/^\(REACT_APP_AWS_REGION=\).*/\1${REACT_APP_AWS_REGION}/" .envTEMPLATE

	REACT_APP_AWS_COGNITO_USER_POOL_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/userPool\/id/ { print $3 }')
	# sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_USER_POOL_ID=\).*/\1${REACT_APP_AWS_COGNITO_USER_POOL_ID}/" .envTEMPLATE

	REACT_APP_AWS_COGNITO_CLIENT_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/userPool\/clientId/ { print $3 }')
	# sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_CLIENT_ID=\).*/\1${REACT_APP_AWS_COGNITO_CLIENT_ID}/" .envTEMPLATE

	REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=$(cat Env.txt | awk '/\/ns-client\/'$environment'\/aws\/cognito\/identityPool\/id/ { print $3 }')
	# sed -i.bak "s/^\(REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=\).*/\1${REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID}/" .envTEMPLATE

	# if [ "$ci_commit_ref" = "review" ]; then
	export CYPRESS_HOST=${REACT_APP_AWS_COGNITO_USER_POOL_ID}
	# fi
}

if [ "$region" = "" ]; then
	echo "First parameter should be region name."
	exit 1
fi
if [ "$environment" = "" ]; then
	echo "Second parameter should be environment name."
	exit 1
fi

aws ssm get-parameters-by-path --recursive --path "/ns-client/" --region $region --output json| jq -r '.Parameters| .[] | .Name + " = " + .Value +""  ' > Env.txt || { echo "aws ssm command not executed properly in setEnvironmentCypressVariables.sh script. Try again." ; exit 1; }
cat Env.txt

case $environment in
dev)
	settingEnv
;;

*)
	echo "Specified environment : $environment is not available."
	exit 1
;;

esac
