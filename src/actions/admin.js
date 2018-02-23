import * as AWS from 'aws-sdk';

import { API_VERSION, USER_POOL_ID, LIST_LIMIT, STATUSES } from './../constants/aws';
import adminStore from './../stores/adminStore';
import userStore from './../stores/userStore';
import uiStore from '../stores/uiStore';

export class Admin {
  awsCognitoISP = null;

  // List all user from admin side
  // TODO: Pass pagination token and other params as require
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

  // Creates new user on congnito user pool
  createNewUser = () => {
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Creating new user');

    const params = {
      UserPoolId: USER_POOL_ID,
      TemporaryPassword: userStore.userAttributes.password,
      Username: userStore.userAttributes.email,
      UserAttributes: this.mappedUserAttributes(),
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
        .then((data) => {
          uiStore.setSuccess('User created successfully');
          console.log(data);
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

  // Deletes user from user pool. THIS ACTION IS NOT REVERSIBLE
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
        uiStore.setSuccess('User has been successfully deleted from pool');
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

  // Admin can change non mandatory attributes of user.
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
      .then((data) => {
        uiStore.setSuccess('Updated user data');
        console.log(data);
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

  // Search User
  searchUser = (queryString) => {
    let filterString = '';
    if (queryString.length !== 0) {
      filterString = `${userStore.userFilter} ^= "${queryString}"`;
    }
    this.listUsers({ filter: filterString });
  }


  // Private method starts here

  /*
    `getFormatedUserData` returns formated user data
    input for method consist for array with hashes in following format
      [
        {
          Attributes: [
            {Name: 'given_name', Value: 'test'},
            .
            .
          ],
          Enabled: true,
          UserStatus: 'CONFIRMED',
        },
        {...},
        {...}
      ]
    and method flattens out this structure for ease of use as following
      {
        #username: {
                      given_name: 'test',
                      enabled: true,
                      confirmed: true/false
                    },
        #username: {...},
        #username: {...}
      }
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

  /* Returns user attributes in format required to submit to AWS Cognito
      If newUser parameter is set to true it will add two more attributes which are required
    while creating new user.
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
