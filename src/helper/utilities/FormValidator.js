import { toJS } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
// import { map } from 'lodash';

class FormValidator {
  prepareFormObject = fields => ({ fields: { ...fields }, meta: { isValid: false, error: '' } });

  prepareMultiFormObject = fields => ({ fields: [{ ...fields }], meta: { isValid: false, error: '' } });

  pullValues = (e, data) => ({
    name: typeof data === 'undefined' ? e.target.name : data.name,
    value: typeof data === 'undefined' ? e.target.value : data.value,
  });

  onChange = (form, element, type) => {
    const currentForm = form;
    if (element.name) {
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
    if (element.name) {
      currentForm.fields[element.name].error = validation.errors.first(element.name);
    }
    return currentForm;
  }

  onArrayFieldChange = (form, element, formIndex, type) => {
    const currentForm = form;
    if (element.name) {
      if (type === 'checkbox' || (Array.isArray(toJS(currentForm.fields[formIndex][element.name].value)) && type !== 'dropdown')) {
        const index = currentForm.fields[formIndex][element.name].value.indexOf(element.value);
        if (index === -1) {
          currentForm.fields[formIndex][element.name].value.push(element.value);
        } else {
          currentForm.fields[formIndex][element.name].value.splice(index, 1);
        }
      } else {
        currentForm.fields[formIndex][element.name].value = element.value;
      }
    }
    const validation = new Validator(
      mapValues(currentForm.fields[formIndex], f => f.value),
      mapValues(currentForm.fields[formIndex], f => f.rule),
    );
    currentForm.meta.isValid = validation.passes();
    if (element.name) {
      currentForm.fields[formIndex][element.name].error = validation.errors.first(element.name);
    }

    const errorList = currentForm.fields.map((fieldsSet) => {
      const allvalidation = new Validator(
        mapValues(fieldsSet, f => f.value),
        mapValues(fieldsSet, f => f.rule),
      );
      return allvalidation.passes();
    });

    currentForm.meta.isValid = !errorList.filter(val => !val).length;

    return currentForm;
  }

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

  ExtractValues = fields => mapValues(fields, f => f.value);
}

export default new FormValidator();
