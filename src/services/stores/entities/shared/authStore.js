import { observable, action, computed } from 'mobx';
import cookie from 'react-cookies';
import { isEmpty } from 'lodash';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import {
  LOGIN, SIGNUP, CONFIRM, CHANGE_PASS, FORGOT_PASS, RESET_PASS, NEWSLETTER,
} from '../../../constants/auth';
import { REACT_APP_DEPLOY_ENV } from '../../../../constants/common';
import { requestEmailChnage, verifyAndUpdateEmail } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import { uiStore, userStore } from '../../index';

export class AuthStore {
  @observable hasSession = false;
  @observable isUserLoggedIn = false;
  @observable newPasswordRequired = false;
  @observable cognitoUserSession = null;
  @observable devAuth = {
    required: !['production', 'localhost'].includes(REACT_APP_DEPLOY_ENV),
    authStatus: cookie.load('DEV_AUTH_TOKEN'),
  };
  @observable LOGIN_FRM = Validator.prepareFormObject(LOGIN);
  @observable SIGNUP_FRM = Validator.prepareFormObject(SIGNUP);
  @observable CONFIRM_FRM = Validator.prepareFormObject(CONFIRM);
  @observable CHANGE_PASS_FRM = Validator.prepareFormObject(CHANGE_PASS);
  @observable FORGOT_PASS_FRM = Validator.prepareFormObject(FORGOT_PASS);
  @observable RESET_PASS_FRM = Validator.prepareFormObject(RESET_PASS);
  @observable NEWSLETTER_FRM = Validator.prepareFormObject(NEWSLETTER);
  @observable confirmProgress = false;
  @observable pwdInputType = 'password';


  @action
  setPwdVisibilityStatus = () => {
    if (this.pwdInputType === 'password') {
      this.pwdInputType = 'text';
    } else {
      this.pwdInputType = 'password';
    }
  }

  @action
  togglePasswordType = () => {
    let iconData = {
      link: true,
      onClick: this.setPwdVisibilityStatus,
    };
    if (this.pwdInputType === 'password') {
      iconData.className = 'ns-view';
    } else if (this.pwdInputType === 'text') {
      iconData.className = 'ns-view active';
    } else {
      iconData = null;
    }
    return iconData;
  }

  @action
  LoginChange = (e, result) => {
    this.LOGIN_FRM = Validator.onChange(this.LOGIN_FRM, Validator.pullValues(e, result));
  };

  @action
  signupChange = (e, result) => {
    this.SIGNUP_FRM = Validator.onChange(this.SIGNUP_FRM, Validator.pullValues(e, result));
  };

  @action
  confirmFormChange = (e, result) => {
    this.CONFIRM_FRM = Validator.onChange(this.CONFIRM_FRM, Validator.pullValues(e, result));
  };

  @action
  newsLetterChange = (e, result) => {
    this.NEWSLETTER_FRM = Validator.onChange(this.NEWSLETTER_FRM, Validator.pullValues(e, result));
  };

  @action
  ConfirmChange = (e) => {
    this.CONFIRM_FRM = Validator.onChange(
      this.CONFIRM_FRM,
      { name: 'code', value: e },
    );
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
  setCredentials(credentials) {
    this.CONFIRM_FRM = Validator.onChange(
      this.CONFIRM_FRM,
      { name: 'email', value: credentials.email },
    );
    this.CONFIRM_FRM = Validator.onChange(
      this.CONFIRM_FRM,
      { name: 'password', value: atob(credentials.password) },
    );
  }

  @computed get devPasswdProtection() {
    return this.devAuth.required && !this.devAuth.authStatus;
  }

  @action
  setDevAppAuthStatus(status) {
    cookie.save('DEV_AUTH_TOKEN', status, { maxAge: 86400 });
    this.devAuth.authStatus = status;
  }

  @action
  reset = (form) => {
    switch (form) {
      case 'LOGIN':
        this.LOGIN_FRM = Validator.prepareFormObject(LOGIN);
        break;
      case 'CONFIRM':
        this.CONFIRM_FRM = Validator.prepareFormObject(CONFIRM);
        break;
      case 'SIGNUP':
        this.SIGNUP_FRM = Validator.prepareFormObject(SIGNUP);
        break;
      default: this.LOGIN_FRM = Validator.prepareFormObject(LOGIN);
    }
  }

  @computed
  get canSubmitConfirmEmail() {
    return !isEmpty(this.CONFIRM_FRM.fields.email.value) && !this.CONFIRM_FRM.fields.email.error &&
    !isEmpty(this.CONFIRM_FRM.fields.code.value) && !this.CONFIRM_FRM.fields.code.error;
  }

  verifyAndUpdateEmail = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyAndUpdateEmail,
          variables: {
            userId: userStore.currentUser.sub,
            confirmationCode: this.CONFIRM_FRM.fields.code.value,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  requestEmailChange = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestEmailChnage,
          variables: {
            userId: userStore.currentUser.sub,
            newEmail: this.CONFIRM_FRM.fields.email.value,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new AuthStore();
