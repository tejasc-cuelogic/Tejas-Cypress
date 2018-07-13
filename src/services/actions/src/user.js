import * as AWSCognito from 'amazon-cognito-identity-js';
import { uiStore, userStore } from '../../stores';
import { USER_POOL_ID, COGNITO_CLIENT_ID } from '../../../constants/aws';
import Helper from '../../../helper/utility';

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
        Helper.toast('Profile details updated successfully', 'success');
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
