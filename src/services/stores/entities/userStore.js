import { observable, action, computed } from 'mobx';
import { FormValidator as Validator } from '../../../helper';
import { NEW_USER } from '../../../constants/user';

export class UserStore {
  @observable currentUser;
  // @observable USR_FRM = Validator.prepareFormObject(NEW_USER);

  @action
  userEleChange = (e, result) => {
    this.USR_FRM = Validator.onChange(this.USR_FRM, Validator.pullValues(e, result));
  };

  @action
  applyFormError = (form, error) => {
    this[form].meta.isValid = false;
    this[form].meta.error = error.message;
  }

  @action
  userReset = () => {
    this.USR_FRM = Validator.prepareFormObject(NEW_USER);
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

  @computed get isIssuer() {
    const roles = (this.currentUser && toJS(this.currentUser.roles)) || [];
    return roles.includes('issuer');
  }
}

export default new UserStore();
