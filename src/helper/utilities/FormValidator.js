import { toJS } from 'mobx';
import Validator from 'validatorjs';
import { mapValues, replace, sumBy, forEach, mapKeys, isArray, toArray, reduce } from 'lodash';
import CustomeValidations from './CustomeValidations';

class FormValidator {
  prepareFormObject = fields => ({ fields: { ...fields }, meta: { isValid: false, error: '' } });

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
    CustomeValidations.executet();
    const currentForm = form;
    if (element.name) {
      if (type === 'checkbox' || (Array.isArray(toJS(currentForm.fields.beneficiary[formIndex][element.name].value)) && type !== 'dropdown')) {
        const index = currentForm.fields.beneficiary[formIndex][element.name]
          .value.indexOf(element.value);
        if (index === -1) {
          currentForm.fields.beneficiary[formIndex][element.name].value.push(element.value);
        } else {
          currentForm.fields.beneficiary[formIndex][element.name].value.splice(index, 1);
        }
      } else {
        currentForm.fields.beneficiary[formIndex][element.name].value = element.value;
      }
    }
    /* Beneficiary share percentage validation register */
    Validator.register('sharePercentage', (value, requirement) => {
      const total = sumBy(currentForm.fields.beneficiary, currentValue =>
        parseInt(currentValue[requirement].value, 10));
      forEach(currentForm.fields.beneficiary, (ele, key) => {
        currentForm.fields.beneficiary[key][requirement].error = total === 100 ?
          undefined : true;
      });
      return total === 100;
    }, 'The sum of :attribute percentages must be 100.');

    const formData = this.ExtractValues(toJS(currentForm.fields));
    const formRules = this.ExtractRules(toJS(currentForm.fields));

    const validation = new Validator(formData, formRules);
    currentForm.meta.isValid = validation.passes();
    if (element.name) {
      currentForm.fields.beneficiary[formIndex][element.name].error = validation.errors.first(`beneficiary.${formIndex}.${element.name}`) ?
        replace(
          validation.errors.first(`beneficiary.${formIndex}.${element.name}`),
          `beneficiary.${formIndex}.${element.name}`,
          element.name,
        ) : undefined;
    }
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

  ExtractValues = fields => mapValues(fields, f =>
    (isArray(f) ? toArray(mapValues(f, d => mapValues(d, s => s.value))) :
      mapValues(f, p => p.value)));

  ExtractRules = fields => reduce(mapValues(fields, (f, key) =>
    (isArray(f) ? mapKeys(mapValues(f[0], k => k.rule), (s, v) => `${key}.*.${v}`) :
      mapKeys(mapValues(f, k => k.rule), (s, v) => `${key}.${v}`))), (a, b) => Object.assign(a, b));
}

export default new FormValidator();
