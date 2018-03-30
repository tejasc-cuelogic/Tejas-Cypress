import Validator from 'validatorjs';

export class Validations {
  /**
  * @desc Validates data and returns an error
  * @param $metaData @type Object- a rule and data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @required validator.js
  * @param $confirmationData @type Object- a rule and data for comparison
  * @return @type Object - Error object or empty object
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

  // Private actions starts here

  /**
  * @desc Builds data as required for validation by `validator.js`
  * @param $metaData @type Object - a rule and data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @param $confirmationData @type Object - a rule and data for comparison
  * @return @type Object - desired data format
  * { email: 'abd' }
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
  * @param $metaData @type Object - a rule a data to be validated
  *   {
  *     value: 'abc',
  *     error: undefined,
  *     rule: 'required',
  *     key: 'email',
  *   }
  * @return @type Object - desired rule format
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
