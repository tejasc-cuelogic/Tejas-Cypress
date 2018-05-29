import { observable, action } from 'mobx';
// import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
// import { GqlClient as client } from '../../services/graphqlCool';
import {
  BUSINESS_MODEL,
} from '../../constants/newBusiness';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = { fields: { ...BUSINESS_MODEL }, meta: { isValid: false, error: '' } };

  @action
  businessAppEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_APP_FRM', fieldName, fieldValue);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      this[form].fields[field].value = value;
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };
}

export default new NewBusinessStore();
