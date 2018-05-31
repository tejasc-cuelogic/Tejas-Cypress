import { observable, action } from 'mobx';
// import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
// import { GqlClient as client } from '../../services/graphqlCool';
import {
  BUSINESS_PRE_QUALIFICATION,
} from '../../constants/newBusiness';
import Helper from '../../helper/utility';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = { fields: { ...BUSINESS_PRE_QUALIFICATION }, meta: { isValid: false, error: '' } };

  @action
  businessAppEleChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_APP_FRM', fieldName, fieldValue, type);
  };

  @action
  onFieldChange = (currentForm, field, value, type) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      if (type === 'checkbox' || Array.isArray(this[form].fields[field].value)) {
        const index = this[form].fields[field].value.indexOf(value);
        if (index === -1) {
          this[form].fields[field].value.push(value);
        } else {
          this[form].fields[field].value.splice(index, 1);
        }
      } else {
        this[form].fields[field].value = value;
      }
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

  @action
  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.onFieldChange('BUSINESS_APP_FRM', 'businessStreet', data.residentalStreet);
    this.onFieldChange('BUSINESS_APP_FRM', 'city', data.city);
    this.onFieldChange('BUSINESS_APP_FRM', 'state', data.state);
    this.onFieldChange('BUSINESS_APP_FRM', 'zipCode', data.zipCode);
  }
}

export default new NewBusinessStore();
