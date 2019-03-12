/* eslint-disable no-unused-expressions */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import cookie from 'react-cookies';
import { mapValues, map, concat, isEmpty, difference, find, findKey, filter, isNull, lowerCase, get } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator } from '../../../../helper';
import { USER_PROFILE_FOR_ADMIN } from '../../../constants/user';
import {
  identityStore,
  accountStore,
  individualAccountStore,
  iraAccountStore,
  entityAccountStore,
  investorProfileStore,
  authStore,
  campaignStore,
} from '../../index';
import { userDetailsQuery, toggleUserAccount, skipAddressValidation, frozenEmailToAdmin } from '../../queries/users';
import { INVESTMENT_ACCOUNT_TYPES, INV_PROFILE } from '../../../../constants/account';
import Helper from '../../../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable currentActiveAccount = null;
  @observable isAddressSkip = false;
  @observable detailsOfUser = {};
  @observable editCard = 0;
  @observable deleting = 0;
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];
  @observable USER_BASIC = Validator.prepareFormObject(USER_PROFILE_FOR_ADMIN);
  @observable USER_INVESTOR_PROFILE = Validator.prepareFormObject(INV_PROFILE);
  @observable accountForWhichCipExpired = '';
  @observable partialInvestNowSessionURL = '';

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @computed get currentUserId() {
    return (this.userDetails && this.userDetails.id) || null;
  }

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    details.roles && details.roles.map((role, index) => {
      details.roles[index].name = lowerCase(role.name);
      return details;
    });
    return details;
  }

  @computed get getActiveAccounts() {
    let accDetails;
    if (this.userDetails) {
      accDetails = filter(this.userDetails.roles, account => account.name !== 'investor' && account.details && account.details.accountStatus === 'FULL');
    }
    return accDetails;
  }

  @computed get currentActiveAccountDetails() {
    const activeAccounts = this.getActiveAccounts;
    return find(activeAccounts, acc => acc.name === this.currentActiveAccount);
  }

  @action
  setProfilePhoto(url, name) {
    if (this.currentUser && this.currentUser.data.user.info.avatar) {
      this.currentUser.data.user.info.avatar.url = url;
    } else if (url && name) {
      this.currentUser.data.user.info.avatar = { name, url };
    }
  }

  @action
  setUserMfaMode(mfaMode) {
    if (this.currentUser) {
      this.currentUser.data.user.mfaMode = mfaMode;
    }
  }

  @computed get getUserMfaMode() {
    const mfaMode = (this.currentUser.data && this.currentUser.data.user &&
      toJS(this.currentUser.data.user.mfaMode)) || 'EMAIL';
    return mfaMode;
  }

  @action
  setEditCard = (cardIndex) => {
    this.editCard = cardIndex || 0;
  }

  @action
  save = () => {
    this.editCard = 0;
    Helper.toast('User details updated sucessfully', 'success');
  }

  @action
  setUserAccDetails = (investmentAccType) => {
    if (!isEmpty(this.userDetails)) {
      // bankAccountStore.resetLinkBank();
      if (investmentAccType === 'ira') {
        iraAccountStore.populateData(this.userDetails);
      } else if (investmentAccType === 'individual') {
        individualAccountStore.populateData(this.userDetails);
      } else if (investmentAccType === 'entity') {
        entityAccountStore.populateData(this.userDetails);
      }
      investorProfileStore.populateData(this.userDetails);
    }
  }

  @action
  setAddressCheck = () => {
    this.isAddressSkip = this.userDetails.skipAddressVerifyCheck || false;
  }

  @action
  toggleAddressVerification = () => {
    const payLoad = { userId: this.currentUserId, shouldSkip: !this.isAddressSkip };
    client
      .mutate({
        mutation: skipAddressValidation,
        variables: payLoad,
      })
      .then(action((res) => {
        this.isAddressSkip = res.data.skipAddressValidationCheck;
      }));
  }

  @action
  getUser = userId => new Promise((res) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      fetchPolicy: 'network-only',
      variables: { userId },
      onFetch: (result) => {
        if (!this.currentUser.loading) {
          identityStore.setProfileInfo(this.userDetails);
          accountStore.setInvestmentAccTypeValues(this.validAccTypes);
          res(result);
          const user = { ...this.currentUser };
          this.currentUser.data &&
            this.currentUser.data.user &&
            this.currentUser.data.user.roles &&
            this.currentUser.data.user.roles.map((role, index) => {
              this.currentUser.data.user.roles[index].name = lowerCase(role.name);
              return this.currentUser;
            });
          if (user && user.data && user.data.user && user.data.user.capabilities) {
            authStore.setCurrentUserCapabilites(user.data.user.capabilities);
          }
        }
      },
    });
  })

  @computed
  get isInvestorAccreditated() {
    let entityAccreditation = null;
    this.currentUser && this.currentUser.data
    && this.currentUser.data.user
    && this.currentUser.data.user.roles.map((role) => {
      if (role.name === 'entity') {
        entityAccreditation = get(role, 'details.accreditation.status') || null;
      }
      return null;
    });
    const accreditation = get(this.currentUser, 'data.user.accreditation.status');
    return (accreditation === 'CONFIRMED' || entityAccreditation === 'CONFIRMED');
  }

  @action
  getUserProfileDetails = (userId) => {
    this.detailsOfUser = graphql({
      client,
      query: userDetailsQuery,
      variables: { userId },
    });
  }

  @action
  updateUserStatus = (status) => {
    if (this.detailsOfUser.data.user.locked) {
      this.detailsOfUser.data.user.locked.lock = status;
    } else {
      this.detailsOfUser.data.user.locked = {
        lock: status,
      };
    }
  }

  @computed get isEntityTrust() {
    const Accdetails = this.currentUser.data.user.roles.find(obj => obj.name === 'entity');

    return (Accdetails && Accdetails.details && Accdetails.details.isTrust) || false;
  }

  @action
  toggleState = (id, accountStatus) => {
    const params = { accountStatus, id };
    client
      .mutate({
        mutation: toggleUserAccount,
        variables: params,
      })
      .then(() => {
        this.updateUserStatus(params.accountStatus);
        Helper.toast('User Account status updated successfully.', 'success');
      })
      .catch(() => Helper.toast('Error while updating user', 'warn'));
  }

  @computed get signupStatus() {
    const details = {
      idVerification: 'FAIL',
      roles: [],
      phoneVerification: 'FAIL',
      isMigratedUser: false,
      isMigratedFullAccount: false,
      isCipDoneForMigratedUser: false,
      isEmailConfirmed: false,
    };
    const validAccTypes = ['individual', 'ira', 'entity'];
    details.inActiveAccounts = [];
    const accTypes = [];
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails &&
        this.userDetails.legalDetails.status
      ) ? this.userDetails.legalDetails.status : 'FAIL';
      details.roles = mapValues(this.userDetails.roles, (a) => {
        const data =
        {
          accountId: a.accountId,
          name: a.name,
          status: a.details ? a.details.accountStatus : null,
        };
        return data;
      });
      Object.keys(details.roles).map((key) => {
        accTypes.push(details.roles[key].name);
        return true;
      });
      details.inActiveAccounts = difference(validAccTypes, accTypes);
      details.partialAccounts = map(filter(details.roles, a => a.status === 'PARTIAL'), 'name');
      details.activeAccounts = map(filter(details.roles, a => a.status === 'FULL'), 'name');
      details.frozenAccounts = map(filter(details.roles, a => a.status === 'FROZEN'), 'name');
      details.processingAccounts = map(filter(details.roles, a => (a.status ? a.status.endsWith('PROCESSING') : null)), 'name');
      details.inprogressAccounts = map(filter(details.roles, a => a.name !== 'investor' && a.status !== 'FULL'), 'name');
      details.phoneVerification = (this.userDetails.phone &&
        this.userDetails.phone.number &&
        !isNull(this.userDetails.phone.verified)) ? 'DONE' : 'FAIL';
      details.isMigratedUser =
        (this.userDetails.status && this.userDetails.status.startsWith('MIGRATION'));
      details.isMigratedFullAccount =
        (this.userDetails.status && this.userDetails.status.startsWith('MIGRATION') &&
          this.userDetails.status === 'MIGRATION_FULL');
      details.investorProfileCompleted =
        this.userDetails.investorProfileData === null ?
          false : this.userDetails.investorProfileData ?
            !this.userDetails.investorProfileData.isPartialProfile : false;
      details.isCipDoneForMigratedUser =
        this.userDetails.cip && this.userDetails.cip.requestId !== null;
      details.isEmailConfirmed = this.userDetails.email && this.userDetails.email.verified
        && this.userDetails.email.verified !== null;
      details.finalStatus = (details.activeAccounts.length > 2 &&
        this.validAccStatus.includes(details.idVerification) &&
        details.phoneVerification === 'DONE');

      return details;
    }
    return details;
  }

  getStepStatus = (step) => {
    const statusDetails = this.signupStatus;
    let status = '';
    if (statusDetails[step]) {
      if (step === 'idVerification') {
        if (this.validAccStatus.includes(statusDetails[step]) && statusDetails.phoneVerification === 'DONE') {
          status = 'done';
        } else {
          status = 'enable';
        }
      } else if (step === 'accounts') {
        if (this.validAccStatus.includes(statusDetails.idVerification)) {
          if (statusDetails.phoneVerification === 'DONE') {
            if (!isEmpty(statusDetails.roles)) {
              status = 'done';
            } else {
              status = 'enable';
            }
          } else {
            status = 'disable';
          }
        } else {
          status = 'disable';
        }
      }
    }
    return status;
  }

  @computed get isUserVerified() {
    const accDetails = this.signupStatus;
    return this.validAccStatus.includes(accDetails.idVerification);
  }

  @action
  setDelStatus = (status) => {
    this.deleting = status;
  }

  @computed
  get pendingStep() {
    let routingUrl = '/app/summary';
    if (this.signupStatus.isMigratedUser) {
      if (this.userDetails.email &&
        (!this.userDetails.email.verified || this.userDetails.email.verified === null)) {
        this.setSignUpDataForMigratedUser(this.userDetails);
        routingUrl = '/auth/confirm-email';
      } else if (this.signupStatus.isMigratedFullAccount &&
        (this.userDetails && this.userDetails.cip && this.userDetails.cip.requestId !== null)) {
        if (this.signupStatus.phoneVerification !== 'DONE') {
          routingUrl = '/app/summary/identity-verification/3';
        } else if (!this.signupStatus.investorProfileCompleted) {
          routingUrl = '/app/summary/establish-profile';
        }
      } else {
        routingUrl = '/app/summary/identity-verification/0';
      }
    } else if (!this.validAccStatus.includes(this.signupStatus.idVerification) &&
      this.signupStatus.activeAccounts.length === 0) {
      routingUrl = '/app/summary/identity-verification/0';
    } else if (this.signupStatus.phoneVerification !== 'DONE') {
      routingUrl = '/app/summary/identity-verification/3';
    } else if (!this.signupStatus.investorProfileCompleted) {
      routingUrl = '/app/summary/establish-profile';
    } else if (isEmpty(this.signupStatus.roles)) {
      routingUrl = '/app/summary/account-creation';
    } else if (!this.signupStatus.activeAccounts.length &&
      this.signupStatus.partialAccounts.length > 0) {
      // const accValue =
      //   findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      // accountStore.setAccTypeChange(accValue);
      routingUrl = `/app/summary/account-creation/${this.signupStatus.partialAccounts[0]}`;
    } else if (!this.signupStatus.activeAccounts.length &&
      this.signupStatus.inActiveAccounts.length > 0) {
      // const accValue =
      //   findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      // accountStore.setAccTypeChange(accValue);
      routingUrl = `/app/summary/account-creation/${this.signupStatus.inActiveAccounts[0]}`;
    } else {
      routingUrl = '/app/summary';
    }
    return routingUrl;
  }

  @computed
  get validAccTypes() {
    const validPanes = [];
    const { inActiveAccounts, partialAccounts } = this.signupStatus;
    const remainingAccounts = concat(partialAccounts, inActiveAccounts);
    const accTypesValues = accountStore.INVESTMENT_ACC_TYPES.fields.accType.values;
    remainingAccounts.map((key) => {
      const acc = find(accTypesValues, { accType: key });
      if (acc) {
        validPanes.push(acc);
      }
      return validPanes;
    });
    return validPanes;
  }

  @action
  setFormData = (form, ref, keepAtLeastOne) => {
    const details = toJS({ ...this.detailsOfUser.data.user });
    if (!details) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], details, ref, keepAtLeastOne);
    if (form === 'USER_INVESTOR_PROFILE') {
      if (details.investorProfileData && details.investorProfileData.annualIncome) {
        ['annualIncomeCurrentYear'].map((item, index) => {
          this.USER_INVESTOR_PROFILE.fields[item].value =
            details.investorProfileData.annualIncome[index].income;
          return true;
        });
      }
    }
    return false;
  }

  @action
  formChange = (e, result, form) => {
    if (result && (result.type === 'checkbox')) {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        '',
        true,
        { value: result.checked },
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }
  }

  @action
  resetStoreData = () => {
    this.currentUser = {};
  }

  @computed get isCipExpired() {
    if (this.userDetails && this.userDetails.cip) {
      const { expiration } = this.userDetails.cip;
      const expirationDate = new Date(expiration);
      const currentDate = new Date();
      if (expirationDate < currentDate) {
        return true;
      }
    }
    return false;
  }

  @action
  setAccountForWhichCipExpired = (accountName) => {
    this.accountForWhichCipExpired = accountName;
  }

  @computed get isBasicVerDoneForMigratedFullUser() {
    if (this.signupStatus.phoneVerification === 'DONE' &&
      this.signupStatus.isEmailConfirmed &&
      this.signupStatus.isCipDoneForMigratedUser) {
      return true;
    }
    return false;
  }

  @action
  setSignUpDataForMigratedUser = (userDetails) => {
    if (userDetails.info) {
      authStore.SIGNUP_FRM.fields.givenName.value = userDetails.info.firstName;
      authStore.SIGNUP_FRM.fields.role.value = 'investor';
      authStore.SIGNUP_FRM.fields.familyName.value = userDetails.info.lastName;
    }
  }

  @action setPartialInvestmenSession = (redirectURL = '') => {
    this.partialInvestNowSessionURL = redirectURL;
  }
  @action sendAdminEmailOfFrozenAccount = (activity) => {
    const selectedAccount = this.currentActiveAccountDetails;
    const forzenAccountId =
      selectedAccount && selectedAccount.details && selectedAccount.details.accountId ? selectedAccount.details.accountId : '537fd0c0-1fc3-11e9-9cfb-1b268dcc26c4';
    const payLoad = { userId: this.currentUserId, accountId: forzenAccountId, activity };
    client
      .mutate({
        mutation: frozenEmailToAdmin,
        variables: payLoad,
      })
      .then((res) => {
        if (res.data.notifyAdminFrozenAccountActivity) {
          const offeringId = campaignStore.campaign && campaignStore.campaign.id;
          const offeringDetailObj = { offeringId, isEmailSent: true };
          cookie.save('ADMIN_FROZEN_EMAIL', offeringDetailObj, { maxAge: 3600 });
        }
      });
  }
  @computed
  get pendingStepForPartialAndProcessingAccount() {
    let routingUrl = '/app/summary';
    if (this.signupStatus.partialAccounts.length > 0) {
      const accValue =
        findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `/app/summary/account-creation/${this.signupStatus.partialAccounts[0]}`;
    } else if (this.signupStatus.inActiveAccounts.length > 0) {
      const accValue =
        findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `/app/summary/account-creation/${this.signupStatus.inActiveAccounts[0]}`;
    } else {
      routingUrl = '/app/summary';
    }
    return routingUrl;
  }

  @computed
  get getAnalyticsUserId() {
    return this.userDetails ?
      (get(this.userDetails, 'wpUserId') || get(this.userDetails, 'id')) : false;
  }
}

export default new UserDetailsStore();
