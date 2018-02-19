import Validator from 'validatorjs';
// import { REGISTRATION } from './../constants/validations';

export class Validations {
  // Validates data and returns an error
  // Accepts metaData input parameter as
  // {
  //    value: 'abc',
  //    error: undefined,
  //    rule: 'required',
  //    key: 'email',
  // }
  // and confirmationData only used while checking password and verifyPassword fields
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

  // Builds data as required for validation by `validator.js`
  // desired output format is
  // data: {email: 'abc'}
  getData = (metaData, confirmationData) => {
    const data = {};
    data[metaData.key] = metaData.value;
    if (metaData.key === 'verify') {
      data.password = confirmationData.value;
    }
    return data;
  }

  // Builds rule as required for validation by 'validator.js'
  // desired output format is
  // rule: {email: 'required'}
  getRules = (metaData) => {
    const rules = {};
    rules[metaData.key] = metaData.rule;
    return rules;
  }
  // Private actions ends here
}

export default new Validations();
