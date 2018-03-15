import _ from 'lodash';

import validationService from './../services/validation';
import authStore from './../stores/authStore';
import businessStore from './../stores/businessStore';
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
    const conditionalRequire = { verify: 'password' };
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

  validateFilerInfoField = (field, value) => {
    businessStore.setFilerInfo(field, value);
    const { errors } = validationService.validate(businessStore.filerInformation[field]);
    businessStore.setFilerError(field, errors && errors[field][0]);
  }

  validateIssuerInfoField = (field, value) => {
    const conditionalRequire = { legalStatusOtherDesc: 'legalStatusForm' };
    businessStore.setIssuerInfo(field, value);
    const { errors } = validationService.validate(
      businessStore.issuerInformation[field],
      businessStore.issuerInformation[conditionalRequire[field]],
    );
    businessStore.setIssuerError(field, errors && errors[field][0]);
  }

  validateOfferingInfoField = (field, value) => {
    const conditionalRequire = {
      securityOfferedOtherDesc: 'securityOfferedType',
      noOfSecurityOffered: 'securityOfferedType',
      overSubscriptionAllocationType: 'overSubscriptionAccepted',
      descOverSubscription: 'overSubscriptionAllocationType',
    };
    businessStore.setOfferingInfo(field, value);
    const { errors } = validationService.validate(
      businessStore.offeringInformation[field],
      businessStore.offeringInformation[conditionalRequire[field]],
    );
    businessStore.setOfferingError(field, errors && errors[field][0]);
  }

  validateAnnualReportField = (field, value) => {
    businessStore.setAnnualReportInfo(field, value);
    const { errors } = validationService.validate(businessStore.annualReportRequirements[field]);
    businessStore.setAnnualReportError(field, errors && errors[field][0]);
  }

  validateSignatureInfo = (field, value) => {
    businessStore.setSignatureInfo(field, value);
    const { errors } = validationService.validate(businessStore.signature[field]);
    businessStore.setSignatureError(field, errors && errors[field][0]);
  }

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

  // TODO: Validate create new user form on click of submit button from admin panel
}

export default new Validation();
