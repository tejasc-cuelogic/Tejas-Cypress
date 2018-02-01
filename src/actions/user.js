import * as AWSCognito from 'amazon-cognito-identity-js';

import uiStore from '../stores/uiStore';
import userStore from '../stores/userStore';
import { USER_POOL_ID, COGNITO_CLIENT_ID } from './../constants/aws';

export class User {
  userPool = null;
  cognitoUser = null;

  constructor() {
    this.userPool = new AWSCognito.CognitoUserPool({
      UserPoolId: USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
  }
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
    this.cognitoUser = this.userPool.getCurrentUser();
    this.cognitoUser.getSession((err, session) => console.log(err, session));
    return new Promise((res, rej) => {
      this.cognitoUser.updateAttributes(attributeList, (err, data) => {
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
