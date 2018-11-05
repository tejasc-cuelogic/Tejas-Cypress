import { observable, action, computed } from 'mobx';
import { FormValidator } from '../../../helper';
import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
} from '../../../constants/account';

export class AccountStore {
  @observable INVESTMENT_ACC_TYPES = FormValidator.prepareFormObject(ACC_TYPE);

  @action
  setInvestmentAccType = (e, result) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  setAccTypeChange = (value) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
      { name: 'accType', value },
    );
  }

  @action
  setInvestmentAccTypeValues = (values) => {
    this.INVESTMENT_ACC_TYPES.fields.accType.values = values;
  }

  @computed
  get investmentAccType() {
    const type = this.INVESTMENT_ACC_TYPES.fields.accType.value;
    return INVESTMENT_ACCOUNT_TYPES[type];
  }

  @action
  resetStoreData = () => {
    this.INVESTMENT_ACC_TYPES.fields.accType.values = ACC_TYPE.accType.values;
    this.INVESTMENT_ACC_TYPES.fields.accType.value = 0;
  }
}
export default new AccountStore();
