import Validator from 'validatorjs';
import authStore from './../stores/authStore';

export class Validations {
  constructor() {
    this.field = null;
    this.value = null;
  }

  saveAndValidate = (field, value) => {
    this.field = field;
    this.value = value;
    authStore.setValue(field, value);
    const validations = new Validator(this.getData(), this.getRules());
    if (!validations.passes()) {
      authStore.setError(field, validations.errors.first(`${field}`));
    } else {
      authStore.setError(field, undefined);
    }
  }

  // Private - starts here
  getData = () => {
    const data = {};
    data[this.field] = this.value;
    if (this.field === 'verify') {
      data.password = authStore.values.password.value;
    }
    return data;
  }

  getRules = () => {
    const rules = {};
    rules[this.field] = authStore.values[this.field].rule;
    return rules;
  }
  // Private - ends here
}

export default new Validations();
