import { Component } from 'react';
import Validator from 'validatorjs';
import { sumBy, forEach } from 'lodash';

class CustomValidations extends Component {
  loadCustomValidations = (form) => {
    const currentForm = form;
    Validator.register('maskedField', (value, requirement) => value.toString().length === parseInt(requirement, 10));
    /* Optional field validation register */
    Validator.register('optional', () => true);

    /* Beneficiary share percentage validation register */
    Validator.register('sharePercentage', (value, requirement) => {
      const total = sumBy(currentForm.fields.beneficiary, currentValue =>
        parseInt(currentValue[requirement].value, 10));
      forEach(currentForm.fields.beneficiary, (ele, key) => {
        currentForm.fields.beneficiary[key][requirement].error = total === 100 ?
          undefined : true;
      });
      return total === 100 && value > 0;
    }, 'The sum of :attribute percentages must be 100.');
    /* Business App owners percentage validation register */
    Validator.register('ownerPercentage', (value, requirement) => {
      const total = sumBy(currentForm.fields.owners, currentValue =>
        parseInt(currentValue[requirement].value, 10));
      forEach(currentForm.fields.owners, (ele, key) => {
        currentForm.fields.owners[key][requirement].error =
          value >= 20 && value <= 100 && total <= 100 ?
            undefined : true;
      });
      return value >= 20 && value <= 100 && total <= 100;
    }, 'Minimum ownership should be 20% and max 100%.');
  }
}

export default new CustomValidations();
