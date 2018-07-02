import { observable, action } from 'mobx';
import { FormValidator as Validator } from '../../../../helper';
import {
  LOGIN, SIGNUP, CONFIRM, CHANGE_PASS, FORGOT_PASS, RESET_PASS,
} from '../../../constants/auth';

export class AuthStore {
  @observable hasSession = false;
  @observable isUserLoggedIn = false;
  @observable newPasswordRequired = false;
  @observable cognitoUserSession = null;

  @observable LOGIN_FRM = Validator.prepareFormObject(LOGIN);
  @observable SIGNUP_FRM = Validator.prepareFormObject(SIGNUP);
  @observable CONFIRM_FRM = Validator.prepareFormObject(CONFIRM);
  @observable CHANGE_PASS_FRM = Validator.prepareFormObject(CHANGE_PASS);
  @observable FORGOT_PASS_FRM = Validator.prepareFormObject(FORGOT_PASS);
  @observable RESET_PASS_FRM = Validator.prepareFormObject(RESET_PASS);
  @observable confirmProgress = false;

  @action
  LoginChange = (e, result) => {
    this.LOGIN_FRM = Validator.onChange(this.LOGIN_FRM, Validator.pullValues(e, result));
  };

  @action
  signupChange = (e, result) => {
    this.SIGNUP_FRM = Validator.onChange(this.SIGNUP_FRM, Validator.pullValues(e, result));
  };

  @action
  ConfirmChange = (e, result) => {
    this.CONFIRM_FRM = Validator.onChange(this.CONFIRM_FRM, Validator.pullValues(e, result));
  };

  @action
  changePassChange = (e, res) => {
    this.CHANGE_PASS_FRM = Validator.onChange(this.CHANGE_PASS_FRM, Validator.pullValues(e, res));
  };

  @action
  forgotPassChange = (e, res) => {
    this.FORGOT_PASS_FRM = Validator.onChange(this.FORGOT_PASS_FRM, Validator.pullValues(e, res));
  };

  @action
  resetPassChange = (e, res) => {
    this.RESET_PASS_FRM = Validator.onChange(this.RESET_PASS_FRM, Validator.pullValues(e, res));
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
  setUserLoggedIn(status) {
    this.isUserLoggedIn = status;
  }

  @action
  setCognitoUserSession(session) {
    this.cognitoUserSession = session;
  }

  @action
  setProgress(entity) {
    this.confirmProgress = entity;
  }

  @action
  reset(form) {
    switch (form) {
      case 'LOGIN': this.LOGIN_FRM = Validator.prepareFormObject(LOGIN); break;
      case 'CONFIRM': this.CONFIRM_FRM = Validator.prepareFormObject(CONFIRM); break;
      default: this.LOGIN_FRM = Validator.prepareFormObject(LOGIN);
    }
  }
}

export default new AuthStore();
