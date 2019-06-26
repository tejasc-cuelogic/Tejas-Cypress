import { observable, action, computed, toJS } from 'mobx';
import { get } from 'lodash';
import graphql from 'mobx-apollo';
import { FormValidator as Validator } from '../../../helper';
import { GqlClient as clientPublic } from '../../../api/publicApi';
import { GqlClient as client } from '../../../api/gqlApi';
import { NEW_USER } from '../../../constants/user';
import { PRIVATE_NAV } from '../../../constants/NavigationMeta';
import { authStore } from '../index';
import { resetPasswordExpirationForCognitoUser, investorAccountDeleteProcess } from '../queries/users';

export class UserStore {
  @observable currentUser;

  @observable USR_FRM = Validator.prepareFormObject(NEW_USER);

  @observable opt = {};

  @observable deleteUserMeta = null;

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

  @computed get deleteUserLoading() {
    return this.deleteUserMeta && this.deleteUserMeta.loading;
  }

  @computed get getDeleteUserData() {
    return (this.deleteUserMeta && this.deleteUserMeta.data && toJS(this.deleteUserMeta.data.investorAccountDeleteProcess)) || null;
  }

  @computed get getDeleteUserMeta() {
    const deletedUserMeta = this.getDeleteUserData;
    const data = {
      message: 'Something went wrong please try again later.',
      validAgreement: false,
      totalBalance: '0',
      availableBalance: '0',
      isValidForDelete: false,
    };
    if (!get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'totalBalance') === 0) {
      data.message = 'Are you sure you want to delete your user account?';
      data.isValidForDelete = true;
    } else if (!get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'availableBalance') === 0 && get(deletedUserMeta, 'totalBalance') > 0) {
      data.message = 'There are pending transfer requests on your account.  You must wait for the transaction to post before you can delete your account.';
    } else if (!get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'availableBalance') > 0) {
      data.message = 'You currently have a $XXX,XXX.XX balance on your account.  You must initiate a withdraw and wait for the cash to post before you can delete your account.';
    } else if (get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'totalBalance') === 0) {
      data.message = 'You are unable to delete your account at this time.  Please contact support@nextseed.com if you have any additional questions';
    }
    return data;
  }

  @action
  getUserDeleteMeta = () => {
    this.deleteUserMeta = graphql({
      client,
      query: investorAccountDeleteProcess,
      fetchPolicy: 'network-only',
    });
  };
}

export default new UserStore();
