import * as AWS from 'aws-sdk';
import Amplify from '@aws-amplify/core';
import AmplifyAuth from '@aws-amplify/auth';
import { map, mapValues, camelCase, get } from 'lodash';
import { GqlClient as client } from '../../../api/gqlApi';
import {
  USER_POOL_ID, COGNITO_CLIENT_ID, AWS_REGION, COGNITO_IDENTITY_POOL_ID,
} from '../../../constants/aws';
import {
  userStore,
  userDetailsStore,
  authStore,
  commonStore,
  uiStore,
  accountStore,
  identityStore,
  investorProfileStore,
  iraAccountStore,
  entityAccountStore,
  bankAccountStore,
  individualAccountStore,
  portfolioStore,
  investmentStore,
  accreditationStore,
  transactionStore,
} from '../../stores';
import { FormValidator as Validator } from '../../../helper';
import Helper from '../../../helper/utility';

/**
 * @desc Class for all authorization actions
 * @constructor Set cognito userPool.
 * @function $verifySession - verifies session if token is present in local storage
 * @function $setAdminAccess - sets admin access if user has admin role.
 * @function $login - Method for user login
 * @function $register - Registers new user
 * @function $resetPassword - reset password for user
 * @function $setNewPassword - Sets password for newly created user from admin section
 * @function $changePassword - Changes password for user
 * @function $logout - Logs out user
 */
export class Auth {
  defaultRole = 'investor';

  userPool = null;

  cognitoUser = null;

  constructor() {
    Amplify.configure({
      Auth: {
        identityPoolId: COGNITO_IDENTITY_POOL_ID,
        region: AWS_REGION,
        userPoolId: USER_POOL_ID,
        userPoolWebClientId: COGNITO_CLIENT_ID,
      },
    });
  }

  async getUserSession() {
    uiStore.setProgress();
    try {
      this.cognitoUser = await AmplifyAuth.currentSession();
      return this.cognitoUser;
    } catch (err) {
      console.log('error in getUserSession', err);
      return null;
    } finally {
      uiStore.setProgress(false);
    }
  }

  /**
   * @desc after refresh or coming to page after some time method verify if session is valid or not
   *       if token is present in browsers local storage, also internally set admin access to user
   *       if user has `admin` role.
   */

  verifySession = () => {
    uiStore.reset();
    uiStore.setAppLoader(true);
    uiStore.setLoaderMessage('Getting user data');

    return (
      new Promise((res, rej) => {
        AmplifyAuth.currentSession().then((currentUser) => {
          if (currentUser) {
            AmplifyAuth.currentAuthenticatedUser().then((user) => {
              const { signInUserSession, attributes } = user;
              const mapData = this.parseRoles(this.mapCognitoToken(attributes));
              userStore.setCurrentUser(mapData);
              authStore.setUserLoggedIn(true);
              commonStore.setToken(signInUserSession.idToken.jwtToken);
              AWS.config.region = AWS_REGION;
              if (userStore.isAdmin) {
                this.setAWSAdminAccess(signInUserSession.idToken.jwtToken);
              }
              return res({ attributes, session: signInUserSession });
            }).catch((err) => {
              console.log('error in verifysession', err);
              rej(err);
            })
              .finally(() => {
                commonStore.setAppLoaded();
                uiStore.setAppLoader(false);
                uiStore.clearLoaderMessage();
              });
          }
        }).catch((err) => {
          console.log('error in verifysession', err);
          rej(err);
        }).finally(() => {
          commonStore.setAppLoaded();
          uiStore.setAppLoader(false);
          uiStore.clearLoaderMessage();
        });
      })
    );
  }

