import _ from 'lodash';

import validationService from './../services/validation';
import authStore from './../stores/authStore';
import businessStore from './../stores/businessStore';
import userStore from './../stores/userStore';

import { REGISTRATION } from './../constants/validation';

const conditionalRequire = {
  verify: 'password',
  legalStatusOtherDesc: 'legalStatusForm',
  securityOfferedOtherDesc: 'securityOfferedType',
  noOfSecurityOffered: 'securityOfferedType',
  overSubscriptionAllocationType: 'overSubscriptionAccepted',
  descOverSubscription: 'overSubscriptionAllocationType',
  maximumOfferingAmount: 'overSubscriptionAccepted',
};

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
      authStore.values[conditionalRequire[field]],
    );
    // Set errors if any to store or else `undefined` will get set to variable.
    authStore.setError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates filer information on XML form, this method validated field and stores an error
   *       in store if any.
   * @param $field Field name or id which needs to be validated
   * @param $value Value that user entered in input field on form
   * @return null
   */
  validateFilerInfoField = (field) => {
    const { errors } = validationService.validate(businessStore.filerInformation[field]);
    this.formValidationErrors(errors, field);
    businessStore.setFilerError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates issuer information on XML form, this method validated field and stores an error
   *       in store if any.
   * @param $field Field name or id which needs to be validated
   * @param $value Value that user entered in input field on form
   * @return null
   */
  validateIssuerInfoField = (field) => {
    const { errors } = validationService.validate(
      businessStore.issuerInformation[field],
      businessStore.issuerInformation[conditionalRequire[field]],
    );
    if (errors) {
      businessStore.setXmlError(field, errors[field][0]);
    } else {
      businessStore.removeXmlError(field);
    }
    businessStore.setIssuerError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates offering information on XML form, this method validated field and stores an
   *       error in store if any.
   * @param $field Field name or id which needs to be validated
   * @param $value Value that user entered in input field on form
   * @return null
   */
  validateOfferingInfoField = (field) => {
    const { errors } = validationService.validate(
      businessStore.offeringInformation[field],
      businessStore.offeringInformation[conditionalRequire[field]],
    );
    if (errors) {
      businessStore.setXmlError(field, errors[field][0]);
    } else {
      businessStore.removeXmlError(field);
    }
    businessStore.setOfferingError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates Annual report information on XML form, this method validated field and stores
   *       an error in store if any.
   * @param $field Field name or id which needs to be validated
   * @param $value Value that user entered in input field on form
   * @return null
   */
  validateAnnualReportField = (field) => {
    const { errors } = validationService.validate(businessStore.annualReportRequirements[field]);
    if (errors) {
      businessStore.setXmlError(errors[field][0]);
    } else {
      businessStore.setXmlError(undefined);
    }
    businessStore.setAnnualReportError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates signature information on XML form, this method validated field and stores an
   *       error in store if any.
   * @param $field Field name or id which needs to be validated
   * @param $value Value that user entered in input field on form
   * @return null
   */
  validateSignatureInfo = (field) => {
    const { errors } = validationService.validate(businessStore.signature[field]);
    if (errors) {
      businessStore.setXmlError(errors[field][0]);
    } else {
      businessStore.setXmlError(undefined);
    }
    businessStore.setSignatureError(field, errors && errors[field][0]);
  }

  /**
   * @desc validates Personal Signature and sets error to store if any
   * @param $field Field name that needs to be validated
   * @param $id Uniq Dom id of that field
   * @param $value value that user entered in input element
   * @return null
   */
  validatePersonalSignature = (field, id, value) => {
    businessStore.changePersonalSignature(field, id, value);
  }

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

  /**
   * @desc Validates fields on new offering creation in business panel
   * @param string $field - field on form that need to be validated
   * @param string $value - value that need to be set to field
   * @return null
   */
  validateNewOfferingInfoField = (field, value) => {
    businessStore.setNewOfferingInfo(field, value);
    const { errors } = validationService.validate(businessStore.newOfferingInformation[field]);
    businessStore.setNewOfferingError(field, errors && errors[field][0]);
  }

  /**
   * @desc Validated whole XML form and set an error to particular field in store.
   * @param $data Complete XML form data that needs to be validated before submission.
   * @return $newData with validation errors
   */
  validateXmlFormData = (data) => {
    const newData = {};
    _.map(data, (field) => {
      const { errors } = validationService.validate(
        field,
        data[conditionalRequire[field.key]],
      );
      newData[field.key] = { ...field };
      newData[field.key].error = (errors && errors[field.key][0]);
    });
    return newData;
  }

  // TODO: Validate create new user form on click of submit button from admin panel

  // Private Methods starts here
  formValidationErrors = (errors, field) => {
    if (errors) {
      const newErrors = { ...businessStore.xmlErrors };
      /* eslint-disable prefer-destructuring */
      newErrors[field] = errors[field][0];
      businessStore.setXmlError(newErrors);
    } else {
      const newErrors = { ...businessStore.xmlErrors };
      _.omit(newErrors, field);
      businessStore.setXmlError(newErrors);
    }
  }
  // Private Methods ends here
}

export default new Validation();
