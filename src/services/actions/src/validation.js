import { map } from 'lodash';
import validationService from '../../../api/validation';
import {
  authStore,
  businessStore,
  bankAccountStore,
  iraAccountStore,
  entityAccountStore,
} from '../../stores';
import {
  CONDITIONAL_REQUIRE,
} from '../../../constants/validation';
import { FormValidator } from '../../../helper';

/**
 * @desc Validation class for form inputs
 * @function $validateRegisterField...
 * @todo make class in such way that methods should not be dependent on any stores...
 */
export class Validation {
  /**
  * @desc Validates single field on registration form
  * @param $field @type String - field name to be validated
  * @param $value @type String/Object - value that needs to be assigned to the field
  * @returns null
  */
  validateRegisterField = (field, value) => {
    // First set value to authStore
    authStore.setValue(field, value);
    // Vaidate whether field value is valid
    // Extra parameter for password needed to check verify password matched or not
    const { errors } = validationService.validate(
      authStore.values[field],
      authStore.values[CONDITIONAL_REQUIRE[field]],
    );
    // Set errors if any to store or else `undefined` will get set to variable.
    authStore.setError(field, errors && errors[field][0]);
  }

  /**
   * @desc Validates fields on new offering creation in business panel
   * @param $field @type String - field on form that need to be validated
   * @param $value @type String/Object - value that need to be set to field
   * @return null
   */
  validateNewOfferingInfoField = (field, value) => {
    businessStore.setNewOfferingInfo(field, value);
    const { errors } = validationService.validate(businessStore.newOfferingInformation[field]);
    businessStore.setNewOfferingError(field, errors && errors[field][0]);
  }

  /**
   * @desc Validated whole XML form and set an error to particular field in store.
   * @param $data @type Object - All XML form data that needs to be validated before submission.
   * @return $newData @type Object - Object with validation errors
   */
  validateXmlFormData = (data) => {
    const newData = {};
    map(data, (field) => {
      const { errors } = validationService.validate(
        field,
        data[CONDITIONAL_REQUIRE[field.key]],
      );
      newData[field.key] = { ...field };
      newData[field.key].error = (errors && errors[field.key][0]);
    });
    return newData;
  }

  /**
   * @desc Validates fields on login
   */
  validateLoginField = (field, value) => {
    // First set value to authStore
    authStore.setValue(field, value);
    // Vaidate whether field value is valid
    const { errors } = validationService.validate(authStore.values[field]);
    // Set errors if any to store or else `undefined` will get set to variable.
    authStore.setError(field, errors && errors[field][0]);
  }

  /**
  * @desc Validates IRA - Identity after clicking next/submit button
  * @return null
  */

 validateIRAForm = (form) => {
   map(iraAccountStore[form].fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     FormValidator.setFormError(iraAccountStore[form], key, errors && errors[key][0]);
   });
 }

  /**
  * @desc Validates Entity - Formation Docs on next/submit button
  */

 validateEntityForm = (form) => {
   map(entityAccountStore[form].fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     FormValidator.setFormError(entityAccountStore[form], key, errors && errors[key][0]);
   });
 }
 validateLinkBankForm = () => {
   map(bankAccountStore.formLinkBankManually.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     FormValidator.setFormError(
       bankAccountStore.formLinkBankManually,
       key,
       errors && errors[key][0],
     );
   });
 }
  // Private Methods ends here
}

export default new Validation();
