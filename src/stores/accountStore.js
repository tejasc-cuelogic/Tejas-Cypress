import { observable, action, computed } from 'mobx';

import {
  INVESTMENT_ACCOUNT_TYPES,
  IRA_ACCOUNT_TYPES,
  FUNDING_OPTIONS,
  INDIVIDUAL_ACCOUNT_CREATION,
  IRA_ACCOUNT_CREATION,
} from '../constants/account';

export class AccountStore {
  @observable bankLinkInterface = 'list';

  @observable accountType = INVESTMENT_ACCOUNT_TYPES[0];

  @observable individualAccount = { ...INDIVIDUAL_ACCOUNT_CREATION }

  @observable iraAccount = { ...IRA_ACCOUNT_CREATION }

  @computed
  get routeOnInvestmentTypeSelection() {
    let routeForInvestTypeSelection = '';
    if (this.accountType === 'individual') {
      routeForInvestTypeSelection = `${this.accountType}/LinkBankAccount`;
    } else if (this.accountType === 'ira') {
      routeForInvestTypeSelection = `${this.accountType}/AccountCreation`;
    }
    return routeForInvestTypeSelection;
  }

  @action
  setAccountType(type) {
    this.accountType = INVESTMENT_ACCOUNT_TYPES[type];
  }

  @action
  setBankLinkInterface(mode) {
    this.bankLinkInterface = mode;
  }

  @action
  setIndividualAccountDetails(field, value) {
    this.individualAccount[field].value = value;
  }

  @action
  setIndividualAccountError(field, error) {
    this.individualAccount[field].error = error;
  }

  @action
  setIraAccountDetails(field, value) {
    this.iraAccount[field].value = value;
  }

  @action
  setIraAccountError(field, error) {
    this.iraAccount[field].error = error;
  }

  @action
  setIraAccountType(type) {
    this.setIraAccountDetails('accountType', IRA_ACCOUNT_TYPES[type]);
  }

  @action
  setIraFundingOption(option) {
    this.setIraAccountDetails('fundingOption', FUNDING_OPTIONS[option]);
  }
}

export default new AccountStore();
