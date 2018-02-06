import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import { DOCFILE_TYPES, FORM_VALUES } from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  templateVariables = {
    name_of_business: '',
    shorthand_name: '',
    investment_multiple: '',
    revenue_share_percentage: '',
    minimum_offering_amount: '',
    offering_amount: '',
    maturity_date: '',
    interest_rate: '',
    offer_date: '',
    state_of_formation: '',
    type_of_business: '',
    termination_date: '',
  };

  @observable
  documentList = { ...DOCFILE_TYPES };

  @computed get canSubmitEdgarForm() {
    return (_.every(this.templateVariables, val => !_.isEmpty(val)));
  }

  @action
  setTemplateVariable(key, value) {
    this.templateVariables[key] = value;
  }

  @action
  toggleRequiredFiles(key) {
    this.documentList[key] = !this.documentList[key];
  }
}

export default new BusinessStore();
