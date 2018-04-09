import { observable, action } from 'mobx';

import { INDIVIDUAL_ACCOUNT_CREATION } from '../constants/account';

export class AccountStore {
  accountTypes = {
    0: 'individual',
    1: 'entity',
    2: 'ira',
  }

  @observable bankLinkInterface = 'list';

  @observable accountType = this.accountTypes[0];

  @observable individualAccount = { ...INDIVIDUAL_ACCOUNT_CREATION }

  @action
  setAccountType(type) {
    this.accountType = this.accountTypes[type];
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
}

export default new AccountStore();
