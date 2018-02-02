import { observable, action } from 'mobx';

// TODO: Remove this store as this store is role based, remove ovservables from here
// and move them to desired store
// e.g. `usersList` should be in userStore
export class AdminStore {
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
  changeUserStatus(username, status) {
    this.usersList[username].status = status;
  }
}

export default new AdminStore();
