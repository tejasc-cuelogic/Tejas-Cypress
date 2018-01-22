import * as AWS from 'aws-sdk';
import { API_VERSION } from './../constants/aws';

export class AdminActions {
  AWSCognitoISP = new AWS.CognitoIdentityServiceProvider({ apiVersion: API_VERSION })

  // List all user from admin side
  // Accepted parameters are as follows
  // Limit : Limit of how many users needs to be returned
  // PaginationToken : Token for pagination
  listUsers(params) {
    params['UserPoolId'] = 
    return (
      new Promise((res, rej) => {
        this.AWSCognitoISP.listUsers()
      })
    );
  }
}

export default new AdminActions();
