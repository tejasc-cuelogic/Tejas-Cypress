import validation from './../services/validations';
import authStore from './../stores/authStore';

export class Validation {
  validateAndSave = (field, value) => {
    const data = {};
    const rules = {};
    authStore.setValue(field, value);
    data[field] = value;
    if (field === 'verify') {
      data.password = authStore.values.password.value;
    }
    rules[field] = authStore.values[field].rule;
    // console.log(validation.validate(data, rules).errors[field]);
    const { errors } = validation.validate(data, rules);
    authStore.setError(field, errors && errors[field][0]);
  }

  // validateNewUserFormField = (field, value) => {

  // }
}

export default new Validation();
