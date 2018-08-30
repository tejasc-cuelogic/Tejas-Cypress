import { Component } from 'react';
import Validator from 'validatorjs';
import { sumBy, forEach } from 'lodash';

class CustomValidations extends Component {
  loadCustomValidations = (form) => {
    const currentForm = form;
    Validator.register('maskedField', (value, requirement) => value.toString().length === parseInt(requirement, 10));
    /* Optional field validation register */
    Validator.register('optional', () => true);

    /* Investment Type Check for target investor irr field validation register */
    Validator.register('investmentTypeCheck', (value) => {
      let valReturn;
      if (currentForm.fields.investmentType.value === 'CORE') {
        valReturn = value >= 5;
      } else if (currentForm.fields.investmentType.value === 'CORE_PLUS') {
        valReturn = value >= 7;
      } else if (currentForm.fields.investmentType.value === 'VALUE_ADD') {
        valReturn = value >= 11;
      } else if (currentForm.fields.investmentType.value === 'OPPORTUNISTIC') {
        valReturn = value >= 15;
      }
      return valReturn;
    }, ':attribute percentages must be greater than entered value.');

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
