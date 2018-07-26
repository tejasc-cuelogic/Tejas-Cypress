import { toJS } from 'mobx';
import Validator from 'validatorjs';
import { mapValues, replace, sumBy, forEach, mapKeys, isArray, toArray, reduce, map, includes } from 'lodash';
import CustomeValidations from './CustomeValidations';
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
      fieldName = `beneficiary.${formIndex}.${element.name}`;
    } else if (formName) {
      currentFormRelative = currentForm.fields[formName];
      fieldName = `beneficiary.${element.name}`;
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
      mapValues(f, p => p.value)));

  ExtractFormRules = fields => reduce(mapValues(fields, (f, key) =>
    (isArray(f) ? mapKeys(mapValues(f[0], k => k.rule), (s, v) => `${key}.*.${v}`) :
      mapKeys(mapValues(f, k => k.rule), (s, v) => `${key}.${v}`))), (a, b) => Object.assign(a, b));

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
    const currentForm = form;
    const data = Helper.gAddressClean(place);
    if (currentForm.fields.street) {
      this.onChange(currentForm, { name: 'street', value: data.residentalStreet });
    } else {
      this.onChange(currentForm, { name: 'residentalStreet', value: data.residentalStreet });
    }
    this.onChange(currentForm, { name: 'state', value: data.state });
    this.onChange(currentForm, { name: 'city', value: data.city });
    this.onChange(currentForm, { name: 'zipCode', value: data.zipCode });
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

  validateForm = (form, isMultiForm = false, showErrors = false) => {
    const currentForm = form;
    let validation;
    if (!isMultiForm) {
      validation = new Validator(
        mapValues(currentForm.fields, f => f.value),
        mapValues(currentForm.fields, f => f.rule),
      );
    } else {
      const formData = this.ExtractFormValues(toJS(currentForm.fields));
      let formRules = this.ExtractFormRules(toJS(currentForm.fields));
      formRules = {
        ...formRules,
        businessPlan: 'required',
      };
      validation = new Validator(
        formData,
        formRules,
        {
          required: 'required',
        },
      );
    }
    currentForm.meta.isValid = validation.passes();
    if (validation.errorCount && showErrors) {
      const { errors } = validation.errors;
      map(errors, (error, key) => {
        const [err] = error;
        if (includes(key, '.')) {
          const field = key.split('.');
          if (field[0] === 'businessPlan') {
            currentForm.fields[field[0]].error = err;
          } else {
            currentForm.fields[field[0]][field[1]][field[2]].error = err;
          }
        } else {
          currentForm.fields[key].error = err;
          if (err) {
            currentForm.meta.isFieldValid = false;
          }
        }
      });
    }
  }
}

export default new FormValidator();
