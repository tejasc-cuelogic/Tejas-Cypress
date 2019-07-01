settingEnv()
{
file="../../.env"

while IFS= read -r line
do
	case $(echo $line | awk -F= '{print $1}') in
	REACT_APP_AWS_REGION )
		export CYPRESS_AWS_REGION=$(echo $line | awk -F= '{print $2}') ;;
	REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID)
		export CYPRESS_AWS_COGNITO_IDENTITY_POOL_ID=$(echo $line | awk -F= '{print $2}') ;;
	REACT_APP_AWS_COGNITO_USER_POOL_ID)
		export CYPRESS_AWS_COGNITO_USER_POOL_ID=$(echo $line | awk -F= '{print $2}') ;;
	REACT_APP_AWS_COGNITO_CLIENT_ID)
		export CYPRESS_AWS_COGNITO_CLIENT_ID=$(echo $line | awk -F= '{print $2}') ;;
	esac
done < "$file"
}

settingEnv


# settingEnv()
# {
# file="../../.env.local"
# rm cypress.env.json
# echo "{" >> cypress.env.json
# while IFS= read -r line
# do
# 	case $(echo $line | awk -F= '{print $1}') in
# 	REACT_APP_AWS_REGION )
# 		echo "\"CYPRESS_AWS_REGION"\": "\"$(echo $line | awk -F= '{print $2}')"\", >> cypress.env.json ;;
# 	REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID)
# 		echo "\"CYPRESS_AWS_COGNITO_IDENTITY_POOL_ID"\": "\"$(echo $line | awk -F= '{print $2}')"\", >> cypress.env.json ;;
# 	REACT_APP_AWS_COGNITO_USER_POOL_ID)
# 		echo "\"CYPRESS_AWS_COGNITO_USER_POOL_ID"\": "\"$(echo $line | awk -F= '{print $2}')"\", >> cypress.env.json ;;
# 	REACT_APP_AWS_COGNITO_CLIENT_ID)
# 		echo "\"CYPRESS_AWS_COGNITO_CLIENT_ID"\": "\"$(echo $line | awk -F= '{print $2}')"\", >> cypress.env.json ;;
# 	esac
# done < "$file"

# echo "}" >> cypress.env.json
# }

# settingEnv