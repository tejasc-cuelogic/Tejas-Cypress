import Validator from 'validatorjs';
// import { REGISTRATION } from './../constants/validations';

export class Validations {
  validate = (field, metaData, confirmationData = undefined) => {
    const validation = new Validator(
      this.getData(field, metaData, confirmationData),
      this.getRules(field, metaData),
    );
    if (validation.fails()) {
      return validation.errors;
    }
    return {};
  }

  // Private actions starts here
  getData = (field, metaData, confirmationData) => {
    const data = {};
    data[field] = metaData.value;
    if (field === 'verify') {
      data.password = confirmationData.value;
    }
    return data;
  }

  getRules = (field, metaData) => {
    const rules = {};
    rules[field] = metaData.rule;
    return rules;
  }

  buildData = (values) => {
    console.log(values);
  }

  buildRules = (values) => {
    console.log(values);
  }
  // Private actions ends here
}

export default new Validations();
