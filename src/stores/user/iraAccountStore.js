import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

import {
  IRA_FIN_INFO,
} from '../../constants/account';

class IraAccountStore {
  @observable
  formFinInfo = {
    fields: { ...IRA_FIN_INFO }, meta: { isValid: true, error: '' },
  };

  @action
  finInfoChange = (e, { name, value }) => {
    this.onFieldChange('formFinInfo', name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };
}

export default new IraAccountStore();
