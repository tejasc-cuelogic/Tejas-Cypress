import * as AWS from 'aws-sdk';

import { API_VERSION, USER_POOL_ID, LIST_LIMIT } from './../constants/aws';
import adminStore from './../stores/adminStore';
import userStore from './../stores/userStore';
import authStore from '../stores/authStore';

export class Admin {
  AWSCognitoISP = null;

  // List all user from admin side
  // TODO: Pass pagination token and other params as require
  listUsers = () => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
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
          console.log(data);
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
      TemporaryPassword: userStore.newUser.password,
      Username: userStore.newUser.email,
      UserAttributes: this.newUserAttributes(),
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
      [
        {
          given_name: 'test',
          enabled: true,
          confirmed: true/false
        },
        {...},
        {...}
      ]
  */
  getFormatedUserData = (userList) => {
    const formatedUserData = [];

    userList.map((user) => {
      const userHash = {};
      user.Attributes.map((attr) => {
        userHash[attr.Name] = attr.Value;
        return null;
      });
      userHash.username = user.Username;
      userHash.enabled = user.Enabled;
      userHash.status = user.UserStatus;
      formatedUserData.push(userHash);
      return null;
    });
    return formatedUserData;
  }

  /* Returns user attributes in format required to submit to AWS Cognito */
  newUserAttributes = () => (
    [
      { Name: 'given_name', Value: userStore.newUser.givenName },
      { Name: 'family_name', Value: userStore.newUser.familyName },
      { Name: 'email', Value: userStore.newUser.email },
      { Name: 'custom:roles', Value: JSON.stringify(userStore.newUser.roles) },
      { Name: 'email_verified', Value: 'true' },
    ]
  )
  // Private method ends here
}

export default new Admin();
