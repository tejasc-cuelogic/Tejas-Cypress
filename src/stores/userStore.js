import { toJS, observable, action, computed } from 'mobx';
import shortid from 'shortid';
import Validator from 'validatorjs';
import _ from 'lodash';
import api from '../ns-api';
import { NEW_USER } from '../constants/user';
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

  /*
  User management: create new user
  */
  @observable USR_FRM = { fields: { ...NEW_USER }, meta: { isValid: false, error: '' } };

  @action
  userEleChange = (e, result) => {
    const type = (e.target && e.target.type) ? e.target.type : (result.icon === 'dropdown' ? 'dropdown' : '');
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('USR_FRM', fieldName, fieldValue, type);
  };
  @action
  onFieldChange = (currentForm, field, value, type) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      if (type === 'checkbox' || (Array.isArray(toJS(this[form].fields[field].value)) && type !== 'dropdown')) {
        const index = this[form].fields[field].value.indexOf(value);
        if (index === -1) {
          this[form].fields[field].value.push(value);
        } else {
          this[form].fields[field].value.splice(index, 1);
        }
      } else {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      _.mapValues(this[form].fields, f => f.value),
      _.mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };

  @action
  applyFormError = (form, error) => {
    this[form].meta.isValid = false;
    this[form].meta.error = error.message;
  }

  @action
  userReset = () => {
    this.USR_FRM = { fields: { ...NEW_USER }, meta: { isValid: false, error: '' } };
  }
  // ends

  @computed get canSubmit() {
    return _.every(this.values, val => !_.isEmpty(val));
  }

  @action
  setValue(field, value) {
    this.values[field] = value;
  }

  @action
  setError(field, error) {
    this.values[field] = error;
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
