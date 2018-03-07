import _ from 'lodash';

import validationService from './../services/validation';
import authStore from './../stores/authStore';
import userStore from './../stores/userStore';

import { REGISTRATION } from './../constants/validation';

// TODO: make class in such way that methods should not be dependent on any stores...
export class Validation {
  /**
  * @desc Validates single field on registration form
  * @param string $field - field name to be validated
  * @param string $value - value that needs to be assigned to the field
  * @returns null
  */
  validateRegisterField = (field, value) => {
    // First set value to authStore
    authStore.setValue(field, value);
    // Vaidate whether field value is valid
    // Extra parameter for password needed to check verify password matched or not
    const { errors } = validationService.validate(
      authStore.values[field],
      authStore.values.password,
    );
    // Set errors if any to store or else `undefined` will get set to variable.
    authStore.setError(field, errors && errors[field][0]);
  }

  // validateField = (field, value) => {
  //   const { errors } = validationService.validate(
  //     authStore.values[field],
  //     authStore.values.password,
  //   );
  //   return errors;
  // }

  /**
  * @desc Validated complete Registration form after clicking submit button
  * @return null
  */
  validateRegisterForm = () => {
    _.map(authStore.values, (value) => {
      const { key } = value;
      // Select only required values and exclude others from being checked
      if (REGISTRATION.includes(key)) {
        const { errors } = validationService.validate(
          value,
          authStore.values.password,
        );
        // Store errors to store if any or else `undefined` will get set to it
        authStore.setError(key, errors && errors[key][0]);
      }
    });
  }

  /**
  * @desc Validates fields on new user creation form in admin panel
  * @param string $field - field on form that need to be validated
  * @param string $value - value that need to be set to field
  * @return null
  */
  validateNewUserField = (field, value) => {
    // Set field value in store
    userStore.setValue(field, value);
    // Validate field as per rule set in the stores
    const { errors } = validationService.validate(field, userStore.values[field]);
    // Set errors in store observables if any
    userStore.setError(field, errors && errors[field][0]);
  }

  // TODO: Validate create new user form on click of submit button from admin panel
}

export default new Validation();
