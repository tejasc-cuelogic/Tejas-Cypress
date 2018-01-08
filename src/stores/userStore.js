import { observable, action } from 'mobx';
import api from '../ns-api';

export class UserStore {
  @observable currentUser;
  @observable loadingUser;
  @observable updatingUser;
  @observable updatingUserErrors;
  @observable
  roles = {
    admin: false,
    investor: false,
    bowner: false,
  };

  @action
  setRoles(userRoles) {
    userRoles.map((role) => {
      this.currentUser.roles[role] = true;
      return role;
    });
  }

  @action
  resetRoles() {
    if (this.currentUser) {
      this.currentUser.roles.admin = false;
      this.currentUser.roles.bowner = false;
      this.currentUser.roles.investor = false;
    }
  }

  @action pullUser() {
    this.loadingUser = true;
    return api.Auth.current()
      .then(action((user) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }));
  }

  @action updateUser(newUser) {
    this.updatingUser = true;
    return api.User.update(newUser)
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }));
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

  @action setCurrentUser(user) {
    this.currentUser = user;
  }
}

export default new UserStore();
