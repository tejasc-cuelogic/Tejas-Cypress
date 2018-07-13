import { observable, action, computed } from 'mobx';
import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
} from '../../../constants/account';

export class AccountStore {
  @observable investmentAccTypes = { fields: { ...ACC_TYPE } };

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
}
export default new AccountStore();
