import { observable, action } from 'mobx';
import * as AWSCognito from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk';
import userStore from './userStore';
import commonStore from './commonStore';

const userPool = new AWSCognito.CognitoUserPool({
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
});
let cognitoUser = null;

export class AuthStore {
  @observable inProgress = false;
  @observable errors = undefined;
  @observable role = 'investor';

  @observable
  values = {
    givenName: '',
    familyName: '',
    email: 'admin1@yopmail.com',
    password: 'test@123',
    verify: '',
    code: '',
  };

  @observable message = null;
  @observable oldPassword = '';
  @observable newPassword = '';
  @observable deleteButton = false;

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
  clearErrors() {
    this.errors = null;
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
  setProgress(status) {
    this.inProgress = status;
  }

  @action
  setErrors(error) {
    this.errors = error;
  }

  @action
  verifySession = () => {
    let hasSession = false;
    Object.keys(localStorage).every((key) => {
      if (key.match('CognitoIdentityServiceProvider')) {
        hasSession = true;
      }
      return key;
    });

    return (
      new Promise((res, rej) => {
        if (hasSession) {
          cognitoUser = userPool.getCurrentUser();
          return cognitoUser !== null ? res() : rej();
        }
        return rej();
      })
        .then(() =>
          new Promise((res, rej) => {
            cognitoUser.getSession((err, session) => (err ? rej(err) : res(session)));
          }))
        .then(() =>
          new Promise((res, rej) => {
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                return rej(err);
              }
              return res(attributes);
            });
          }))
        .then(attributes =>
          new Promise((res) => {
            userStore.setCurrentUser(this.parseRoles(this.mapCognitoToken(attributes)));
            if (userStore.isCurrentUserWithRole('admin')) {
              this.setAWSAdminAccess(window.localStorage.getItem('jwt'));
            }
            res();
          }))
        // Empty method needed to avoid warning.
        .catch(() => {})
        .finally(() => {
          commonStore.setAppLoaded();
        })
    );
  };

  @action
  register() {
    this.inProgress = true;
    this.errors = undefined;

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
        this.errors = this.simpleErr(err);
        throw err;
      }))
      .finally(action(() => {
        this.inProgress = false;
      }));
  }

  @action
  resetPassword() {
    this.inProgress = true;
    this.errors = undefined;

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
        this.errors = this.simpleErr(err);
        throw err;
      }))
      .finally(action(() => {
        this.inProgress = false;
      }));
  }

  @action
  setNewPassword() {
    this.inProgress = true;
    this.errors = undefined;

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
        this.errors = this.simpleErr(err);
        throw err;
      }))
      .finally(action(() => {
        this.inProgress = false;
      }));
  }

  @action
  confirmCode() {
    this.inProgress = true;
    this.errors = undefined;

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
        this.errors = this.simpleErr(err);
        throw err;
      }))
      .finally(action(() => {
        this.inProgress = false;
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
