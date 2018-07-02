import { observable, action, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
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
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formAddFunds';
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].error = validation.errors.first(field);
      }
    }
  };

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

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new AccountStore();
