import { observable, action, computed } from 'mobx';
import shortid from 'shortid';
import _ from 'lodash';

import api from '../ns-api';

export class UserStore {
  @observable currentUser;
  @observable loadingUser = false;
  @observable updatingUser;
  @observable updatingUserErrors;
  @observable adminCredsUpdated = false;
  @observable userFilter = 'email';
  // TODO: add validation for all values
  @observable
  userAttributes = {
    email: '',
    familyName: '',
    givenName: '',
    password: shortid.generate(),
    roles: [],
    status: '',
    emailVerified: false,
  }

  @computed get canSubmit() {
    return _.every(this.userAttributes, val => !_.isEmpty(val));
  }

  @action
  setEmail(email) {
    this.userAttributes.email = email;
  }

  @action
  setGivenName(name) {
    this.userAttributes.givenName = name;
  }
  @action
  setFamilyName(name) {
    this.userAttributes.familyName = name;
  }

  @action
  setPassword(password) {
    this.userAttributes.password = password;
  }

  @action
  addRole(role) {
    this.userAttributes.roles.push(role);
  }

  @action
  removeRole(role) {
    this.userAttributes.roles = _.reject(this.userAttributes.roles, rol => rol === role);
  }

  @action
  setUser(user) {
    this.userAttributes = user;
  }

  @action
  setUserAttribute(key, value) {
    this.userAttributes[key] = value;
  }

  @action
  resetUserAttributes() {
    this.userAttributes.email = '';
    this.userAttributes.givenName = '';
    this.userAttributes.familyName = '';
    this.userAttributes.roles = [];
    this.userAttributes.status = '';
    this.userAttributes.emailVerified = false;
  }

  @action
  updatedAdminCreds(status) {
    this.adminCredsUpdated = status;
  }

  @action
  setUserFilter(filter) {
    this.userFilter = filter;
  }

  @action pullUser() {
    this.loadingUser = true;
    return api.Auth.current()
      .then(action((user) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }));
  }

  @action updateUser(userAttributes) {
    this.updatingUser = true;
    return api.User.update(userAttributes)
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
