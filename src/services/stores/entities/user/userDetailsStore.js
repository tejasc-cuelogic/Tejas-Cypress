import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import { isEmpty, difference, find, findKey, filter, isNull } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import {
  identityStore,
  accountStore,
  bankAccountStore,
  individualAccountStore,
  iraAccountStore,
  entityAccountStore,
  investorProfileStore,
} from '../../index';
import { userDetailsQuery, toggleUserAccount } from '../../queries/users';
import {
  INVESTMENT_ACCOUNT_TYPES,
} from '../../../../constants/account';
import Helper from '../../../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable detailsOfUser = {};
  @observable editCard = 0;
  @observable deleting = 0;
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
  }

  @computed get getActiveAccounts() {
    let accDetails;
    if (this.userDetails) {
      accDetails = filter(this.userDetails.roles, account => account.details.status === 'FULL');
    }
    return accDetails;
  }

  @action
  setProfilePhoto(url) {
    if (this.currentUser) {
      this.currentUser.data.user.avatar.url = url;
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
      toJS(this.currentUser.data.user.mfaMode)) || null;
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
      bankAccountStore.resetLinkBank();
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
  getUser = userId => new Promise((res) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      fetchPolicy: 'network-only',
      variables: { userId },
      onFetch: () => {
        identityStore.setProfileInfo(this.userDetails);
        res();
      },
    });
  })

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
    this.detailsOfUser.data.user.accountStatus = status;
  }

  @action
  toggleState = () => {
    const { accountStatus, id } = this.currentUser.data.user;
    const params = { status: accountStatus === 'LOCK' ? 'UNLOCKED' : 'LOCK', id };
    client
      .mutate({
        mutation: toggleUserAccount,
        variables: params,
      })
      .then(() => this.updateUserStatus(params.status))
      .catch(() => Helper.toast('Error while updating user', 'warn'));
  }

  @computed get signupStatus() {
    const details = { idVerification: 'FAIL', roles: [], phoneVerification: 'FAIL' };
    const validAccTypes = ['individual', 'ira', 'entity'];
    details.inActiveAccounts = [];
    const accTypes = [];
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails &&
        this.userDetails.legalDetails.status
      ) ? this.userDetails.legalDetails.status : 'FAIL';
      details.roles = mapValues(this.userDetails.roles, (a) => {
        const data = { accountId: a.accountId, name: a.name, status: a.details.status };
        return data;
      });
      Object.keys(details.roles).map((key) => {
        accTypes.push(details.roles[key].name);
        return true;
      });
      details.inActiveAccounts = difference(validAccTypes, accTypes);
      details.partialAccounts = map(filter(details.roles, a => a.status === 'PARTIAL'), 'name');
      details.activeAccounts = map(filter(details.roles, a => a.status === 'FULL'), 'name');
      details.phoneVerification = (this.userDetails.phone &&
        this.userDetails.phone.number &&
        !isNull(this.userDetails.phone.verified)) ? 'DONE' : 'FAIL';
      details.investorProfileCompleted =
      this.userDetails.investorProfileData === null ?
        false : this.userDetails.investorProfileData ?
          !this.userDetails.investorProfileData.isPartialProfile : false;
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
    let routingUrl = '';
    if (!this.validAccStatus.includes(this.signupStatus.idVerification)) {
      routingUrl = 'summary/identity-verification/0';
    } else if (this.signupStatus.phoneVerification !== 'DONE') {
      routingUrl = 'summary/identity-verification/3';
    } else if (!this.signupStatus.investorProfileCompleted) {
      routingUrl = 'summary/establish-profile';
    } else if (isEmpty(this.signupStatus.roles)) {
      routingUrl = 'summary/account-creation';
    } else if (this.signupStatus.partialAccounts.length > 0) {
      const accValue =
      findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `summary/account-creation/${this.signupStatus.partialAccounts[0]}`;
    } else if (this.signupStatus.inActiveAccounts.length > 0) {
      const accValue =
      findKey(INVESTMENT_ACCOUNT_TYPES, val => val === this.signupStatus.partialAccounts[0]);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `summary/account-creation/${this.signupStatus.inActiveAccounts[0]}`;
    } else {
      routingUrl = 'summary';
    }
    return routingUrl;
  }

  @computed
  get validAccTypes() {
    const validPanes = [];
    const { inActiveAccounts } = this.signupStatus;
    const accTypesValues = accountStore.INVESTMENT_ACC_TYPES.fields.accType.values;
    inActiveAccounts.map((key) => {
      const acc = find(accTypesValues, { accType: key });
      if (acc) {
        validPanes.push(acc);
      }
      return validPanes;
    });
    return validPanes;
  }
}

export default new UserDetailsStore();
