import { Component } from 'react';
import Validator from 'validatorjs';

class CustomeValidations extends Component {
  execute = () => {
    /* Optional field validation register */
    Validator.register('optional', () => true);
  }
}

export default new CustomeValidations();
