import Validator from 'validatorjs';
// import { REGISTRATION } from './../constants/validations';

export class Validations {
  validate = (data, rule) => {
    const validation = new Validator(data, rule);
    if (validation.fails()) {
      return validation.errors;
    }
    return undefined;
  }

  // validateForm = (values) => {
  //   const data = {};
  //   const rule = {};
  //   /* eslint-disable no-return-assign */
  //   REGISTRATION.map(field => data[field] = values[field].value);
  //   //  eslint-disable no-return-assign
  //   REGISTRATION.map(field => rule[field] = values[field].rule);
  //   const validation = new Validator(data, rule);
  //   if (validation.fails()) {
  //     return validation.errors;
  //   }
  //   return {};
  // }

  // Private - starts here
  getData = (field, value) => {
    const data = {};
    data[field] = value;
    // if (field === 'verify') {
    //   data.password = values.password.value;
    // }
    return data;
  }

  getRules = (field, rule) => {
    const rules = {};
    rules[field] = rule;
    return rules;
  }
  // Private - ends here
}

export default new Validations();
