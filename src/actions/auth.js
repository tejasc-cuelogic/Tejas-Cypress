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
import Helper from '../helper/utility';

/**
 * @desc Class for all authorization actions
 * @constructor Set cognito userPool.
 * @function $verifySession - verifies session if token is present in local storage
 * @function $setAdminAccess - sets admin access if user has admin role.
 * @function $login - Method for user login
 * @function $register - Registers new user
 * @function $resetPassword - reset password for user
 * @function $setNewPassword - Sets password for newly created user from admin section
 * @function $changePassword - Changes password for user
 * @function $confirmCode - Confirms user after registration
 * @function $logout - Logs out user
 */
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

  /**
   * @desc after refresh or coming to page after some time method verify if session is valid or not
   *       if token is present in browsers local storage, also internally set admin access to user
   *       if user has `admin` role.
   */
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
            commonStore.setToken(data.session.idToken.jwtToken);
            AWS.config.region = AWS_REGION;
            if (userStore.isCurrentUserWithRole('admin')) {
              this.setAWSAdminAccess(data.session.idToken.jwtToken);
              adminStore.setAdminCredsLoaded(true);
            }
            res();
          }))
        .then(() => {
          Helper.toast('Successfully loaded user data', 'success');
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

  /**
   * @desc This method sets admin access to user if user has admin role
   * @param $jwtToekn @type string Token that is returned after verifying session or logging in.
   * @return AWS Creds
   */
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

  /**
   * @desc Logs in user from username and password that user has entered. Fetches username and
   *       password from authStore.
   * @return null
   */
  login() {
    uiStore.reset();
    uiStore.setProgress();

    const { email, password } = authStore.values;

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
        authStore.setUserLoggedIn(true);
        if (result.action && result.action === 'newPassword') {
          authStore.setEmail(result.data.email);
          authStore.setCognitoUserSession(this.cognitoUser.Session);
          authStore.setNewPasswordRequired(true);
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

  /**
   * @desc Registers new user. Fetches required data from authStore.
   * @return null.
   */
  register() {
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
        Value: authStore.values.givenName.value,
      });

      const attributeLastName = new AWSCognito.CognitoUserAttribute({
        Name: 'family_name',
        Value: authStore.values.familyName.value,
      });

      const attributeList = [];
      attributeList.push(attributeRoles);
      attributeList.push(attributeFirstName);
      attributeList.push(attributeLastName);

      this.userPool.signUp(
        authStore.values.email.value,
        authStore.values.password.value,
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
        Helper.toast('Thanks! You have successfully signed up to the NextSeed.', 'success');
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

  /**
   * @desc Method is being called when user clicks on forgot password, which internally sends code
   *       required for changing password. On successfull completion user gets redirected to change
   *       password page.
   * @return null
   */
  resetPassword() {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Password changed successfully');
    const { email } = authStore.values;
    const userData = {
      Username: email.value,
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
        Helper.toast('Password changed successfully', 'success');
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

  /**
   * @desc Method changes password after first login for new user created from admin panel
   * @return null
   */
  setNewPassword() {
    uiStore.reset();
    uiStore.setProgress();

    const { code, email, password } = authStore.values;

    return new Promise((res, rej) => {
      this.cognitoUser = new AWSCognito.CognitoUser({
        Username: email.value,
        Pool: this.userPool,
      });
      this.cognitoUser.confirmPassword(code.value, password.value, {
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .then(() => {
        Helper.toast('Password changed successfully', 'success');
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

  /**
   * @desc Changes user password. Method gets called in success flow of forgot password
   * @return null.
   */
  changePassword() {
    uiStore.reset();
    uiStore.setProgress();
    const { email, password } = authStore.values;
    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: email.value,
      Pool: this.userPool,
    });
    this.cognitoUser.Session = authStore.cognitoUserSession;
    return new Promise((res, rej) => {
      // const userData = _.mapValues(authStore.values, prop => prop.value);
      this.cognitoUser.completeNewPasswordChallenge(
        password.value,
        { email: authStore.values.email.value },
        {
          onSuccess: data => res(data),
          onFailure: err => rej(err),
        },
      );
    })
      .then(() => {
        Helper.toast('Password changed successfully', 'success');
        authStore.setNewPasswordRequired(false);
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

  /**
   * @desc Confirms code that user gets on email on successfull registration
   * @return null
   * @todo Remove this method as new user who is registering will be auto confirmed.
   */
  confirmCode() {
    uiStore.reset();
    uiStore.setProgress();
    const { code, email } = authStore.values;
    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: email.value,
      Pool: this.userPool,
    });

    return new Promise((res, rej) => {
      this.cognitoUser.confirmRegistration(
        code.value,
        true,
        err => (err ? rej(err) : res()),
      );
    })
      .then(() => {
        Helper.toast('Successfully done confirmation', 'success');
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

  /**
   * @desc Logs out user and clears all tokens stored in browser's local storage
   * @return null
   */
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

  /**
   * @desc Method replaces all snake case keys to camel case of data recieved from cognito
   * @param $data @type Object - Data with keys in snake case format
   * @return $newData @type Object - Data with keys in camel case format
   */
  mapCognitoToken = (data) => {
    const mappedUser = data.reduce((obj, item) => {
      const key = camel(item.Name.replace(/^custom:/, ''));
      const newObj = obj;
      newObj[key] = item.Value;
      return newObj;
    }, {});
    return mappedUser;
  };

  /**
   * @desc Cognito stores role with key `custom:roles` while in app it is stored as `roles`. This
   *       method removes key `custom:roles` and adds `roles` as required by keeping all other data
   *       as it is.
   * @param $data @type Object - data that is recieved after login or verifying session
   * @return $newData @type Object - data in format needed by application.
   */
  adjustRoles = (data) => {
    const newData = {};
    _.map(data, (val, key) => { (newData[camel(key)] = val); });
    newData.roles = data['custom:roles'];
    delete newData['custom:roles'];
    return newData;
  };

  /**
   * @desc Roles recieved from cognito is array in string format. This method parse those roles.
   * @param $data @type Object - data that in key value format
   * @return $newData @type Object - Clean and parsed data
   */
  parseRoles = (data) => {
    const newData = data;
    newData.roles = (data.roles) ? JSON.parse(data.roles) : [];
    return newData;
  };

  /**
   * @desc to resend confirmation code to user-email address
   * @return null
   */
  resendConfirmationCode = () => {
    uiStore.setProgress();
    const { email } = authStore.values;
    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: email.value,
      Pool: this.userPool,
    });
    return new Promise((res, rej) => {
      this.cognitoUser.resendConfirmationCode(err => (err ? rej(err) : res()));
    })
      .then(() => {
        Helper.toast('Successfully sent confirmation code', 'success');
      })
      .catch((err) => {
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
}

export default new Auth();
