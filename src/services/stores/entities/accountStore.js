import { observable, action, computed } from 'mobx';
import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
} from '../../../constants/account';

export class AccountStore {
  @observable accountType = {
    activeIndex: 0,
    type: INVESTMENT_ACCOUNT_TYPES[0],
  }

  @observable
  nsAccId = '';

  @observable
  investmentAccTypes = {
    fields: { ...ACC_TYPE },
  };

  @action
  setInvestmentAccType = (accType) => {
    this.investmentAccTypes.fields.accType.value = accType;
  }

  @action
  setInvestmentAccTypeValues = (values) => {
    this.investmentAccTypes.fields.accType.values = values;
  }

  @computed
  get investmentAccType() {
    const type = this.investmentAccTypes.fields.accType.value;
    return INVESTMENT_ACCOUNT_TYPES[type];
  }

  @observable
  accountTypeCreated = undefined;

  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @action
  setAccountTypeCreated = (accountType) => {
    this.accountTypeCreated = accountType;
  }

  @action
  setAccountError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @action
  setNsAccId = (nsAccId) => {
    this.nsAccId = nsAccId;
  }

  @computed
  get routeOnInvestmentTypeSelection() {
    return `${this.investmentAccType}/AccountCreation`;
  }

  @action
  setAccountType(type) {
    this.accountType.activeIndex = type;
    this.accountType.type = INVESTMENT_ACCOUNT_TYPES[type];
  }

  /* eslint-disable class-methods-use-this */
  getAccountTypeIndex(accType) {
    let type = 0;
    if (accType === 'individual') {
      type = 0;
    } else if (accType === 'ira') {
      type = 1;
    } else if (accType === 'entity') {
      type = 2;
    }
    return type;
  }
}
export default new AccountStore();
