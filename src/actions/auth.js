import * as AWSCognito from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import {
  USER_POOL_ID,
  COGNITO_CLIENT_ID,
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
} from './../constants/aws';
import userStore from './../stores/userStore';
import authStore from './../stores/authStore';
import commonStore from './../stores/commonStore';
import adminActions from './adminActions';

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
          this.cognitoUser = this.userPool.getCurrentUser();
          return this.cognitoUser !== null ? res() : rej();
        }
        return rej();
      })
        .then(() =>
          new Promise((res, rej) => {
            this.cognitoUser.getSession((err, session) => (err ? rej(err) : res(session)));
          }))
        .then(() =>
          new Promise((res, rej) => {
            this.cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                return rej(err);
              }
              return res(attributes);
            });
          }))
        .then(attributes =>
          new Promise((res) => {
            userStore.setCurrentUser(this.parseRoles(this.mapCognitoToken(attributes)));
            res();
          }))
        // Empty method needed to avoid warning.
        .catch(() => {})
        .finally(() => {
          commonStore.setAppLoaded();
        })
    );
  };

  setAWSAdminAccess = (jwtToken) => {
    AWS.config.region = AWS_REGION;
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
        console.error(error);
      } else {
        console.log(adminActions);
        console.log('Granted Admin access!');
      }
    });
  }

  login(values) {
    const { email, password } = values;

    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email,
      Password: password,
    });

    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((res, rej) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => res(result),
        onFailure: err => rej(err),
      });
    })
      .then((data) => {
        // Extract JWT from token
        commonStore.setToken(data.idToken.jwtToken);
        userStore.setCurrentUser(this.parseRoles(this.adjustRoles(data.idToken.payload)));
        // Check if currentUser has admin role, if user has admin role set admin access to user
        if (userStore.isCurrentUserWithRole('admin')) {
          this.setAWSAdminAccess(data.idToken.jwtToken);
        }
      })
      .then(() => {
        // TODO: Remove hard coded user ID
        const params = {
          UserPoolId: USER_POOL_ID /* required */,
          Username: '2980057b-441c-411e-9774-63cd0d8f67e2', /* required */
        };
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        return cognitoidentityserviceprovider.adminGetUser(
          params,
          (err, data) => {
            if (err) {
              console.log(err, err.stack);
            } else console.log(data); // an error occurred // successful response
          },
        );
      })
      .catch((err) => {
        authStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        authStore.setProgress(false);
      });
  }

  register(values) {
    authStore.setProgress(true);
    authStore.setErrors(undefined);

    return new Promise((res, rej) => {
      const attributeRoles = new AWSCognito.CognitoUserAttribute({
        Name: 'custom:roles',
        Value: JSON.stringify([this.defaultRole]),
      });

      const attributeFirstName = new AWSCognito.CognitoUserAttribute({
        Name: 'given_name',
        Value: values.givenName,
      });

      const attributeLastName = new AWSCognito.CognitoUserAttribute({
        Name: 'family_name',
        Value: values.familyName,
      });

      const attributeList = [];
      attributeList.push(attributeRoles);
      attributeList.push(attributeFirstName);
      attributeList.push(attributeLastName);

      this.userPool.signUp(
        values.email,
        values.password,
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
      .catch((err) => {
        authStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        authStore.setProgress(false);
      });
  }

  resetPassword(values) {
    authStore.setProgress(true);
    authStore.setErrors(undefined);

    const userData = {
      Username: values.email,
      Pool: this.userPool,
    };

    return new Promise((res, rej) => {
      this.cognitoUser = new AWSCognito.CognitoUser(userData);
      this.cognitoUser.forgotPassword({
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .catch((err) => {
        authStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        authStore.setProgress(false);
      });
  }

  setNewPassword() {
    authStore.setProgress(true);
    authStore.setErrors(undefined);

    return new Promise((res, rej) => {
      this.cognitoUser = new AWSCognito.CognitoUser({
        Username: this.values.email,
        Pool: this.userPool,
      });
      this.cognitoUser.confirmPassword(this.values.code, this.values.password, {
        onSuccess: data => res(data),
        onFailure: err => rej(err),
      });
    })
      .catch((err) => {
        authStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        authStore.setProgress(false);
      });
  }

  confirmCode() {
    authStore.setProgress(true);
    authStore.setErrors(undefined);

    this.cognitoUser = new AWSCognito.CognitoUser({
      Username: this.values.email,
      Pool: this.userPool,
    });

    return new Promise((res, rej) => {
      this.cognitoUser.confirmRegistration(
        this.values.code,
        true,
        err => (err ? rej(err) : res()),
      );
    })
      .then(() => {
        console.log("You're confirmed! Please login...");
      })
      .catch((err) => {
        authStore.setErrors(this.simpleErr(err));
        throw err;
      })
      .finally(() => {
        authStore.setProgress(false);
      });
  }

  logout = () => {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    // Clear all AWS credentials
    AWS.config.clear();
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

export default new Auth();
