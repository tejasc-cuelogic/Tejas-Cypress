import { observable, action } from 'mobx';

export class AccountStore {
  accountTypes = {
    0: 'individual',
    1: 'entity',
    2: 'ira',
  }

  @observable accountType = this.accountTypes[0];

  @action
  setAccountType(type) {
    this.accountType = this.accountTypes[type];
    console.log(this.accountType);
  }
}

export default new AccountStore();
