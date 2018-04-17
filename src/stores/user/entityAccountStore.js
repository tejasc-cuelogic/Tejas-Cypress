import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

class EntityAccountStore {
  @observable
  formFinInfo = {
    fields: {
      entityNetAssets: {
        value: '',
        label: 'Entity Net Assets',
        error: '',
        rule: 'required',
      },
      cfInvestments: {
        value: '',
        label: 'Other religion CF investments made in prior 12 months',
        error: '',
        rule: 'required',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @observable
  formGeneralInfo = {
    fields: {
      nameOfEntity: {
        value: '',
        label: 'Name of Entity',
        error: '',
        rule: 'required',
      },
      taxId: {
        value: '',
        label: 'Tax ID',
        error: '',
        rule: 'required',
      },
      street: {
        value: '',
        label: 'Street',
        error: '',
        rule: 'required|string',
      },
      city: {
        value: '',
        label: 'City',
        error: '',
        rule: 'required|string',
      },
      state: {
        value: '',
        label: 'State',
        error: '',
        rule: 'required|string',
      },
      zipCode: {
        value: '',
        label: 'ZIP Code',
        error: '',
        rule: 'required|numeric',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @action
  finInfoChange = (field, value) => {
    this.onFieldChange('formFinInfo', field, value);
  };

  @action
  genInfoChange = (e, { name, value }) => {
    this.onFieldChange('formGeneralInfo', name, value);
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

export default new EntityAccountStore();
