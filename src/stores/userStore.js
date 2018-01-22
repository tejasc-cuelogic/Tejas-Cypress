import { observable, action } from 'mobx';
import api from '../ns-api';

export class UserStore {
  @observable currentUser;
  @observable loadingUser;
  @observable updatingUser;
  @observable updatingUserErrors;

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

  isCurrentUserWithRole(role) {
    return this.currentUser.roles.includes(role);
  }
}

export default new UserStore();
