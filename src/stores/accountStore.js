import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import {
  INVESTMENT_ACCOUNT_TYPES,
  IRA_ACCOUNT_TYPES,
  FUNDING_OPTIONS,
  INDIVIDUAL_ACCOUNT_CREATION,
  IRA_ACCOUNT_CREATION,
  IS_ENTITY_TRUST,
  ENTITY_ACCOUNT_CREATION,
} from '../constants/account';

export class AccountStore {
  @observable bankLinkInterface = 'list';

  @observable accountType = {
    activeIndex: 0,
    type: INVESTMENT_ACCOUNT_TYPES[0],
  }

  @observable individualAccount = { ...INDIVIDUAL_ACCOUNT_CREATION }

  @observable iraAccount = { ...IRA_ACCOUNT_CREATION }

  @observable entityAccount = { ...ENTITY_ACCOUNT_CREATION }

  @computed
  get routeOnInvestmentTypeSelection() {
    return `${this.accountType.type}/AccountCreation`;
  }

  @action
  setAccountType(type) {
    this.accountType.activeIndex = type;
    this.accountType.type = INVESTMENT_ACCOUNT_TYPES[type];
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
    const field = 'accountType';
    const value = {
      activeIndex: type,
      type: IRA_ACCOUNT_TYPES[type],
    };
    this.setIraAccountDetails(field, value);
  }

  @action
  setIraFundingOption(option) {
    const field = 'fundingOption';
    const value = {
      activeIndex: option,
      type: FUNDING_OPTIONS[option],
    };
    this.setIraAccountDetails(field, value);
  }

  @computed
  get isValidIraFinancialInformation() {
    return _.isEmpty(this.iraAccount.networth.error) &&
    _.isEmpty(this.iraAccount.annualIncome.error);
  }

  @action
  setEntityAccountDetails(field, value) {
    this.entityAccount[field].value = value;
  }

  @action
  setEntityAccountError(field, error) {
    this.entityAccount[field].error = error;
  }

  @action
  setIsEntityTrust(option) {
    const field = 'isEntityTrust';
    const value = {
      activeIndex: option,
      type: IS_ENTITY_TRUST[option],
    };
    this.setEntityAccountDetails(field, value);
  }

  @computed
  get fullAddress() {
    /**
     * @todo Push all values in array and use join for display.
     */
    let address = '';
    if (this.entityAccount.street.value !== '') {
      address = this.entityAccount.street.value;
    }
    if (this.entityAccount.city.value !== '') {
      address += this.entityAccount.street.value !== '' ? `, ${this.entityAccount.city.value}` : this.entityAccount.city.value;
    }
    if (this.entityAccount.state.value !== '') {
      address += this.entityAccount.city.value !== '' ? `, ${this.entityAccount.state.value}` : this.entityAccount.state.value;
    }
    if (this.entityAccount.zipCode.value !== '') {
      address += this.entityAccount.state.value !== '' ? `, ${this.entityAccount.zipCode.value}` : this.entityAccount.zipCode.value;
    }
    return address;
  }
}
export default new AccountStore();
