import _ from 'lodash';

import validation from './../services/validations';
import authStore from './../stores/authStore';
import userStore from './../stores/userStore';
// import { REGISTRATION } from './../constants/validation';

export class Validation {
  validateRegisterField = (field, value) => {
    authStore.setValue(field, value);
    const { errors } = validation.validate(
      field,
      authStore.values[field],
      authStore.values.password,
    );
    authStore.setError(field, errors && errors[field][0]);
  }

  validateRegisterForm = () => {
    _.every(authStore.values)
  }

  validateNewUserField = (field, value) => {
    userStore.setValue(field, value);
    const { errors } = validation.validate(field, userStore.values[field]);
    userStore.setError(field, errors && errors[field][0]);
  }

  validateNewUserForm = () => {

  }
}

export default new Validation();
