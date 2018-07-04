import { toJS } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import { sumBy, forEach, replace } from 'lodash';
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

    Validator.register('sum', (value, requirement) => {
      const total = sumBy(currentForm.fields, currentValue =>
        parseInt(currentValue[requirement].value, 10));
      const status = total === 100 ? undefined : true;
      forEach(currentForm.fields, (ele, key) => {
        currentForm.fields[key][requirement].error = status;
      });
      return total === 100;
    }, 'The sum of :attribute percentages must be 100.');

    const rules = {
      'beneficiary.*.city': 'required',
      'beneficiary.*.dob': 'required',
      'beneficiary.*.firstName': 'required',
      'beneficiary.*.lastName': 'required',
      'beneficiary.*.relationship': 'required',
      'beneficiary.*.residentalStreet': 'required',
      'beneficiary.*.share': 'required|numeric|sum:share',
      'beneficiary.*.state': 'required',
      'beneficiary.*.zipCode': 'required',
    };
    const formData = currentForm.fields.map(fieldsSet => mapValues(fieldsSet, f => f.value));
    const data = {
      beneficiary: formData,
    };

    const validation = new Validator(data, rules);
    currentForm.meta.isValid = validation.passes();
    if (element.name) {
      currentForm.fields[formIndex][element.name].error = validation.errors.first(`beneficiary.${formIndex}.${element.name}`) ?
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

  ExtractValues = fields => mapValues(fields, f => f.value);
}

export default new FormValidator();
