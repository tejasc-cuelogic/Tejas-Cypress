import { observable, action } from 'mobx';

export class BusinessStore {
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
  documentList = [];

  @action
  setTemplateVariable(key, value) {
    this.templateVeriables[key] = value;
  }
}

export default new BusinessStore();
