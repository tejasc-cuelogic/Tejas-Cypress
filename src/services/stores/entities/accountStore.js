import { observable, action, computed } from 'mobx';
import { find, get } from 'lodash';
import { FormValidator } from '../../../helper';
import { bankAccountStore, individualAccountStore, iraAccountStore, entityAccountStore, userDetailsStore } from '../index';
import Helper from '../../../helper/utility';


import {
  INVESTMENT_ACCOUNT_TYPES,
  ACC_TYPE,
} from '../../../constants/account';

export class AccountStore {
  @observable INVESTMENT_ACC_TYPES = FormValidator.prepareFormObject(ACC_TYPE);
  @observable ACC_TYPE_MAPPING = {
    0: {
      store: individualAccountStore,
      location: 1,
      accountId: individualAccountStore.individualAccId,
      name: 'individual',
    },
    1: {
      store: iraAccountStore, location: 3, accountId: iraAccountStore.iraAccountId, name: 'ira',
    },
    2: {
      store: entityAccountStore,
      location: 5,
      accountId: entityAccountStore.entityAccountId,
      name: 'entity',
    },
  };
  @action
  setInvestmentAccType = (e, result) => {
    this.INVESTMENT_ACC_TYPES = FormValidator.onChange(
      this.INVESTMENT_ACC_TYPES,
      FormValidator.pullValues(e, result),
    );
  }

  accountToastMessage = (currentStep, actionName, formName = 'formAddFunds') => {
    const { isValid, isDirty } = bankAccountStore[formName].meta;
    if (isValid && isDirty) {
      const actionPerformed = isValid ? 'submitted' : actionName;
      Helper.toast(`${(isValid && isDirty) ? 'Add Funds' : currentStep.name} ${actionPerformed} successfully.`, 'success');
    } else if (currentStep.name !== 'Link bank') {
      Helper.toast(`${currentStep.name} ${actionName} successfully.`, 'success');
    }
  }

  getAccountIdByType = () => {
    const accountValue = this.INVESTMENT_ACC_TYPES.fields.accType.value;
    const accountDetails = find(
      get(userDetailsStore, 'currentUser.data.user.roles'),
      { name: this.ACC_TYPE_MAPPING[accountValue].name },
    );
    return this.ACC_TYPE_MAPPING[accountValue].accountId ||
      get(accountDetails, 'details.accountId');
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
