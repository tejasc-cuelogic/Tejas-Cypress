import * as AWS from 'aws-sdk';
import { API_VERSION, USER_POOL_ID, LIST_LIMIT } from './../constants/aws';

export class AdminActions {
  AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION })

  // List all user from admin side
  // Accepted parameters are as follows
  // limit : Limit of how many users needs to be returned
  // pagination : Token for pagination
  listUsers(options) {
    const params = {
      UserPoolId: USER_POOL_ID,
      Limit: LIST_LIMIT,
      PaginationToken: options.pagination,
    };

    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.listUsers(params, (err, data) => {
          if (err) {
            rej(err);
          } else {
            res(data);
          }
        });
      })
        .then((data) => {
          console.log('Fetched Users list');
          return data;
        })
        .catch(err => console.log('Error occured while fetching users ', err))
    );
  }
}

export default new AdminActions();
