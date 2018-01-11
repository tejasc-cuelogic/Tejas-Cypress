import { observable, action } from 'mobx';
// import * as AWSCognito from 'amazon-cognito-identity-js';

export class AdminStore {
  @observable inProgress = false;
  @observable errors = null;
  @observable
  usersList = [
    {
      fname: 'test',
      lname: 'test',
      username: 'test1',
    },
    {
      fname: 'test',
      lname: 'test',
      username: 'test2',
    },
    {
      fname: 'test',
      lname: 'test',
      username: 'test3',
    },
  ];

  // @action
  // fetchUsers() {
  //   this.inProgress = true;
  //   return new Promise((res, rej) {

  //   })
  //     .then(() => 'test')
  //     .catch(() => 'test')
  //     .finally(() => {
  //       this.inProgress = false;
  //     })
  //   ;
  //   this.usersList = { username: { fname: 'test' } };
  // }

  @action
  disableUser(username) {
    return this.usersList[username];
  }
}

export default new AdminStore();
