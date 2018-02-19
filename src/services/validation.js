import Validator from 'validatorjs';

export class Validations {
  /**
  * @desc Validates data and returns an error
  * @param Object $metaData - a rule and data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @required validator.js
  * @param Object $confirmationData - a rule and data for comparison
  * @return Object - Error object or empty object
  */
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

  /**
  * @desc Builds data as required for validation by `validator.js`
  * @param Object $metaData - a rule and data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @param Object $confirmationData - a rule and data for comparison
  * @return Object - desired data format
  * { email: 'abd' }
  */
  getData = (metaData, confirmationData) => {
    const data = {};
    data[metaData.key] = metaData.value;
    if (metaData.key === 'verify') {
      data.password = confirmationData.value;
    }
    return data;
  }

  /**
  * @desc Builds rule as required for validation by 'validator.js'
  * @param Object $metaData - a rule a data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @return Object - desired rule format
  * { email: 'required' }
  */
  getRules = (metaData) => {
    const rules = {};
    rules[metaData.key] = metaData.rule;
    return rules;
  }
  // Private actions ends here
}

export default new Validations();
