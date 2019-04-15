import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import cookie from 'react-cookies';
import { isEmpty, get } from 'lodash';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
import {
  LOGIN, SIGNUP, CONFIRM, CHANGE_PASS, FORGOT_PASS, RESET_PASS, NEWSLETTER,
} from '../../../constants/auth';
import { REACT_APP_DEPLOY_ENV } from '../../../../constants/common';
import { requestEmailChnage, verifyAndUpdateEmail, portPrequalDataToApplication, checkEmailExistsPresignup, checkMigrationByEmail } from '../../queries/profile';
import { subscribeToNewsLetter, notifyAdmins } from '../../queries/common';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { uiStore, navStore, identityStore, userDetailsStore, userStore } from '../../index';


export class AuthStore {
  @observable hasSession = false;
  @observable isUserLoggedIn = false;
  @observable newPasswordRequired = false;
  @observable cognitoUserSession = null;
  @observable isOfferPreviewUrl = false;
  @observable capabilities = [];
  @observable userId = null;
  @observable devAuth = {
    required: !['production', 'localhost', 'prod', 'master'].includes(REACT_APP_DEPLOY_ENV),
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
  @observable currentScore = 0;
  @observable idleTimer = null;
  @observable checkEmail = false;

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  resetIdelTimer = () => {
    if (this.idleTimer) {
      this.idleTimer.reset();
    }
  }

  @action
  setDefaultPwdType = () => {
    this.pwdInputType = 'password';
  }

  @action
  setUserId = (userId) => {
    this.userId = userId;
  }

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
      onClick: () => this.setPwdVisibilityStatus(),
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
    if (result && result.name && result.name === 'role') {
      cookie.save('ROLE_VALUE', result.value, { maxAge: 1200 });
    }
    if (e.password || e.password === '') {
      this.SIGNUP_FRM =
        Validator.onChange(this.SIGNUP_FRM, Validator.pullValuesForPassword(e, result));
    } else {
      this.SIGNUP_FRM = Validator.onChange(this.SIGNUP_FRM, Validator.pullValues(e, result));
    }
    if (e.score !== undefined) {
      this.currentScore = e.score;
    }
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
    uiStore.setErrors('');
    this.CONFIRM_FRM = Validator.onChange(
      this.CONFIRM_FRM,
      { name: 'code', value: e },
    );
  };

  @action
  changePassChange = (e, res) => {
    if (e.password || e.password === '') {
      const ojbNew = {
        isValid: 'isValid',
        password: 'newPasswd',
        score: 'score',
      };
      const newObj = this.renameKeys(ojbNew, e);
      this.CHANGE_PASS_FRM =
        Validator.onChange(this.CHANGE_PASS_FRM, Validator.pullValuesForCangePassword(newObj, res));
    } else {
      this.CHANGE_PASS_FRM = Validator.onChange(this.CHANGE_PASS_FRM, Validator.pullValues(e, res));
    }
    if (e.score !== undefined) {
      this.currentScore = e.score;
    }
  };

  @action
  forgotPassChange = (e, res) => {
    this.FORGOT_PASS_FRM = Validator.onChange(this.FORGOT_PASS_FRM, Validator.pullValues(e, res));
  };

