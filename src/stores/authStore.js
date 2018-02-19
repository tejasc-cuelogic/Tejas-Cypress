import { observable, action, computed } from 'mobx';
import * as AWSCognito from 'amazon-cognito-identity-js';
import _ from 'lodash';
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
  @observable isUserLoggedIn = false;
  @observable hasSession = false;

  @observable
  values = {
    givenName: {
      value: '',
      error: undefined,
      rule: 'required',
      key: 'givenName',
    },
    familyName: {
      value: '',
      error: undefined,
      rule: 'required',
      key: 'familyName',
    },
    email: {
      value: '',
      error: undefined,
      rule: 'required|email',
      key: 'email',
    },
    password: {
      value: '',
      error: undefined,
      rule: 'required|min:8|max:15',
      key: 'password',
    },
    verify: {
      value: '',
      error: undefined,
      rule: 'required|same:password',
      key: 'verify',
    },
    code: {
      value: '',
      error: undefined,
      rule: 'required|numeric|digits:6',
      key: 'code',
    },
    role: {
      value: undefined,
      error: undefined,
      rule: 'required',
      key: 'role',
    },
    meta: {
      isValid: false,
      error: undefined,
    },
  };

  @computed get canRegister() {
    return _.isEmpty(_.filter(this.values, field => field.error));
  }

  @computed get canConfirm() {
    return _.isEmpty(this.values.code.value) || !!this.values.code.error;
  }

  @action
  setValue(field, value) {
    this.values[field].value = value;
  }

  @action
  setError(field, error) {
    this.values[field].error = error;
  }

  @action
  setMetaValidation(valid) {
    this.values.meta.isValid = valid;
  }

  @action
  setMetaErrors(error) {
    this.values.meta.error = error;
  }

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
  setUserLoggedIn(status) {
    this.isUserLoggedIn = status;
  }

  @action
  setHasSession(status) {
    this.hasSession = status;
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
