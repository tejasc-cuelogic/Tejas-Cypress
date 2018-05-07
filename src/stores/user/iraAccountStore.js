import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

import {
  IRA_FIN_INFO,
  IRA_ACC_TYPES,
  IRA_FUNDING,
  IRA_IDENTITY,
} from '../../constants/account';

class IraAccountStore {
  @observable
  formFinInfo = {
    fields: { ...IRA_FIN_INFO }, meta: { isValid: true, error: '' },
  };

  @observable
  formAccTypes = {
    fields: { ...IRA_ACC_TYPES }, meta: { isValid: true, error: '' },
  };

  @observable
  formFunding = {
    fields: { ...IRA_FUNDING }, meta: { isValid: true, error: '' },
  };

  @observable
  formIdentity = {
    fields: { ...IRA_IDENTITY }, meta: { isValid: true, error: '' },
  }

  @action
  fundingChange = (e, { name, value }) => {
    this.onFieldChange('formFunding', name, value);
  };

  @action
  finInfoChange = (e, { name, value }) => {
    this.onFieldChange('formFinInfo', name, value);
  };

  @action
  AccTypesChange = (e, { name, value }) => {
    this.onFieldChange('formAccTypes', name, value);
  };

  @action
  identityChange = (name, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.onFieldChange('formIdentity', name, uploadedFile);
    }
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
