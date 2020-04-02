import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import cookie from 'react-cookies';
import { isEmpty, get, map } from 'lodash';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
import {
  LOGIN, SIGNUP, CONFIRM, CHANGE_PASS, FORGOT_PASS, RESET_PASS, NEWSLETTER,
} from '../../../constants/auth';
import { REACT_APP_DEPLOY_ENV } from '../../../../constants/common';
import { portPrequalDataToApplication, checkEmailExistsPresignup } from '../../queries/profile';
import { subscribeToNewsLetter, notifyAdmins } from '../../queries/common';
import { adminValidateCreateAdminUser } from '../../queries/users';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { uiStore, navStore, userDetailsStore, userStore, businessAppStore } from '../../index';
import { validateOfferingPreviewPassword } from '../../queries/campagin';


export class AuthStore {
  @observable hasSession = false;

  @observable isUserLoggedIn = false;

  @observable newPasswordRequired = false;

  @observable cognitoUserSession = null;

  @observable isBoxApiChecked = false;

  @observable isOfferPreviewUrl = false;

  @observable capabilities = [];

  @observable userId = null;

  @observable emailList = [];

  @observable devAuth = {
    required: !['production', 'localhost', 'prod', 'master', 'infosec'].includes(REACT_APP_DEPLOY_ENV),
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
  setPwdVisibilityStatus = () => {
    this.pwdInputType = this.pwdInputType === 'password' ? 'text' : 'password';
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
    const values = (e.password || e.password === '') ? Validator.pullValuesForPassword(e, result) : Validator.pullValues(e, result);
    this.SIGNUP_FRM = Validator.onChange(this.SIGNUP_FRM, values);
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
  setVerifyPassword = (e) => {
    this.SIGNUP_FRM = Validator.onChange(
      this.SIGNUP_FRM,
      { name: 'verify', value: e.password },
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
      this.CHANGE_PASS_FRM = Validator.onChange(this.CHANGE_PASS_FRM, Validator.pullValuesForCangePassword(newObj, res));
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
      this.RESET_PASS_FRM = Validator.onChange(this.RESET_PASS_FRM, Validator.pullValuesForPassword(e, res));
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

  setUserCredentiansConfirmEmail = () => {
    if (this.isUserLoggedIn) {
      const { password, email } = this.CONFIRM_FRM.fields;
      const userCredentials = {
        email: email.value
        || get(userDetailsStore, 'userDetails.email.address')
        || sessionStorage.getItem('changedEmail') || '',
        password: password.value,
        givenName: get(userDetailsStore, 'userDetails.info.firstName') || '',
      };
      this.setCredentials(userCredentials);
    }
  }

  @computed get devPasswdProtection() {
    return this.devAuth.required && !this.devAuth.authStatus && !this.isOfferPreviewUrl;
  }

  @action setUserId(userId) {
    this.userId = userId;
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
    return !isEmpty(this.CONFIRM_FRM.fields.email.value) && !this.CONFIRM_FRM.fields.email.error
      && !isEmpty(this.CONFIRM_FRM.fields.code.value) && !this.CONFIRM_FRM.fields.code.error;
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
    this.newPasswordRequired = false;
    this.isUserLoggedIn = false;
  }

  @action
  setCurrentUserCapabilites = (capabilities) => {
    this.capabilities = capabilities;
  }

  isEmailExist = email => (this.emailList.find(e => e === email))

  @action
  checkEmailExistsPresignup = (email, isBusinessApplication = false) => new Promise((res) => {
    if (DataFormatter.validateEmail(email) && !this.isEmailExist(email)) {
      if (isBusinessApplication) {
        uiStore.setProgress();
      }
      this.checkEmail = graphql({
        client: clientPublic,
        query: checkEmailExistsPresignup,
        variables: {
          email: email.toLowerCase(),
        },
        onFetch: (data) => {
          uiStore.clearErrors();
          if (!this.checkEmail.loading && get(data, 'checkEmailExistsPresignup.isEmailExits')) {
            if (isBusinessApplication) {
              businessAppStore.setFieldvalue('userRoles', get(data, 'checkEmailExistsPresignup.roles'));
              businessAppStore.setFieldvalue('userExists', true);
              businessAppStore.setBasicFormError(get(data, 'checkEmailExistsPresignup.roles') && get(data, 'checkEmailExistsPresignup.roles').includes('issuer') ? 'This email is already exists as an issuer. Please Log In' : `This email address is already exists as ${get(data, 'checkEmailExistsPresignup.roles').includes('admin') ? 'admin' : 'investor'}. Please try with differrent email.`);
              res(true);
            } else {
              this.emailList.push(email);
              this.SIGNUP_FRM.fields.email.error = 'Email already exists, did you mean to log in?';
              this.SIGNUP_FRM.meta.isValid = false;
              res(false);
            }
            uiStore.setProgress(false);
          } else if (!this.checkEmail.loading && !get(data, 'checkEmailExistsPresignup.isEmailExits')) {
            this.SIGNUP_FRM.fields.email.error = '';
            uiStore.setProgress(false);
            res(true);
          }
        },
        onError: (err) => {
          uiStore.setErrors(err);
          uiStore.setProgress(false);
        },
        fetchPolicy: 'network-only',
      });
    } else {
      this.SIGNUP_FRM.fields.email.error = 'Email already exists, did you mean to log in?';
      this.SIGNUP_FRM.meta.isValid = false;
      uiStore.setProgress(false);
      res(false);
    }
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
    this.NEWSLETTER_FRM = Validator.validateForm(this.NEWSLETTER_FRM, false, true);
    if (!this.NEWSLETTER_FRM.meta.isValid) {
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

  IsInvalidException = (res) => {
    if (get(res, 'graphQLErrors[0].message')) {
      try {
        const parsedError = JSON.parse(get(res, 'graphQLErrors[0].message'));
        if (parsedError.code === 'OFFERING_EXCEPTION') {
          return true;
        }
      } catch {
        if (get(res, 'graphQLErrors[0].message').includes('OFFERING_EXCEPTION')) {
          return true;
        }
      }
    }
    return false;
  }

  sendErrorMail = (res) => {
    const errors = {};
    const gqlErr = {};

    if (this.IsInvalidException(res)) {
      return;
    }

    if (this.isUserLoggedIn) {
      errors.userEmailId = userStore.getUserEmailAddress();
      errors.userId = userStore.getUserId();
    }
    errors.browserName = window.navigator.userAgent;
    errors.platform = window.navigator.platform;

    const errorList = map(get(res, 'graphQLErrors'), e => e.message);
    gqlErr.operationName = get(res, 'operation.operationName') || '';
    gqlErr.errors = errorList;
    gqlErr.requestParams = JSON.stringify(get(res, 'operation.variables') || '');
    errors.graphqlError = gqlErr;

    if (get(res, 'networkError.statusCode')) {
      const networkErr = {};
      networkErr.statusCode = get(res, 'networkError.statusCode');
      networkErr.errorMessage = get(res, 'networkError.result.message');

      errors.networkError = networkErr;
    }
    if (window.FS && window.FS.getCurrentSessionURL) {
      const fullStorySession = window.FS.getCurrentSessionURL(true);
      errors.fullStoryUrl = fullStorySession;
    }
    const params = {
      emailContent: JSON.stringify(errors),
    };
    this.notifyApplicationError(params).then(() => { }).catch((e) => {
      window.logger('Error while calling notifyApplicationError', e);
    });
  }

  @action
  validateOfferingPreviewPassword = (offeringSlug, previewPassword) => new Promise((res, rej) => {
    graphql({
      client: clientPublic,
      query: validateOfferingPreviewPassword,
      variables: {
        offeringSlug,
        previewPassword,
      },
      onFetch: (data) => {
        uiStore.clearErrors();
        if (data) {
          res(get(data, 'validateOfferingPreviewPassword'));
        }
      },
      onError: (err) => {
        uiStore.setErrors(err);
        uiStore.setProgress(false);
        Helper.toast('Something went wrong, please try again.', 'error');
        rej();
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  adminValidateCreateAdminUser = (email, actionType = null) => new Promise((res, rej) => {
    const variables = actionType ? { email, action: actionType } : { email };
    client.mutate({
      mutation: adminValidateCreateAdminUser,
      variables,
    })
      .then((data) => {
        res(data.adminValidateCreateAdminUser);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export default new AuthStore();