  @action
  resetPassChange = (e, res) => {
    if (e.password || e.password === '') {
      this.RESET_PASS_FRM =
        Validator.onChange(this.RESET_PASS_FRM, Validator.pullValuesForPassword(e, res));
    } else {
      this.RESET_PASS_FRM = Validator.onChange(this.RESET_PASS_FRM, typeof e === 'string' ? { name: 'code', value: e } : Validator.pullValues(e, res));
    }
    if (e.score !== undefined) {
      this.currentScore = e.score;
    }
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
    if (status) {
      cookie.save('EVER_LOGS_IN', status, { maxAge: 31536000 });
    }
    navStore.setEverLogsIn();
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
      { name: 'password', value: credentials.password },
    );
    if (get(credentials, 'givenName')) {
      this.CONFIRM_FRM = Validator.onChange(
        this.CONFIRM_FRM,
        { name: 'givenName', value: credentials.givenName },
      );
    }
  }

  @computed get devPasswdProtection() {
    return this.devAuth.required && !this.devAuth.authStatus && !this.isOfferPreviewUrl;
  }

  @action
  setDevAppAuthStatus(status) {
    cookie.save('DEV_AUTH_TOKEN', status, { maxAge: 86400 });
    this.devAuth.authStatus = status;
  }

  @action
  resetForm = (form, targetedFields = undefined) => {
    Validator.resetFormData(this[form], targetedFields);
  }
  @computed
  get canSubmitConfirmEmail() {
    return !isEmpty(this.CONFIRM_FRM.fields.email.value) && !this.CONFIRM_FRM.fields.email.error &&
      !isEmpty(this.CONFIRM_FRM.fields.code.value) && !this.CONFIRM_FRM.fields.code.error;
  }

  @action
  setUserDetails = (fields) => {
    this.SIGNUP_FRM.fields.givenName.value = fields.firstName.value;
    this.SIGNUP_FRM.fields.familyName.value = fields.lastName.value;
    this.SIGNUP_FRM.fields.email.value = fields.email.value;
    this.LOGIN_FRM.fields.email.value = fields.email.value;
    this.SIGNUP_FRM.fields.role.value = 'issuer';
    this.SIGNUP_FRM.fields.password.value = '';
    this.SIGNUP_FRM.fields.verify.value = '';
  }

  @action
  setUserLoginDetails = (email, password) => {
    this.LOGIN_FRM.fields.email.value = email;
    this.LOGIN_FRM.fields.password.value = password;
  }

  verifyAndUpdateEmail = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyAndUpdateEmail,
          variables: {
            resourceId: identityStore.requestOtpResponse,
            confirmationCode: this.CONFIRM_FRM.fields.code.value,
          },
        })
        .then(() => {
          userDetailsStore.getUser(userStore.currentUser.sub);
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
            newEmail: this.CONFIRM_FRM.fields.email.value.toLowerCase(),
          },
        })
        .then((result) => {
          identityStore.setRequestOtpResponse(result.data.requestEmailChange);
          uiStore.setProgress(false);
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          uiStore.setProgress(false);
          reject(err);
        });
      // .finally(() => {
      //   uiStore.setProgress(false);
      // });
    });
  }

  portPrequalDataToApplication = (applicationId) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      clientPublic
        .mutate({
          mutation: portPrequalDataToApplication,
          variables: {
            prequalApplicationData: {
              userId: this.userId,
              applicationId,
            },
          },
        })
        .then((data) => {
          resolve(data.data.portPrequalDataToApplication.id);
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

  renameKeys = (keysMap, obj) => Object
    .keys(obj)
    .reduce((acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }), {});

  @action
  resetStoreData = () => {
    this.resetForm('SIGNUP_FRM', null);
    this.resetForm('LOGIN_FRM', null);
    this.resetForm('CONFIRM_FRM', null);
    this.resetForm('CHANGE_PASS_FRM', null);
    this.resetForm('FORGOT_PASS_FRM', null);
    this.resetForm('RESET_PASS_FRM', null);
    this.resetForm('NEWSLETTER_FRM', null);
  }

  @action
  setCurrentUserCapabilites = (capabilities) => {
    this.capabilities = capabilities;
  }

  @action
  checkEmailExistsPresignup = email => new Promise((res, rej) => {
    if (DataFormatter.validateEmail(email)) {
      this.checkEmail = graphql({
        client: clientPublic,
        query: checkEmailExistsPresignup,
        variables: {
          email: email.toLowerCase(),
        },
        onFetch: (data) => {
          uiStore.clearErrors();
          if (!this.checkEmail.loading && data && data.checkEmailExistsPresignup) {
            this.SIGNUP_FRM.fields.email.error = 'E-mail already exists, did you mean to log in?';
            this.SIGNUP_FRM.meta.isValid = false;
            rej();
          } else if (!this.checkEmail.loading && data && !data.checkEmailExistsPresignup) {
            this.SIGNUP_FRM.fields.email.error = '';
            res();
          }
        },
        onError: (err) => {
          uiStore.setErrors(err);
          uiStore.setProgress(false);
        },
        fetchPolicy: 'network-only',
      });
    }
  });

  @action
  checkMigrationByEmail = params => new Promise((res, rej) => {
    uiStore.setProgress();
    clientPublic.mutate({
      mutation: checkMigrationByEmail,
      variables: {
        migrationByEmailData: params,
      },
    })
      .then((data) => {
        if (!data.data.checkMigrationByEmail) {
          uiStore.setProgress(false);
          uiStore.setErrors({
            message: 'There was a problem with authentication',
            code: 'checkMigrationByEmailFailed',
          });
        }
        res(data.data.checkMigrationByEmail);
      })
      .catch((err) => {
        uiStore.setProgress(false);
        uiStore.setErrors({
          message: 'There was a problem with authentication',
          code: 'checkMigrationByEmailFailed',
        });
        rej(err);
      })
      .finally(() => { });
  });

  @action
  notifyApplicationError = params => new Promise((res, rej) => {
    clientPublic.mutate({
      mutation: notifyAdmins,
      variables: { ...params },
    })
      .then((data) => {
        res(data);
      })
      .catch((err) => {
        rej(err);
      })
      .finally(() => { });
  });

  @action
  setUserRole = (userData) => {
    this.SIGNUP_FRM.fields.role.value = userData;
  }

  @action
  subscribeToNewsletter = () => new Promise((res, rej) => {
    if (!this.NEWSLETTER_FRM.meta.isValid) {
      this.resetForm('NEWSLETTER_FRM', null);
      rej();
    } else {
      uiStore.setProgress();
      const params = Validator.ExtractValues(this.NEWSLETTER_FRM.fields);
      clientPublic.mutate({
        mutation: subscribeToNewsLetter,
        variables: { ...params },
      })
        .then(() => {
          uiStore.setProgress(false);
          res();
        })
        .catch((err) => {
          Helper.toast('Error while subscribing to NewsLetter, please try again.', 'error');
          rej(err);
        })
        .finally(() => {
          this.resetForm('NEWSLETTER_FRM', null);
        });
    }
  });
}

export default new AuthStore();