  /**
   * @desc This method sets admin access to user if user has admin role
   * @param $jwtToekn @type string Token that is returned after verifying session or logging in.
   * @return AWS Creds
   */
  setAWSAdminAccess = (jwtToken) => {
    // Create a object for the Identity pool and pass the appropriate paramenters to it
    const identityPoolDetails = {
      IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
      Logins: {},
    };
    identityPoolDetails.Logins[`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] = jwtToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolDetails);
    return AWS.config.credentials.refresh((error) => {
      if (error) {
        uiStore.setErrors(this.simpleErr(error));
        throw error;
      }
    });
  }

  /**
   * @desc Logs in user from username and password that user has entered. Fetches username and
   *       password from authStore.
   * @return null
   */
  async login() {
    client.clearStore();
    uiStore.reset();
    uiStore.setProgress();
    const { email, password } = Validator.ExtractValues(authStore.LOGIN_FRM.fields);
    const lowerCasedEmail = email.toLowerCase();
    client.cache.reset();
    authStore.setNewPasswordRequired(false);
    authStore.setUserLoggedIn(false);
    uiStore.addMoreInProgressArray('login');

    try {
      const user = await AmplifyAuth.signIn({ username: lowerCasedEmail, password });
      await this.amplifyLogin(user);
    } catch (err) {
      if (Helper.matchRegexWithString(/\bTemporary password has expired(?![-])\b/, err.message)) {
        await this.resetPasswordExpiration(lowerCasedEmail, password);
      } else {
        uiStore.removeOneFromProgressArray('login');
        uiStore.setProgress(false);
        uiStore.setErrors(this.simpleErr(err));
        throw err;
      }
    }
  }

  resetPasswordExpiration = async (lowerCasedEmail, password) => {
    const res = await userStore.resetPasswordExpirationForCognitoUser(lowerCasedEmail);
    if (res.data.resetPasswordExpirationDurationForCognitoUser) {
      const user = await AmplifyAuth.signIn({ username: lowerCasedEmail, password });
      await this.amplifyLogin(user);
    }
    return Promise.resolve(true);
  }

  amplifyLogin = user => new Promise((res) => {
    if (user && !user.signInUserSession && user.challengeName && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      if (user.signInUserSession) {
        authStore.setCognitoUserSession(user.signInUserSession);
      }
      if (user.attributes) {
        authStore.setEmail(user.attributes.email.toLowerCase());
      }
      authStore.setNewPasswordRequired(true);
      authStore.setUserLoggedIn(true);
      res();
    }
    if (user && user.signInUserSession) {
      authStore.setUserLoggedIn(true);
      localStorage.removeItem('lastActiveTime');
      localStorage.removeItem('defaultNavExpanded');
      // Extract JWT from token
      const { idToken } = user.signInUserSession;
      commonStore.setToken(idToken.jwtToken);
      userStore.setCurrentUser(this.parseRoles(this.adjustRoles(idToken.payload)));
      userDetailsStore.getUser(userStore.currentUser.sub).then((data) => {
        if (window.localStorage.getItem('ISSUER_REFERRAL_CODE') && window.localStorage.getItem('ISSUER_REFERRAL_CODE') !== undefined) {
          commonStore.updateUserReferralCode(userStore.currentUser.sub, window.localStorage.getItem('ISSUER_REFERRAL_CODE')).then(() => {
            window.localStorage.removeItem('ISSUER_REFERRAL_CODE');
          });
        }
        if (window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE') && window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE') !== undefined) {
          window.localStorage.removeItem('SAASQUATCH_REFERRAL_CODE');
        }
        if (window.analytics) { // && false
          window.analytics.identify(userStore.currentUser.sub, {
            name: `${get(data, 'user.info.firstName')} ${get(data, 'user.info.lastName')}`,
            email: get(data, 'user.email.address'),
          }, {
            integrations: {
              Intercom: {
                user_hash: get(data, 'user.userHash'),
              },
            },
          });
        }
        res();
      });
      AWS.config.region = AWS_REGION;
      // Check if currentUser has admin role, if user has admin role set admin access to user
      if (userStore.isAdmin) {
        this.setAWSAdminAccess(user.signInUserSession.idToken.jwtToken);
      }
    }
  });

  /**
   * @desc Registers new user. Fetches required data from authStore.
   * @return null.
   */
  async register(isMobile = false) {
    client.clearStore();
    uiStore.reset();
    uiStore.setProgress();
    uiStore.setLoaderMessage('Signing you up');

    const { fields } = authStore.SIGNUP_FRM;
    const signupFields = authStore.CONFIRM_FRM.fields;
    const attributeList = {
      'custom:roles': JSON.stringify([fields.role.value]),
      given_name: fields.givenName.value,
      family_name: fields.familyName.value,
    };
    try {
      const user = await AmplifyAuth.signUp({
        username: (fields.email.value || signupFields.email.value).toLowerCase(),
        password: fields.password.value || signupFields.password.value,
        attributes: attributeList,
      });

      if (user && user.userConfirmed) {
        authStore.setUserId(user.userSub);
        const signUpRole = authStore.SIGNUP_FRM.fields.role.value;
        if (!isMobile) {
          if (signUpRole === 'investor') {
            Helper.toast('Thanks! You have successfully signed up on NextSeed.', 'success');
          } else if (signUpRole === 'issuer') {
            Helper.toast('Congrats, you have been PreQualified on NextSeed.', 'success');
          }
        }
        if (signUpRole === 'investor') {
          if (!userStore.currentUser) {
            const { email, password } = Validator.ExtractValues(authStore.CONFIRM_FRM.fields);
            try {
              const username = email.toLowerCase();
              const loginUserObj = await AmplifyAuth.signIn({ username, password });
              this.amplifyLogin(loginUserObj);
            } catch (err) {
              uiStore.setErrors(this.simpleErr(err));
              throw err;
            }
          }
        }
      }
    } catch (err) {
      uiStore.setErrors(this.simpleErr(err));
      throw err;
    } finally {
      uiStore.setProgress(false);
    }
  }

  /**
   * @desc Method is being called when user clicks on forgot password, which internally sends code
   *       required for changing password. On successfull completion user gets redirected to change
   *       password page.
   * @return null
   */
  async resetPassword() {
    uiStore.reset();
    uiStore.setProgress();
    const { email } = Validator.ExtractValues(authStore.FORGOT_PASS_FRM.fields);
    try {
      await AmplifyAuth.forgotPassword(email.toLowerCase());
    } catch (err) {
      if (get(err, 'code') === 'UserNotFoundException') {
        return true;
      }
      uiStore.setErrors(this.simpleErr(err));
      throw err;
    } finally {
      uiStore.setProgress(false);
      uiStore.clearLoaderMessage();
    }
    return true;
  }

  /**
   * @desc Method changes password after first login for new user created from admin panel
   * @return null
   */
  async setNewPassword() {
    uiStore.reset();
    uiStore.setProgress();
    const { code, email, password } = Validator.ExtractValues(authStore.RESET_PASS_FRM.fields);
    try {
      await AmplifyAuth.forgotPasswordSubmit(email.toLowerCase(), code, password);
      Helper.toast('Password changed successfully', 'success');
    } catch (err) {
      uiStore.setErrors(this.simpleErr(err));
      throw err;
    } finally {
      uiStore.setProgress(false);
      uiStore.clearLoaderMessage();
    }
  }

  async changeMyPassword() {
    uiStore.reset();
    uiStore.setProgress();
    try {
      const passData = mapValues(authStore.CHANGE_PASS_FRM.fields, f => f.value);
      const user = await AmplifyAuth.currentAuthenticatedUser();
      if (user) {
        await AmplifyAuth.changePassword(user, passData.oldPasswd, passData.newPasswd);
        Helper.toast('Password changed successfully', 'success');
      }
    } catch (err) {
      uiStore.setErrors(this.simpleErr(err));
      throw err;
    } finally {
      uiStore.setProgress(false);
      uiStore.clearLoaderMessage();
    }
    // return true;
  }

  /**
   * @desc This method use to reset password for users created by admin.
   */
  async updatePassword() {
    uiStore.reset();
    uiStore.setProgress();
    try {
      const loginData = mapValues(authStore.LOGIN_FRM.fields, f => f.value);
      const userEmail = userStore.getUserEmailAddress();
      const passData = mapValues(authStore.CHANGE_PASS_FRM.fields, f => f.value);
      const emailLowerCase = (loginData.email || userEmail).toLowerCase();

      const user = await AmplifyAuth.signIn({
        username: emailLowerCase,
        password: passData.oldPasswd,
      });
      if (user) {
        if (user) {
          try {
            await AmplifyAuth.completeNewPassword(user, passData.newPasswd);
            Helper.toast('Password changed successfully', 'success');
          } catch (error) {
            uiStore.setErrors(this.simpleErr(error));
            throw error;
          }
        }
      }
    } catch (err) {
      uiStore.setErrors(this.simpleErr(err));
      throw err;
    } finally {
      uiStore.setProgress(false);
      uiStore.clearLoaderMessage();
    }
  }

  segmentTrackLogout = (logoutType) => {
    if (window.analytics) {
      window.analytics.track('Logged Out', { logoutType });
      this.shutdownIntercom();
      window.analytics.reset();
    }
  }

  shutdownIntercom = () => {
    try {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
      console.log('Intercom Shutdown time:', new Date());
    } catch (e) {
      console.log(e);
    }
  }


  forceLogout = logoutType => (
    new Promise((res) => {
      this.resetData(logoutType);
      res();
    })
    // Clear all AWS credentials
  );

  resetData = (logoutType) => {
    client.clearStore();
    commonStore.setToken(undefined);
    localStorage.removeItem('lastActiveTime');
    localStorage.removeItem('defaultNavExpanded');
    window.sessionStorage.removeItem('AccountCipExp');
    window.sessionStorage.removeItem('cipErrorMessage');
    window.sessionStorage.removeItem('changedEmail');
    const uKey = get(userStore, 'currentUser.sub') || 'public';
    window.sessionStorage.removeItem(`${uKey}_pInfo`);
    authStore.setUserLoggedIn(false);
    userStore.forgetUser();
    this.segmentTrackLogout(logoutType);
    this.clearMobxStore();
  }

  /**
   * @desc Logs out user and clears all tokens stored in browser's local storage
   * @return null
   */
  logout = logoutType => (
    new Promise((res, rej) => {
      try {
        this.resetData(logoutType);
        AmplifyAuth.signOut();
        AWS.config.clear();
        res();
      } catch (err) {
        console.log('Error occured while logout====', err);
        rej();
      }
    })
  )

  clearMobxStore = () => {
    authStore.resetStoreData();
    accountStore.resetStoreData();
    identityStore.resetStoreData();
    investorProfileStore.resetAll();
    userDetailsStore.resetStoreData();
    iraAccountStore.resetStoreData();
    entityAccountStore.resetStoreData();
    bankAccountStore.resetStoreData();
    individualAccountStore.resetStoreData();
    portfolioStore.resetPortfolioData();
    userDetailsStore.setPartialInvestmenSession();
    investmentStore.resetData();
    investmentStore.resetAccTypeChanged();
    transactionStore.resetData();
    accreditationStore.resetUserAccreditatedStatus();
    uiStore.clearErrors();
    uiStore.clearRedirectURL();
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });

  /**
   * @desc Method replaces all snake case keys to camel case of data recieved from cognito
   * @param $data @type Object - Data with keys in snake case format
   * @return $newData @type Object - Data with keys in camel case format
   */
  mapCognitoToken = (data) => {
    const mappedUser = {};
    map(data, (obj, item) => {
      const key = camelCase(item.replace(/^custom:/, ''));
      if (key === 'userCapabilities') {
        mappedUser.capabilities = obj;
      } else {
        mappedUser[key] = obj;
      }
    }, {});
    return mappedUser;
  };

  /**
   * @desc Cognito stores role with key `custom:roles` while in app it is stored as `roles`. This
   *       method removes key `custom:roles` and adds `roles` as required by keeping all other data
   *       as it is.
   * @param $data @type Object - data that is recieved after login or verifying session
   * @return $newData @type Object - data in format needed by application.
   */
  adjustRoles = (data) => {
    const newData = {};
    map(data, (val, key) => { (newData[camelCase(key)] = val); });
    newData.roles = data['custom:roles'];
    newData.capabilities = data['custom:user_capabilities'] || data['custom:capabilities'] || null;
    delete newData.customRoles;
    delete newData.customCapabilities;
    return newData;
  };

  /**
   * @desc Roles recieved from cognito is array in string format. This method parse those roles.
   * @param $data @type Object - data that in key value format
   * @return $newData @type Object - Clean and parsed data
   */
  parseRoles = (data) => {
    const newData = data;
    newData.roles = (data.roles) ? JSON.parse(data.roles) : [];
    return newData;
  };
}

export default new Auth();
