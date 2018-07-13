import Validator from 'validatorjs';

export class Validations {
  /**
  * @desc Validates data and returns an error
  */
  validate = (metaData, confirmationData = undefined) => {
    const validation = new Validator(
      this.getData(metaData, confirmationData),
      this.getRules(metaData),
      metaData.customErrors,
    );
    if (validation.fails()) {
      return validation.errors;
    }
    return {};
  }

  /**
  * @desc Builds data as required for validation by `validator.js`
  */
  getData = (metaData, confirmationData) => {
    const data = {};
    data[metaData.key] = metaData.value;
    if (confirmationData) {
      data[confirmationData.key] = confirmationData.value;
    }
    return data;
  }

  /**
  * @desc Builds rule as required for validation by 'validator.js'
  */
  getRules = (metaData) => {
    const rules = {};
    rules[metaData.key] = metaData.rule;
    return rules;
  }
}

export default new Validations();
