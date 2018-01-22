import * as AWS from 'aws-sdk';

import { API_VERSION, USER_POOL_ID, LIST_LIMIT } from './../constants/aws';
// import adminStore from './../stores/adminStore';

export class AdminActions {
  AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION })

  // List all user from admin side
  // Accepted parameters are as follows
  // limit : Limit of how many users needs to be returned
  // pagination : Token for pagination
  listUsers = (pageToken) => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
      PaginationToken: pageToken,
    };

    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.listUsers(params, (err, data) => {
          if (err) {
            return rej(err);
          }
          return res(data);
        });
      })
        .then((data) => {
          console.log('in the admin actions list users action', data);
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  // Disable User from user pool
  // Pass Username as a identifier
  disableUser = (username) => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };

    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.disableUser(params, (err, data) => {
          if (err) {
            return rej(err);
          }
          return res(data);
        });
      })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}

export default new AdminActions();
