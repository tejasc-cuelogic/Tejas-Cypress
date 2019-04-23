import { Component } from 'react';
import Validator from 'validatorjs';
import { sumBy, forEach } from 'lodash';
import { TARGETED_INVESTOR_IRR } from '../../constants/business';

class CustomValidations extends Component {
  loadCustomValidations = (form) => {
    const currentForm = form;
    Validator.register('maskedField', (value, requirement) => value.toString().length === parseInt(requirement, 10));
    Validator.register('maxVal', (value, requirement) => parseInt(value, 10) <= parseInt(requirement, 10));
    /* Optional field validation register */
    Validator.register('optional', () => true);

    /* Investment Type Check for target investor irr field validation register */
    Validator.register(
      'investmentTypeCheck', value => value >= TARGETED_INVESTOR_IRR[currentForm.fields.investmentType.value]
      , ':attribute percentages must be greater than entered value.',
    );

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
        parseFloat(currentValue[requirement].value));
      forEach(currentForm.fields.owners, (ele, key) => {
        currentForm.fields.owners[key][requirement].error =
          value >= 20 && value <= 100 && total <= 100 ?
            undefined : true;
      });
      return value >= 20 && value <= 100 && total <= 100;
    }, 'Minimum ownership should be 20% and max 100% or sum of all ownership percentage should not be greater than 100%');

    Validator.register('hundreds', (value) => {
      const amount = parseFloat(value) || 0;
      return amount >= 100 && amount % 100 === 0;
    }, 'Investments must be in increments of $100');

    // TODO need to otimize alphaBrokerage and alphaPublicCompanyRel validators
    Validator.register('alphaBrokerage', (value) => {
      const regex = /^[a-zA-Z ,-]*$/;
      return regex.test(value);
    }, 'Invalid firm name, please verify and enter again.');

    Validator.register('alphaPublicCompanyRel', (value) => {
      const regex = /^[a-zA-Z ]*$/;
      return regex.test(value);
    }, 'Invalid ticker symbol, please verify and enter again.');
  }
}

export default new CustomValidations();
