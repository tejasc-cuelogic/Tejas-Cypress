import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import {
  IND_ADD_FUND,
  IND_BANK_ACC_SEARCH,
} from '../../constants/account';

class IndividualAccountStore {
  @observable
  formAddFund = {
    fields: { ...IND_ADD_FUND }, meta: { isValid: true, error: '' },
  };

  @observable
  formBankSearch = {
    fields: { ...IND_BANK_ACC_SEARCH }, meta: { isValid: true, error: '' },
  };

  @action
  addFundChange = (e, { name, value }) => {
    this.onFieldChange('formAddFund', name, value);
  };

  @action
  bankSearchChange = (e, { name, value }) => {
    this.onFieldChange('formBankSearch', name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formAddFund';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };
}
export default new IndividualAccountStore();
