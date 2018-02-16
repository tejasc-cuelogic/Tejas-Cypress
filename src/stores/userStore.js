import { observable, action, computed } from 'mobx';
import shortid from 'shortid';
import _ from 'lodash';

import api from '../ns-api';
import uiStore from './uiStore';

export class UserStore {
  @observable currentUser;
  @observable loadingUser = false;
  @observable updatingUser;
  @observable updatingUserErrors;
  @observable adminCredsUpdated = false;
  @observable userFilter = 'email';
  // TODO: add validation for all values
  @observable
  values = {
    email: '',
    familyName: '',
    givenName: '',
    password: shortid.generate(),
    roles: [],
    // emailVerified: false,
  }

  @computed get canSubmit() {
    return _.every(this.values, val => !_.isEmpty(val));
  }

  @action
  setValue(field, value) {
    this.values[field] = value;
  }

  @action
  setEmail(email) {
    this.values.email = email;
  }

  @action
  setGivenName(name) {
    this.values.givenName = name;
  }
  @action
  setFamilyName(name) {
    this.values.familyName = name;
  }

  @action
  setPassword(password) {
    this.values.password = password;
  }

  @action
  addRole(role) {
    this.values.roles.push(role);
  }

  @action
  removeRole(role) {
    this.values.roles = _.reject(this.values.roles, rol => rol === role);
  }

  @action
  setUser(user) {
    this.values = user;
  }

  @action
  setUserAttribute(key, value) {
    this.values[key] = value;
  }

  @action
  setCurrentUserAttribute(key, value) {
    this.currentUser[key] = value;
  }

  @action
  resetvalues() {
    this.values.email = '';
    this.values.givenName = '';
    this.values.familyName = '';
    this.values.roles = [];
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
    uiStore.setProgress(true);
    return api.Auth.current()
      .then(action((user) => { this.currentUser = user; }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }

  @action updateUser(userAttributes) {
    uiStore.setProgress(true);
    return api.User.update(userAttributes)
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { uiStore.setProgress(false); }));
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
