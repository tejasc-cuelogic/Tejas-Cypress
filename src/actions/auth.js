import * as AWSCognito from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import camel from 'to-camel-case';
import _ from 'lodash';

import {
  USER_POOL_ID,
  COGNITO_CLIENT_ID,
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
} from './../constants/aws';
import userStore from './../stores/userStore';
import authStore from './../stores/authStore';
import commonStore from './../stores/commonStore';
import adminStore from '../stores/adminStore';
import uiStore from '../stores/uiStore';

export class Auth {
  defaultRole = 'investor';
  userPool = null;
  cognitoUser = null

  constructor() {
    this.userPool = new AWSCognito.CognitoUserPool({
      UserPoolId: USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
  }

  verifySession = () => {
    uiStore.reset();
    uiStore.setAppLoader(true);
    uiStore.setLoaderMessage('Getting user data');

    Object.keys(localStorage).every((key) => {
      if (key.match('CognitoIdentityServiceProvider')) {
        authStore.setHasSession(true);
      }
      return key;
    });

    return (
      new Promise((res, rej) => {
        if (authStore.hasSession) {
          this.cognitoUser = this.userPool.getCurrentUser();
          return this.cognitoUser !== null ? res() : rej();
        }
        return rej();
      })
        .then(() =>
          new Promise((res, rej) => {
            this.cognitoUser.getSession((err, session) => (err ? rej(err) : res(session)));
          }))
        .then(session =>
          new Promise((res, rej) => {
            this.cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                return rej(err);
              }
              return res({ attributes, session });
            });
          }))
        .then(data =>
          new Promise((res) => {
            userStore.setCurrentUser(this.parseRoles(this.mapCognitoToken(data.attributes)));
            authStore.setUserLoggedIn(true);
            AWS.config.region = AWS_REGION;
            if (userStore.isCurrentUserWithRole('admin')) {
              this.setAWSAdminAccess(data.session.idToken.jwtToken);
              adminStore.setAdminCredsLoaded(true);
            }
            res();
          }))
        .then(() => {
          uiStore.setSuccess('Successfully loaded user data');
        })
        // Empty method needed to avoid warning.
        .catch(() => { })
        .finally(() => {
          commonStore.setAppLoaded();
          uiStore.setAppLoader(false);
          uiStore.clearLoaderMessage();
        })
    );
  };

  setAWSAdminAccess = (jwtToken) => {
    // Create a object for the Identity pool and pass the appropriate paramenters to it
    const identityPoolDetails = {
      IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
      Logins: {},
    };
    identityPoolDetails.Logins[`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] =
      jwtToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolDetails);

    return AWS.config.credentials.refresh((error) => {
      if (error) {
        uiStore.setErrors(this.simpleErr(error));
        throw error;
      }
    });
  }

  login(values) {
    uiStore.reset();
    uiStore.setProgress();

    const { email, password } = values;

    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email.value,
      Password: password.value,
    });

    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: email.value,
      Pool: this.userPool,
    });

    return new Promise((res, rej) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => res({ data: result }),
        newPasswordRequired: (result) => {
          res({ data: result, action: 'newPassword' });
        },
        onFailure: err => rej(err),
      });
    })
      .then((result) => {
        uiStore.setSuccess('Successfully logged in');
        authStore.setUserLoggedIn(true);
        if (result.action && result.action === 'newPassword') {
          authStore.setEmail(result.data.email);
          authStore.setCognitoUserSession(this.cognitoUser.Session);
          authStore.setNewPasswordRequired();
        } else {
          const { data } = result;
          // Extract JWT from token
          commonStore.setToken(data.idToken.jwtToken);
          userStore.setCurrentUser(this.parseRoles(this.adjustRoles(data.idToken.payload)));
          AWS.config.region = AWS_REGION;
          // Check if currentUser has admin role, if user has admin role set admin access to user
          if (userStore.isCurrentUserWithRole('admin')) {
            this.setAWSAdminAccess(data.idToken.jwtToken);
          }
        }
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  register(values) {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Signing you up');

    return new Promise((res, rej) => {
      const attributeRoles = new AWSCognito.CognitoUserAttribute({
        Name: 'custom:roles',
        Value: JSON.stringify([authStore.values.role.value]),
      });

      const attributeFirstName = new AWSCognito.CognitoUserAttribute({
        Name: 'given_name',
        Value: values.givenName.value,
      });

      const attributeLastName = new AWSCognito.CognitoUserAttribute({
        Name: 'family_name',
        Value: values.familyName.value,
      });

      const attributeList = [];
      attributeList.push(attributeRoles);
      attributeList.push(attributeFirstName);
      attributeList.push(attributeLastName);

      this.userPool.signUp(
        values.email.value,
        values.password.value,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            return rej(err);
          }
          this.cognitoUser = result;
          return res();
        },
      );
    })
      .then(() => {
        uiStore.setSuccess('Sign up successfull');
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  resetPassword(values) {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Changing password');

    const userData = {
      Username: values.email.value,
      Pool: this.userPool,
    };

    return new Promise((res, rej) => {
      this.cognitoUser = new AWSCognito.CognitoUser(userData);
      this.cognitoUser.forgotPassword({
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .then(() => {
        uiStore.setSuccess('Changed Password');
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  setNewPassword() {
    uiStore.reset();
    uiStore.setProgress();

    const { values } = authStore;

    return new Promise((res, rej) => {
      this.cognitoUser = new AWSCognito.CognitoUser({
        Username: values.email.value,
        Pool: this.userPool,
      });
      this.cognitoUser.confirmPassword(values.code.value, values.password.value, {
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .then(() => {
        uiStore.setSuccess('Password changed successfully');
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  changePassword() {
    uiStore.reset();
    uiStore.setProgress();

    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: authStore.values.email.value,
      Pool: this.userPool,
    });
    this.cognitoUser.Session = authStore.cognitoUserSession;
    return new Promise((res, rej) => {
      this.cognitoUser.completeNewPasswordChallenge(authStore.values.password, this.values, {
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .then(() => {
        uiStore.setSuccess('Successfully changed password');
        authStore.unsetNewPasswordRequired();
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  confirmCode() {
    uiStore.reset();
    uiStore.setProgress();

    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: authStore.values.email.value,
      Pool: this.userPool,
    });

    return new Promise((res, rej) => {
      this.cognitoUser.confirmRegistration(
        authStore.values.code.value,
        true,
        err => (err ? rej(err) : res()),
      );
    })
      .then(() => {
        uiStore.setSuccess('Successfully done confirmation');
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  logout = () => (
    new Promise((res) => {
      commonStore.setToken(undefined);
      userStore.forgetUser();
      this.cognitoUser.signOut();
      AWS.config.clear();
      authStore.setUserLoggedIn(false);
      res();
    })
    // Clear all AWS credentials
  );

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });

  mapCognitoToken = (data) => {
    const mappedUser = data.reduce((obj, item) => {
      const key = camel(item.Name.replace(/^custom:/, ''));
      const newObj = obj;
      newObj[key] = item.Value;
      return newObj;
    }, {});
    return mappedUser;
  };

  adjustRoles = (data) => {
    const newData = {};
    _.map(data, (val, key) => { (newData[camel(key)] = val); });
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

export default new Auth();
