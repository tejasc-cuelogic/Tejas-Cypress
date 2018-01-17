import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';

const userPool = new AWSCognito.CognitoUserPool({
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
});

const identityPoolDetails = {
  IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  Logins: {},
};

const cognitoUser = null;

// identityPoolDetails.Logins[
//   `cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${
//     process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID
//   }`
// ] =
//   data.idToken.jwtToken;

AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolDetails);

// const userPool = {
//   adminGetUser
// }
// export function getUser

// AWS.config.region = process.env.REACT_APP_AWS_REGION;
//         // Create a object for the Identity pool and pass the appropriate paramenters to it
//         const identityPoolDetails = {
//           IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
//           Logins: {},
//         };
//         identityPoolDetails.Logins[`cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID}`] = data.idToken.jwtToken;

//         AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolDetails);

//         return AWS.config.credentials.refresh((error) => {
//           if (error) {
//             console.error(error);
//           } else {
//             console.log('Successfully logged!');
//           }
//         });
