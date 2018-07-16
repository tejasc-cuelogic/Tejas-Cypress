import { toJS } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import Helper from '../utility';

class FormValidator {
  prepareFormObject = (fields, isDirty = false, isFieldValid = true, isValid = false) => ({
    fields: { ...fields },
    meta: {
      isValid,
      error: '',
      isDirty,
      isFieldValid,
    },
    response: {},
  });

  pullValues = (e, data) => ({
    name: typeof data === 'undefined' ? e.target.name : data.name,
    value: typeof data === 'undefined' ? e.target.value : data.value,
  });

  onChange = (form, element, type, isDirty = true) => {
    const currentForm = form;
    if (element && element.name) {
      if (type === 'checkbox' || (Array.isArray(toJS(currentForm.fields[element.name].value)) && type !== 'dropdown')) {
        const index = currentForm.fields[element.name].value.indexOf(element.value);
        if (index === -1) {
          currentForm.fields[element.name].value.push(element.value);
        } else {
          currentForm.fields[element.name].value.splice(index, 1);
        }
      } else {
        currentForm.fields[element.name].value = element.value;
      }
    }
    const validation = new Validator(
      mapValues(currentForm.fields, f => f.value),
      mapValues(currentForm.fields, f => f.rule),
    );
    currentForm.meta.isValid = validation.passes();
    if (element && element.name) {
      currentForm.fields[element.name].error = validation.errors.first(element.name);
      if (currentForm.fields[element.name].error === false) {
        currentForm.meta.isFieldValid = true;
      } else {
        currentForm.meta.isFieldValid = false;
      }
    }
    currentForm.meta.isDirty = isDirty;
    return currentForm;
  }

  ExtractValues = fields => mapValues(fields, f => f.value);

  resetFormData = (form) => {
    const currentForm = form;
    Object.keys(currentForm.fields).map((field) => {
      currentForm.fields[field].value = '';
      currentForm.fields[field].error = undefined;
      return true;
    });
    currentForm.meta.isValid = false;
    currentForm.meta.error = '';
    return currentForm;
  }

  setAddressFields = (place, form) => {
    const { state, city, zipCode } = form.fields;
    const currentForm = form;
    const data = Helper.gAddressClean(place);
    if (currentForm.fields.street) {
      currentForm.fields.street.value = data.residentalStreet;
    } else {
      currentForm.fields.residentalStreet.value = data.residentalStreet;
    }
    state.value = data.state;
    city.value = data.city;
    zipCode.value = data.zipCode;
  }

  setIsDirty = (form, status) => {
    const currentForm = form;
    currentForm.meta.isDirty = status;
  }

  setFormError = (form, key, error) => {
    const currentForm = form;
    currentForm.fields[key].error = error;
    if (error) {
      currentForm.meta.isValid = false;
      currentForm.meta.isFieldValid = false;
    }
  }
}

export default new FormValidator();
