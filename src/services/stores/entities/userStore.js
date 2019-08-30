/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { observable, action, computed, toJS } from 'mobx';
import { get, uniqBy } from 'lodash';
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

  @observable deleteUser = false;

  @observable cancelDeleteUser = false;

  @observable confirmDelete = false;

  @action
  userEleChange = (e, res, type, isDeleteUser) => {
    this.USR_FRM = Validator.onChange(this.USR_FRM, Validator.pullValues(e, res), type);
    if (isDeleteUser) {
      this.deleteUser = this.currentUser.email === this.USR_FRM.fields.email.value;
    }
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
        const meta = c.includes('_ANY') ? c.replace('_ANY', '') : c.includes('_FULL') ? c.replace('_FULL', '') : c.includes('_MANAGER') ? c.replace('_MANAGER', '') : c.replace('_SUPPORT', '');
        capabilities = [
          ...capabilities,
          ...[prepareOpt(meta, 'FULL'), prepareOpt(meta, 'MANAGER'), prepareOpt(meta, 'SUPPORT')],
        ];
      }
    });
    return [...new Set(uniqBy(capabilities, 'key'))];
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
    const commonMsg = (<p className="mb-20">You are unable to delete your account at this time.  Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a> if you have any additional questions</p>);
    const data = {
      header: 'Delete User Account',
      message: commonMsg,
      isValidForDelete: false,
      isCancelDelete: this.cancelDeleteUser,
    };

    if (this.cancelDeleteUser) {
      data.header = 'Great!';
      data.message = (<p className="mb-20">We're so glad you've decided to keep your NextSeed account. If you need any further assistance or wish to contact the NextSeed team, please reach out to us at <a href="mailto:support@nextseed.com">support@nextseed.com</a>.</p>);
      data.isValidForDelete = false;
      data.isCancelDelete = true;
      return data;
    }

    if (this.confirmDelete) {
      data.header = 'Your account has been deleted';
      data.message = (<p className="mb-20">Thank you for being a part of the NextSeed community. <br /> If you change your mind, we'd love to have you back! <br /><br /> Please let us know if we can be of any help by contacting <br /> <a href="mailto:support@nextseed.com">support@nextseed.com</a>.</p>);
      data.isValidForDelete = false;
      data.isCancelDelete = false;
      return data;
    }

    if (!get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'availableBalance') > 0) {
      data.header = 'You currently have funds remaining in your account';
      data.message = (<p className="mb-20">In order to delete your account, please withdraw all funds and allow 5-7 business days to clear prior to deleting your account. If you have any questions or need assistance, please email us at <a href="mailto:support@nextseed.com">support@nextseed.com</a>.</p>);
      data.isCancelDelete = false;
    } if (!get(deletedUserMeta, 'validAgreement') && get(deletedUserMeta, 'availableBalance') <= 0 && get(deletedUserMeta, 'totalBalance') === 0) {
      data.header = 'Are you sure?';
      data.message = (<p className="mb-20">We hate to see you go, but if you would like to delete your NextSeed account please confirm your intent by entering the email address associated with your account.<br /><br /> Please note that any promotional credits you may have <br /> accumulated in your account will be forfeited.</p>);
      data.isValidForDelete = true;
      data.isCancelDelete = false;
    } else if (get(deletedUserMeta, 'validAgreement')) {
      data.header = 'You currently have active investments in your account';
      data.message = (<p className="mb-20">Because you have active investments in your account, we are unable to delete your account at this time. If you wish to learn more about the options available to you, please email us at <a href="mailto:support@nextseed.com">support@nextseed.com</a>.</p>);
      data.isCancelDelete = false;
      data.isValidForDelete = false;
    }
    return data;
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  handleCancelDeleteUser = (isCancelDelete = false) => {
    this.cancelDeleteUser = isCancelDelete;
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
