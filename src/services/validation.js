import Validator from 'validatorjs';
// import { REGISTRATION } from './../constants/validations';

export class Validations {
  validate = (metaData, confirmationData = undefined) => {
    const validation = new Validator(
      this.getData(metaData, confirmationData),
      this.getRules(metaData),
    );
    if (validation.fails()) {
      return validation.errors;
    }
    return {};
  }

  // Private actions starts here
  getData = (metaData, confirmationData) => {
    const data = {};
    data[metaData.key] = metaData.value;
    if (metaData.key === 'verify') {
      data.password = confirmationData.value;
    }
    return data;
  }

  getRules = (metaData) => {
    const rules = {};
    rules[metaData.key] = metaData.rule;
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
