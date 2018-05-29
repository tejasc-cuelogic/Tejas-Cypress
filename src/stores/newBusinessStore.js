import { action, observable } from 'mobx';
// import _ from 'lodash';

import {
  BUSINESS_MODEL,
} from '../constants/newBusiness';

class NewBusinessStore {
  @observable
  businessType = { ...BUSINESS_MODEL };
  @action
  setBusinessModel(type) {
    const field = 'businessType';
    const value = {
      activeIndex: type,
      type: BUSINESS_MODEL[type],
    };
    this.setBusinessModel(field, value);
  }
}

export default new NewBusinessStore();
