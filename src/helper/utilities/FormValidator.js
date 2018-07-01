import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
// import map from 'lodash/map';

class FormValidator {
  prepareFormObject = fields => ({ fields: { ...fields }, meta: { isValid: false, error: '' } });

  pullValues = (e, data) => ({
    name: typeof data === 'undefined' ? e.target.name : data.name,
    value: typeof data === 'undefined' ? e.target.value : data.value,
  });

  onChange = (form, element) => {
    const currentForm = form;
    if (element.name) {
      currentForm.fields[element.name].value = element.value;
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
}

export default new FormValidator();
