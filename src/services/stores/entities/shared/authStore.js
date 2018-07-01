import { observable, action } from 'mobx';
import { FormValidator } from '../../../../helper';
import { LOGIN, SIGNUP } from '../../../constants/auth';

export class AuthStore {
  @observable hasSession = false;
  @observable newPasswordRequired = false;
  @observable LOGIN_FRM = FormValidator.prepareFormObject(LOGIN);
  @observable SIGNUP_FRM = FormValidator.prepareFormObject(SIGNUP);

  @action
  LoginChange = (e, result) => {
    this.LOGIN_FRM = FormValidator.onChange(this.LOGIN_FRM, FormValidator.pullValues(e, result));
  };

  @action
  signupChange = (e, result) => {
    this.SIGNUP_FRM = FormValidator.onChange(this.SIGNUP_FRM, FormValidator.pullValues(e, result));
  };

  @action
  setNewPasswordRequired(value) {
    this.newPasswordRequired = value;
  }

  @action
  setHasSession(status) {
    this.hasSession = status;
  }

  @action
  reset(form) {
    switch (form) {
      case 'LOGIN': this.LOGIN_FRM = FormValidator.prepareFormObject(LOGIN); break;
      default: this.LOGIN_FRM = FormValidator.prepareFormObject(LOGIN);
    }
  }
}

export default new AuthStore();
