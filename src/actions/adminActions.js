import * as AWS from 'aws-sdk';
// import _ from 'lodash';

import { API_VERSION, USER_POOL_ID, LIST_LIMIT } from './../constants/aws';
import adminStore from './../stores/adminStore';

export class AdminActions {
  AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION })

  // List all user from admin side
  // TODO: Pass pagination token and other params as require
  listUsers = () => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
    };
    const test = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION });
    return (
      new Promise((res, rej) => {
        test.listUsers(params, (err, data) => {
          if (err) {
            return rej(err);
          }
          return res(data);
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

  // Disable User from user pool
  // Pass Username as a identifier
  disableUser = (username) => {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    console.log(params);
    // return (
    //   new Promise((res, rej) => {
    //     this.AWSCognitoISP.disableUser(params, (err, data) => {
    //       if (err) {
    //         return rej(err);
    //       }
    //       return res(data);
    //     });
    //   })
    //     .then((data) => {
    //       console.log(data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    // );
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
      userHash.confirmed = user.UserStatus === 'CONFIRMED';
      formatedUserData.push(userHash);
      return null;
    });
    return formatedUserData;
  }
  // Private method ends here
}

export default new AdminActions();
