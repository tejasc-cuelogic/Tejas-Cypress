import _ from 'lodash';
import validationService from '../../../api/validation';
import {
  authStore,
  businessStore,
  profileStore,
  bankAccountStore,
  iraAccountStore,
  entityAccountStore,
} from '../../stores';
import {
  REGISTRATION, CONDITIONAL_REQUIRE, CONFIRM_IDENTITY_DOCUMENTS_FORM,
} from '../../../constants/validation';

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
   * @desc validates signature information on XML form, validate and update store
   * @return null
   */
  validateSignatureInfo = (field) => {
    const { errors } = validationService.validate(businessStore.signature[field]);
    this.formValidationErrors(errors, field);
    businessStore.setSignatureError(field, errors && errors[field][0]);
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
    _.map(data, (field) => {
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
   * @desc This method checks if error is present or not, and update store
   * @param $errors @type Object - Error for particular field
   * @param $field @type String - Name of field for which error is present
   * @return null
   */
  formValidationErrors = (errors, field) => {
    if (errors) {
      const newErrors = { ...businessStore.xmlErrors };
      /* eslint-disable prefer-destructuring */
      newErrors[field] = errors[field][0];
      businessStore.setXmlError(newErrors);
    } else {
      /* eslint-disable no-lonely-if */
      if (field !== 'notificationEmailElement') {
        businessStore.removeXmlError(field);
      }
    }
  }

  /**
   * @desc Validates Confirm Identity Documents Form
   */
  validateConfirmIdentityDocumentsForm = () => {
    _.map(profileStore.confirmIdentityDocuments, (value) => {
      const { key } = value;
      // Select only required values and exclude others from being checked
      if (CONFIRM_IDENTITY_DOCUMENTS_FORM.includes(key)) {
        const { errors } = validationService.validate(value);
        // Store errors to store if any or else `undefined` will get set to it
        profileStore.setConfirmIdentityDocumentsError(key, errors && errors[key][0]);
      }
    });
  }

  /**
  * @desc Validates IRA - financial info after clicking next/submit button
  * @return null
  */
 validateIRAFinancialInfo = () => {
   _.map(iraAccountStore.FIN_INFO_FRM.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     iraAccountStore.setIraError('FIN_INFO_FRM', key, errors && errors[key][0]);
   });
 }

  /**
  * @desc Validates IRA - Identity after clicking next/submit button
  * @return null
  */
 validateIRAIdentityInfo = () => {
   const { errors } =
  validationService.validate(iraAccountStore.IDENTITY_FRM.fields.identityDoc);
   // Store errors to store if any or else `undefined` will get set to it
   iraAccountStore.setIraError('IDENTITY_FRM', 'IDENTITY_FRM', errors && errors.identityDoc[0]);
 }

 /**
  * @desc Validates Entity - Financial Information on next/submit button
  */
 validateEntityFinancialInfo = () => {
   _.map(entityAccountStore.formFinInfo.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     entityAccountStore.setEntityError('formFinInfo', key, errors && errors[key][0]);
   });
 }

 /**
  * @desc Validates Entity - General Information on next/submit button
  */
 validateEntityGeneralInformation = () => {
   _.map(entityAccountStore.formGeneralInfo.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     entityAccountStore.setEntityError('formGeneralInfo', key, errors && errors[key][0]);
   });
 }

 /**
  * @desc Validates Entity - Info on next/submit button
  */
 validateEntityInfo = () => {
   _.map(entityAccountStore.formEntityInfo.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     entityAccountStore.setEntityError('formEntityInfo', key, errors && errors[key][0]);
   });
 }

 /**
  * @desc Validates Entity - Personal Info on next/submit button
  */
 validateEntityPersonalInfo = () => {
   _.map(entityAccountStore.formPersonalInfo.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     entityAccountStore.setEntityError('formPersonalInfo', key, errors && errors[key][0]);
   });
 }

 /**
  * @desc Validates Entity - Formation Docs on next/submit button
  */
 validateEntityFormationDoc = () => {
   _.map(entityAccountStore.formFormationDocuments.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     entityAccountStore.setEntityError('formFormationDocuments', key, errors && errors[key][0]);
   });
 }

  /**
  * @desc Validates Entity - Formation Docs on next/submit button
  */
 validateLinkBankForm = () => {
   _.map(bankAccountStore.formLinkBankManually.fields, (value) => {
     const { key } = value;
     const { errors } = validationService.validate(value);
     // Store errors to store if any or else `undefined` will get set to it
     bankAccountStore.setAccountError('formLinkBankManually', key, errors && errors[key][0]);
   });
 }

  // Private Methods ends here
}

export default new Validation();
