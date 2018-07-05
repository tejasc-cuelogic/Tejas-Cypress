import { Component } from 'react';
import Validator from 'validatorjs';
// import { sumBy, forEach } from 'lodash';

class CustomeValidations extends Component {
  executet = () => {
    /* Optional field validation register */
    Validator.register('optional', () => true);

    /* Beneficiary share percentage validation register */
    // Validator.register('sharePercentage', (value, requirement) => {
    //   console.log(value, requirement);
    //   return true;
    //   const total = sumBy(currentForm.fields.beneficiary, currentValue =>
    //     parseInt(currentValue[requirement].value, 10));
    //   const status = total === 100 ? undefined : true;
    //   forEach(currentForm.fields.beneficiary, (ele, key) => {
    //     currentForm.fields.beneficiary[key][requirement].error = status;
    //   });
    //   return total === 100;
    // }, 'The sum of :attribute percentages must be 100.');
  }
}

export default new CustomeValidations();
