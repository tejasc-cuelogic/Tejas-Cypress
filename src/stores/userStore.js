import { observable, action, computed } from 'mobx';
import shortid from 'shortid';
import _ from 'lodash';

import api from '../ns-api';

export class UserStore {
  @observable currentUser;
  @observable loadingUser = false;
  @observable updatingUser;
  @observable updatingUserErrors;
  @observable
  newUser = {
    email: '',
    familyName: '',
    givenName: '',
    password: shortid.generate(),
    roles: [],
  }
  @computed get canSubmit() {
    return _.every(this.newUser, val => !_.isEmpty(val));
  }

  @action
  setEmail(email) {
    this.newUser.email = email;
  }

  @action
  setGivenName(name) {
    this.newUser.givenName = name;
  }
  @action
  setFamilyName(name) {
    this.newUser.familyName = name;
  }

  @action
  setPassword(password) {
    this.newUser.password = password;
  }

  @action
  addRole(role) {
    this.newUser.roles.push(role);
  }

  @action
  removeRole(role) {
    this.newUser.roles = _.reject(this.newUser.roles, rol => rol === role);
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

  isCurrentUserWithRole(role) {
    return this.currentUser.roles.includes(role);
  }
}

export default new UserStore();
