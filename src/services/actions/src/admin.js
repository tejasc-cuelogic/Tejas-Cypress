import * as AWS from 'aws-sdk';
import { toJS } from 'mobx';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';
import { API_VERSION, USER_POOL_ID, LIST_LIMIT, STATUSES } from '../../../constants/aws';
import { adminStore, userStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

/**
 * @desc All actions that admin has to perform
 *       IMP: All these actions need admin creds that are being set from
 *       Auth::setAdminAccess from auth actions
 * @function $listUsers
 * @function $createNewUser
 * @function $deleteUser
 * @function $updateUserAttributes
 * @function $searchUser
 */
export class Admin {
  awsCognitoISP = null;

  /**
   * @desc List users in cognito from whatever options we have passed.
   * @param $options options by which users have to be filtered out
   * @todo Pass pagination token and other params as require.
   * @see https://github.com/CassetteRocks/react-infinite-scroller
   */
  listUsers = (options) => {
    uiStore.reset();
    // uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching user data');

    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
      Filter: options.filter,
    };
    this.awsCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return (
      new Promise((res, rej) => {
        this.awsCognitoISP.listUsers(params, (err, data) => {
          if (err) {
            rej(err);
          }
          res(data);
        });
      })
        .then((data) => {
          adminStore.setUsersList(this.getFormatedUserData(data.Users));
        })
        .catch((err) => {
          uiStore.setErrors(err);
          throw err;
        })
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        })
    );
  }

  /**
   * @desc Creates New user from parameters that have been stored in store
   */
  createNewUser = () => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Creating new user');

    const user = mapValues(userStore.USR_FRM.fields, f => f.value);
    const attributes = [];
    Object.keys(user).map((item) => {
      if (item !== 'TemporaryPassword' && item !== 'verifyPassword') {
        attributes.push({
          Name: (item === 'role' ? 'custom:roles' : snakeCase(item)),
          Value: (item === 'role' ? JSON.stringify(toJS(user[item])) : toJS(user[item])),
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
    return (
      new Promise((res, rej) => {
        this.awsCognitoISP.adminCreateUser(params, (err, data) => {
          if (err) {
            rej(err);
          }
          res(data);
        });
      })
        .then(() => Helper.toast('User created successfully', 'success'))
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

  /**
   * @desc Delete user from username that has been passed, username here is email id that user has
   *       given while signing up
   * @param $username @type String - Username(email) of user which has to be deleted from cognito
   *        userpool.
   */
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
   * @desc Search user from provided querystring, internally this method calls @function $listUsers
   *       with search parameters
   * @param $queryString @type String - Query from which we have to search user in cognito userpool
   * @return List of user matching search query.
   */
  searchUser = (queryString) => {
    let filterString = '';
    if (queryString.length !== 0) {
      filterString = `${userStore.userFilter} ^= "${queryString}"`;
    }
    this.listUsers({ filter: filterString });
  }


  // Private method starts here

  /**
   * @desc Arrange user data that has been recieved from cognito.
   */
  getFormatedUserData = (userList) => {
    const formatedUserData = {};

    userList.map((user) => {
      const userHash = {};
      user.Attributes.map((attr) => {
        userHash[attr.Name] = attr.Value;
        return null;
      });
      userHash.username = user.Username;
      userHash.enabled = user.Enabled;
      userHash.UserCreateDate = user.UserCreateDate.toString();
      userHash.status = user.UserStatus;
      formatedUserData[user.Username] = userHash;
      return null;
    });
    return formatedUserData;
  }

  /**
   * @desc Maps user attributes in format required by cognito API, method is being executed for new
   *       User, two extra parameters i.e. email and email verified are passed explicitly.
   * @param $newUser @type boolean - value to decide if method is being executed for new user
   * @return Formatted user data
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
  // Private method ends here
}

export default new Admin();
