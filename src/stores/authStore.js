import { observable, action } from 'mobx';
import * as AWSCognito from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk';
import userStore from './userStore';
import commonStore from './commonStore';
import uiStore from './uiStore';

const userPool = new AWSCognito.CognitoUserPool({
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
});
let cognitoUser = null;

export class AuthStore {
  @observable role = 'investor';
  @observable message = null;
  @observable oldPassword = '';
  @observable newPassword = '';
  @observable deleteButton = false;
  @observable newPasswordRequired = false;
  @observable cognitoUserSession = null;

  @observable
  values = {
    givenName: '',
    familyName: '',
    email: '',
    password: '',
    verify: '',
    code: '',
  };

  @action
  setFirstName(givenName) {
    this.values.givenName = givenName;
  }

  @action
  setLastName(familyName) {
    this.values.familyName = familyName;
  }

  @action
  setEmail(email) {
    this.values.email = email;
  }

  @action
  setPassword(password) {
    this.values.password = password;
  }

  @action
  setVerify(verify) {
    this.values.verify = verify;
  }

  @action
  setCode(code) {
    this.values.code = code;
  }

  @action
  setMessage(message) {
    this.message = message;
  }

  @action
  setRole(role) {
    this.role = role;
  }

  @action
  reset() {
    this.values.givenName = '';
    this.values.familyName = '';
    this.values.email = '';
    this.values.password = '';
    this.values.verify = '';
    this.values.code = '';
    this.role = 'investor';
  }

  @action
  setNewPasswordRequired() {
    this.newPasswordRequired = true;
  }

  @action
  unsetNewPasswordRequired() {
    this.newPasswordRequired = false;
  }

  @action
  setCognitoUserSession(session) {
    this.cognitoUserSession = session;
  }

  @action
  register() {
    uiStore.setProgress(true);
    uiStore.clearErrors();

    return new Promise((res, rej) => {
      const attributeRoles = new AWSCognito.CognitoUserAttribute({
        Name: 'custom:roles',
        Value: JSON.stringify([this.role]),
      });

      const attributeFirstName = new AWSCognito.CognitoUserAttribute({
        Name: 'given_name',
        Value: this.values.givenName,
      });

      const attributeLastName = new AWSCognito.CognitoUserAttribute({
        Name: 'family_name',
        Value: this.values.familyName,
      });

      const attributeList = [];
      attributeList.push(attributeRoles);
      attributeList.push(attributeFirstName);
      attributeList.push(attributeLastName);

      userPool.signUp(
        this.values.email,
        this.values.password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            return rej(err);
          }
          cognitoUser = result;
          return res();
        },
      );
    })
      .catch(action((err) => {
        uiStore.clearErrors(err);
        throw err;
      }))
      .finally(action(() => {
        uiStore.setProgress(false);
      }));
  }

  @action
  resetPassword() {
    uiStore.setProgress(true);
    uiStore.clearErrors();

    const userData = {
      Username: this.values.email,
      Pool: userPool,
    };

    return new Promise((res, rej) => {
      cognitoUser = new AWSCognito.CognitoUser(userData);
      cognitoUser.forgotPassword({
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .catch(action((err) => {
        uiStore.setErrors(err);
        throw err;
      }))
      .finally(action(() => {
        uiStore.setProgress(false);
      }));
  }

  @action
  setNewPassword() {
    uiStore.setProgress(true);
    uiStore.clearErrors();

    return new Promise((res, rej) => {
      cognitoUser = new AWSCognito.CognitoUser({
        Username: this.values.email,
        Pool: userPool,
      });
      cognitoUser.confirmPassword(this.values.code, this.values.password, {
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .catch(action((err) => {
        uiStore.setErrors(err);
        throw err;
      }))
      .finally(action(() => {
        uiStore.setProgress(false);
      }));
  }

  @action
  confirmCode() {
    uiStore.setProgress(true);
    uiStore.clearErrors();

    cognitoUser = new AWSCognito.CognitoUser({
      Username: this.values.email,
      Pool: userPool,
    });

    return new Promise((res, rej) => {
      cognitoUser.confirmRegistration(
        this.values.code,
        true,
        err => (err ? rej(err) : res()),
      );
    })
      .then(action(() => {
        this.setMessage("You're confirmed! Please login...");
      }))
      .catch(action((err) => {
        uiStore.setErrors(err);
        throw err;
      }))
      .finally(action(() => {
        uiStore.setProgress(false);
      }));
  }

  @action
  logout = () => {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    return new Promise(res => res());
  };

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });

  mapCognitoToken = (data) => {
    const mappedUser = data.reduce((obj, item) => {
      const key = item.Name.replace(/^custom:/, '');
      const newObj = obj;
      newObj[key] = item.Value;
      return newObj;
    }, {});
    return mappedUser;
  };

  adjustRoles = (data) => {
    const newData = data;
    newData.roles = data['custom:roles'];
    delete newData['custom:roles'];
    return newData;
  };

  parseRoles = (data) => {
    const newData = data;
    newData.roles = JSON.parse(data.roles);
    return newData;
  };
}

export default new AuthStore();
