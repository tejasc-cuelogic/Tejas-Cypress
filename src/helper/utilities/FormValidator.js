import { toJS } from 'mobx';
import Validator from 'validatorjs';
import { mapValues, replace, sumBy, forEach, mapKeys, isArray, toArray, reduce } from 'lodash';
import CustomeValidations from './CustomeValidations';
import Helper from '../utility';

class FormValidator {
  prepareFormObject = (fields, isDirty = false, isValid = false) => ({ fields: { ...fields }, meta: { isValid, error: '', isDirty }, response: {} });

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
      currentForm.fields[element.name].error = validation.errors.first(element.name) ?
        replace(
          validation.errors.first(element.name),
          element.name,
          currentForm.fields[element.name].label,
        ) : undefined;
    }
    currentForm.meta.isDirty = isDirty;
    return currentForm;
  }

  onArrayFieldChange = (form, element, formName = null, formIndex = -1, type) => {
    CustomeValidations.executet();
    const currentForm = form;
    let currentFormRelative;
    let fieldName = element.name;
    if (formIndex > -1 && formName) {
      currentFormRelative = currentForm.fields[formName][formIndex];
      fieldName = `${formName}.${formIndex}.${element.name}`;
    } else if (formName) {
      currentFormRelative = currentForm.fields[formName];
      fieldName = `${formName}.${element.name}`;
    } else {
      currentFormRelative = currentForm.fields;
    }

    if (element.name) {
      if (type === 'checkbox' || (Array.isArray(toJS(currentFormRelative[element.name].value)) && type !== 'dropdown')) {
        const index = currentFormRelative[element.name]
          .value.indexOf(element.value);
        if (index === -1) {
          currentFormRelative[element.name].value.push(element.value);
        } else {
          currentFormRelative[element.name].value.splice(index, 1);
        }
      } else {
        currentFormRelative[element.name].value = element.value;
      }
    }
    /* Beneficiary share percentage validation register */
    Validator.register('sharePercentage', (value, requirement) => {
      const total = sumBy(currentForm.fields[formName], currentValue =>
        parseInt(currentValue[requirement].value, 10));
      forEach(currentForm.fields[formName], (ele, key) => {
        currentForm.fields[formName][key][requirement].error = total === 100 ?
          undefined : true;
      });
      return total === 100 && value > 0;
    }, 'The sum of :attribute percentages must be 100.');
    const formData = this.ExtractFormValues(toJS(currentForm.fields));
    const formRules = this.ExtractFormRules(toJS(currentForm.fields));
    const validation = new Validator(formData, formRules);
    currentForm.meta.isValid = validation.passes();

    if (element && element.name) {
      currentFormRelative[element.name].error = validation.errors.first(fieldName) ?
        replace(
          validation.errors.first(fieldName),
          fieldName,
          currentFormRelative[element.name].label,
        ) : undefined;
    }
    return currentForm;
  }

  ExtractValues = fields => mapValues(fields, f => f.value);

  ExtractFormValues = fields => mapValues(fields, f =>
    (isArray(f) ? toArray(mapValues(f, d => mapValues(d, s => s.value))) :
      f.value));

  ExtractFormRules = fields => reduce(mapValues(fields, (f, key) =>
    (isArray(f) ? mapKeys(mapValues(f[0], k => k.rule), (s, v) => `${key}.*.${v}`) :
      mapKeys(v => `${key}.${v.rule}`))), (a, b) => Object.assign(a, b));

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
}

export default new FormValidator();
