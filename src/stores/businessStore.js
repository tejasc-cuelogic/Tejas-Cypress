import { observable, action } from 'mobx';

import { DOCFILE_TYPES, FORM_VALUES } from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  templateVeriables = {
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


  @action
  setTemplateVariable(key, value) {
    this.templateVeriables[key] = value;
  }

  @action
  toggleRequiredFiles(key) {
    this.documentList[key] = !this.documentList[key];
  }
}

export default new BusinessStore();
