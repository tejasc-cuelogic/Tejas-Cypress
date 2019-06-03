import { observable, action } from 'mobx';
import { GqlClient as client } from '../../../api/gqlApi';
import { adminAddUser } from '../queries/users';
import Helper from '../../../helper/utility';

// TODO: Remove this store as this store is role based, remove ovservables from here
// and move them to desired store
// e.g. `usersList` should be in userStore
export class AdminStore {
  @observable usersList = {};
  @observable userId = null;

  @action
  setUsersList(list) {
    this.usersList = list;
  }

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  disableUser(username) {
    return this.usersList[username];
  }

  @action
  changeUserStatus(username, status) {
    this.usersList[username].status = status;
  }

  @action
  pushToDb = (user) => {
    client
      .mutate({
        mutation: adminAddUser,
        variables: { userDetails: user },
      })
      .then(() => {
        Helper.toast('User created successfully', 'success');
      })
      .catch(() => Helper.toast('Error while creating user', 'error'));
  }
}

export default new AdminStore();
