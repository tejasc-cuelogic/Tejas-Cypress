import { observable, action, computed, toJS } from 'mobx';
import { FormValidator as Validator } from '../../../helper';
import { GqlClient as clientPublic } from '../../../api/publicApi';
import { NEW_USER } from '../../../constants/user';
import { PRIVATE_NAV } from '../../../constants/NavigationMeta';
import { authStore } from '../index';
import { resetPasswordExpirationForCognitoUser } from '../queries/users';

export class UserStore {
  @observable currentUser;

  @observable USR_FRM = Validator.prepareFormObject(NEW_USER);

  @observable opt = {};

  @action
  userEleChange = (e, res, type) => {
    this.USR_FRM = Validator.onChange(this.USR_FRM, Validator.pullValues(e, res), type);
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

  @action resetPasswordExpirationForCognitoUser = emailAddress => new Promise((resolve) => {
    clientPublic
      .mutate({
        mutation: resetPasswordExpirationForCognitoUser,
        variables: {
          emailAddress,
        },
      })
      .then((res) => {
        resolve(res);
      });
  });

  @computed get capabilitiesMeta() {
    console.log(this.opt);
    const prepareOpt = (meta, tail) => {
      const opt = { key: `${meta}_${tail}`, value: `${meta}_${tail}`, text: `${meta}_${tail}` };
      return opt;
    };
    let capabilities = [];
    const primaryCapabilities = [];
    PRIVATE_NAV.forEach((n) => {
      if (n.capability && !primaryCapabilities.includes(n.capability)) {
        primaryCapabilities.push(n.capability);
      }
      if (n.subNavigations) {
        n.subNavigations.forEach((c) => {
          if (c.capability && !primaryCapabilities.includes(c.capability)) {
            primaryCapabilities.push(c.capability);
          }
        });
      }
    });
    primaryCapabilities.forEach((c) => {
      if (c) {
        const meta = c.replace('_ANY', '');
        capabilities = [
          ...capabilities,
          ...[prepareOpt(meta, 'FULL'), prepareOpt(meta, 'MANAGER'), prepareOpt(meta, 'SUPPORT')],
        ];
      }
    });
    return [...new Set(capabilities)];
  }

  @computed get myCapabilities() {
    console.log(this.opt);
    return authStore.capabilities ? toJS(authStore.capabilities) : [];
  }

  myAccessForModule(module) {
    return this.myCapabilities.includes(`${module}_FULL`)
      ? { asManager: true, level: 'FULL' } : (
        this.myCapabilities.includes(`${module}_MANAGER`)
          ? { asManager: true, level: 'MANAGER' } : (
            this.myCapabilities.includes(`${module}_SUPPORT`)
              ? { asSupport: true, level: 'SUPPORT' } : {}
          )
      );
  }

  @computed get isApplicationManager() {
    return this.myCapabilities.includes('APPLICATIONS_FULL') || this.myCapabilities.includes('APPLICATIONS_MANAGER');
  }

  @computed get isInvestor() {
    const roles = (this.currentUser && toJS(this.currentUser.roles)) || [];
    return roles.includes('investor');
  }

  @computed get isIssuer() {
    const roles = (this.currentUser && toJS(this.currentUser.roles)) || [];
    return roles.includes('issuer');
  }

  @computed get isAdmin() {
    const roles = (this.currentUser && toJS(this.currentUser.roles)) || [];
    return roles.includes('admin');
  }

  getUserEmailAddress() {
    const emailDetails = (this.currentUser && toJS(this.currentUser.email)) || null;
    return emailDetails;
  }

  getUserId() {
    return (this.currentUser && toJS(this.currentUser.sub)) || null;
  }
}

export default new UserStore();
