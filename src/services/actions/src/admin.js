import * as AWS from 'aws-sdk';
import { toJS } from 'mobx';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';
import { API_VERSION, USER_POOL_ID, STATUSES } from '../../../constants/aws';
import { adminStore, userStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

/**
 * @desc All actions that admin has to perform
 */
export class Admin {
  awsCognitoISP = null;
  /**
   * @desc Creates New user from parameters that have been stored in store
   */
  createNewUser = (userDetails = null) => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Creating new user');

    const user = userDetails || mapValues(userStore.USR_FRM.fields, f => f.value);
    const attributes = [];
    const mapKey = { role: 'custom:roles', capabilities: 'custom:user_capabilities' };
    Object.keys(user).map((item) => {
      if (!['capabilities', 'TemporaryPassword', 'verifyPassword'].includes(item)) {
        attributes.push({
          Name: (mapKey[item] || snakeCase(item)),
          Value: (mapKey[item] ? JSON.stringify(toJS(user[item])) : toJS(user[item])),
        });
      }
      return true;
    });
    attributes.push({ Name: 'email_verified', Value: 'true' });
    const params = {
      UserPoolId: USER_POOL_ID,
      TemporaryPassword: user.TemporaryPassword,
      Username: user.email,
      UserAttributes: attributes,
    };
    this.awsCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    const dbPushParams = {
      firstName: user.givenName,
      lastName: user.familyName,
      email: user.email,
      isEmailVerified: true,
      roles: toJS(user.role).map(r => r.toUpperCase()),
      capabilities: toJS(user.capabilities),
    };
    return (
      new Promise((res, rej) => {
        this.awsCognitoISP.adminCreateUser(params, (err, data) => {
          if (err) {
            rej(err);
          }
          res(data);
        });
      })
        .then((res) => {
          adminStore.setUserId(res.User.Username);
          adminStore.pushToDb({ ...dbPushParams, ...{ userId: res.User.Username } });
        })
        .catch((err) => {
          if (err && err.message) {
            userStore.applyFormError('USR_FRM', err);
          }
          throw err;
        })
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        })
    );
  }

  deleteUser = (username) => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Deleting user from user pool');

    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    this.awsCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return new Promise((res, rej) => {
      this.awsCognitoISP.adminDeleteUser(params, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    })
      .then(() => {
        adminStore.changeUserStatus(username, STATUSES.deleted);
        Helper.toast('User has been successfully deleted from pool', 'success');
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

  /**
   * @desc Update User profile from backend, all attributes are retrieved from userStore.
   */
  updateUserAttributes = () => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Updating user');

    const params = {
      UserAttributes: this.mappedUserAttributes(false),
      UserPoolId: USER_POOL_ID,
      Username: userStore.userAttributes.username,
    };
    this.awsCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return new Promise((res, rej) => {
      this.awsCognitoISP.adminUpdateUserAttributes(params, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    })
      .then(() => Helper.toast('Updated user data', 'success'))
      .catch((err) => {
        uiStore.setErrors(err);
        throw err;
      })
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }
  /**
   * @desc Maps user attributes in format required by cognito API, method is being executed for new
   *       User, two extra parameters i.e. email and email verified are passed explicitly.
  */
  mappedUserAttributes = (newUser = true) => {
    const userData = [
      { Name: 'given_name', Value: userStore.userAttributes.givenName },
      { Name: 'family_name', Value: userStore.userAttributes.familyName },
      { Name: 'custom:roles', Value: JSON.stringify(userStore.userAttributes.roles) },
    ];
    if (newUser) {
      userData.push({ Name: 'email', Value: userStore.userAttributes.email });
      userData.push({ Name: 'email_verified', Value: 'true' });
    }
    return userData;
  }

  checkEmailExists = (email) => {
    uiStore.reset();
    uiStore.setProgress();

    this.awsCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return (
      new Promise((res, rej) => {
        this.awsCognitoISP.listUsers({
          UserPoolId: USER_POOL_ID,
          Filter: `email = '${email}'`,
          Limit: 1,
        }).promise()
          .then((data) => {
            const userId = data.Users.length ? data.Users[0].Username : null;
            return res(userId);
          })
          .catch((err) => {
            rej(err);
            throw err;
          })
          .finally(() => {
            uiStore.clearLoaderMessage();
          });
      }));
  }
}

export default new Admin();
