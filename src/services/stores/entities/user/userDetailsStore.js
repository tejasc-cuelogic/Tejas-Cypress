import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { isEmpty, difference, find, findKey } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as client2 } from '../../../../api/gcoolApi';
import {
  uiStore,
  identityStore,
  accountStore,
  bankAccountStore,
  individualAccountStore,
  iraAccountStore,
  entityAccountStore,
  investorProfileStore,
} from '../../index';
import { FIN_INFO } from '../../../../constants/user';
import { userDetailsQuery, toggleUserAccount } from '../../queries/users';
import { finLimit, updateFinLimit } from '../../queries/financialLimits';
import {
  INVESTMENT_ACCOUNT_TYPES,
} from '../../../../constants/account';
import { FormValidator } from '../../../../helper';
import Helper from '../../../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable detailsOfUser = {};
  @observable financialLimit = {};
  @observable editCard = 0;
  @observable deleting = 0;
  @observable FIN_INFO = { fields: { ...FIN_INFO }, meta: { isValid: false, error: '' } };
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
  }

  @action
  setProfilePhoto(url) {
    if (this.currentUser) {
      this.currentUser.data.user.avatar.url = url;
    }
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
  getUser = id => new Promise((res) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      fetchPolicy: 'network-only',
      variables: { id },
      onFetch: () => {
        identityStore.setProfileInfo(this.userDetails);
        res();
      },
    });
  })

  @action
  getUserProfileDetails = (id) => {
    this.detailsOfUser = graphql({
      client,
      query: userDetailsQuery,
      variables: { id },
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

  @computed get fLoading() {
    return this.financialLimit.loading;
  }

  @computed get signupStatus() {
    const details = { idVerification: 'FAIL', accounts: [], phoneVerification: 'FAIL' };
    const validAccTypes = ['individual', 'ira', 'entity'];
    details.inActiveAccounts = [];
    const accTypes = [];
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails &&
        this.userDetails.legalDetails.cipStatus && this.userDetails.legalDetails.cipStatus.status
      ) ? this.userDetails.legalDetails.cipStatus.status : 'FAIL';
      details.accounts = mapValues(this.userDetails.accounts, (a) => {
        const data = { accountId: a.accountId, accountType: a.accountType, status: a.status };
        return data;
      });
      Object.keys(details.accounts).map((key) => {
        accTypes.push(details.accounts[key].accountType);
        return true;
      });
      details.inActiveAccounts = difference(validAccTypes, accTypes);
      details.partialAccounts = map(filter(details.accounts, a => a.status === 'PARTIAL'), 'accountType');
      details.activeAccounts = map(filter(details.accounts, a => a.status === 'FULL'), 'accountType');
      details.phoneVerification = (this.userDetails.contactDetails &&
        this.userDetails.contactDetails.phone &&
        this.userDetails.contactDetails.phone.verificationDate) ? 'DONE' : 'FAIL';
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
            if (!isEmpty(statusDetails.accounts)) {
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

  /*
  Financial Limits
  */
  @action
  getFinancialLimit = () => {
    this.financialLimit = graphql({
      client: client2,
      query: finLimit,
      onFetch: (data) => {
        Object.keys(this.FIN_INFO.fields).map((f) => {
          this.FIN_INFO.fields[f].value = data.FinancialLimits[f];
          return this.FIN_INFO.fields[f];
        });
        FormValidator.onChange(this.FIN_INFO);
      },
    });
  }

  @action
  updateFinInfo = () => {
    const data = mapValues(this.FIN_INFO.fields, f => parseInt(f.value, 10));
    const currentLimit = Helper.getInvestmentLimit(data);
    uiStore.setProgress();
    client2
      .mutate({
        mutation: updateFinLimit,
        variables: {
          annualIncome: data.annualIncome,
          netWorth: data.netWorth,
          otherInvestments: data.otherInvestments,
          currentLimit,
        },
      })
      .then(() => Helper.toast('Updated Financial Info!', 'success'))
      .catch(error => Helper.toast(`Error while updating Financial Info- ${error}`, 'warn'))
      .finally(() => uiStore.setProgress(false));
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
    } else if (isEmpty(this.signupStatus.accounts)) {
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
