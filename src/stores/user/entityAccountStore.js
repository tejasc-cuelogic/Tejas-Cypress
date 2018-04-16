import { action, observable } from 'mobx';
import Validator from 'validatorjs';

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
  }
  @action
  onFieldChange = (field, value) => {
    this.formFinInfo.fields[field].value = value;
    const { entityNetAssets, cfInvestments } = this.formFinInfo.fields;
    const validation = new Validator(
      { entityNetAssets: entityNetAssets.value, cfInvestments: cfInvestments.value },
      { entityNetAssets: entityNetAssets.rule, cfInvestments: cfInvestments.rule },
    );
    this.formFinInfo.meta.isValid = validation.passes();
    this.formFinInfo.fields[field].error = validation.errors.first(field);
  };
}

export default new EntityAccountStore();
