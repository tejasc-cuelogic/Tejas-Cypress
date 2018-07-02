import { toJS } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

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

  ExtractValues = fields => mapValues(fields, f => f.value);
}

export default new FormValidator();
