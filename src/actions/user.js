import * as AWSCognito from 'amazon-cognito-identity-js';

import uiStore from '../stores/uiStore';
import userStore from '../stores/userStore';

const userPool = new AWSCognito.CognitoUserPool({
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
});

let cognitoUser = null;
export class User {
  updateProfile = () => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('updating your profile');

    const attributeList = [];

    const givenNameAttr = new AWSCognito.CognitoUserAttribute({
      Name: 'given_name',
      Value: userStore.currentUser.givenName,
    });

    const familyNameAttr = new AWSCognito.CognitoUserAttribute({
      Name: 'family_name',
      Value: userStore.currentUser.familyName,
    });

    attributeList.push(givenNameAttr);
    attributeList.push(familyNameAttr);

    cognitoUser = new AWSCognito.CognitoUser({
      Username: userStore.currentUser.email,
      pool: userPool,
    });
    return new Promise((res, rej) => {
      cognitoUser.updateAttributes(attributeList, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    })
      .then(() => {
        uiStore.setSuccess('Successfully updated profile details');
      })
      .catch((err) => {
        uiStore.setErrors(err);
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }
}

export default new User();
