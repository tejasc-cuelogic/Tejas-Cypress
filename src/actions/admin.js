import * as AWS from 'aws-sdk';

import { API_VERSION, USER_POOL_ID, LIST_LIMIT } from './../constants/aws';
import adminStore from './../stores/adminStore';
import userStore from './../stores/userStore';
import authStore from '../stores/authStore';

export class Admin {
  AWSCognitoISP = null;

  // List all user from admin side
  // TODO: Pass pagination token and other params as require
  listUsers = (options) => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
      Filter: options.filter,
    };
    this.AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.listUsers(params, (err, data) => {
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
          console.log(err);
        })
    );
  }

  // Creates new user on congnito user pool
  createNewUser = () => {
    const params = {
      UserPoolId: USER_POOL_ID,
      TemporaryPassword: userStore.userAttributes.password,
      Username: userStore.userAttributes.email,
      UserAttributes: this.mappedUserAttributes(),
    };
    this.AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.adminCreateUser(params, (err, data) => {
          if (err) {
            rej(err);
          }
          res(data);
        });
      })
        .then((data) => {
          // TODO: Redirect to the admin home page once user is created successfully with msg
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          authStore.setErrors(err);
        })
    );
  }

  // Deletes user from user pool. THIS ACTION IS NOT REVERSIBLE
  deleteUser = (username) => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    this.AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return new Promise((res, rej) => {
      this.AWSCognitoISP.adminDeleteUser(params, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    })
      .then(() => {
        adminStore.changeUserStatus(username, 'DELETED');
      })
      .catch(() => { });
  }

  // Admin can change non mandatory attributes of user.
  updateUserAttributes = () => {
    const params = {
      UserAttributes: this.mappedUserAttributes(false),
      UserPoolId: USER_POOL_ID,
      Username: userStore.userAttributes.username,
    };
    this.AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return new Promise((res, rej) => {
      this.AWSCognitoISP.adminUpdateUserAttributes(params, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
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
