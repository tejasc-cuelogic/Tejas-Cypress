import { observable, action } from 'mobx';
// import * as AWSCognito from 'amazon-cognito-identity-js';

export class AdminStore {
  @observable inProgress = false;
  @observable errors = null;
  @observable usersList = {};

  @action
  setUsersList(list) {
    this.usersList = list;
  }

  @action
  disableUser(username) {
    return this.usersList[username];
  }

  @action
  setErrors(errors) {
    this.errors = errors;
  }

  @action
  changeUserStatus(username, status) {
    this.usersList[username].status = status;
  }
}

export default new AdminStore();
