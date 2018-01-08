import { observable, action } from 'mobx';
import * as AWSCognito from 'amazon-cognito-identity-js';
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

  @observable
  values = {
    username: '',
    email: '',
    password: '',
    verify: '',
    code: '',
  };

  @observable message = null;
  @observable oldPassword = '';
  @observable newPassword = '';
  @observable deleteButton = false;

  @action
  setUsername(username) {
    this.values.username = username;
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
  reset() {
    this.values.username = '';
    this.values.email = '';
    this.values.password = '';
    this.values.verify = '';
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
            attributes.map((key) => {
              if (key.Name === 'email') {
                userStore.setCurrentUser({
                  username: cognitoUser.username,
                  email: key.Value,
                });
              }
              return key;
            });
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
  login() {
    this.inProgress = true;
    this.errors = undefined;
    const { username } = this.values;

    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: username,
      Password: this.values.password,
    });

    cognitoUser = new AWSCognito.CognitoUser({
      Username: this.values.username,
      Pool: userPool,
    });

    return new Promise((res, rej) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => res(result),
        onFailure: err => rej(err),
      });
    })
      .then((data) => {
        // Extract JWT from token
        commonStore.setToken(data.idToken.jwtToken);
        userStore.setCurrentUser({
          username,
          email: data.idToken.email,
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
  register() {
    this.inProgress = true;
    this.errors = undefined;

    return new Promise((res, rej) => {
      // Set email attribute
      const attributeEmail = new AWSCognito.CognitoUserAttribute({
        Name: 'email',
        Value: this.values.email,
      });

      const attributeList = [];
      attributeList.push(attributeEmail);

      userPool.signUp(
        this.values.username,
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
      Username: this.values.username,
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
        Username: this.values.username,
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
      Username: this.values.username,
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
}

export default new AuthStore();
