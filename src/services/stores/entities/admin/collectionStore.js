import { decorate, observable, action } from 'mobx';
import { FormValidator as Validator } from '../../../../helper';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC } from '../../../constants/admin/collection';

import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

class CollectionsStore extends DataModelStore {
  records = [];

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  contentId = '';


  initRequest = () => {
    this.records = [{ name: 'swap', lastName: 'Bhosale' }, { name: 'John', lastName: 'SMith' }];
  }

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    if (!this.records) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], this.records, ref, keepAtLeastOne);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      COLLECTION_CONTENT_FRM: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  updateCollection = (params) => {
    const { forms } = params;
    const data = Validator.evaluateFormData(this[forms].fields);
    const mutationsParams = {
      ...params,
      id: this.contentId,
      data,
    };
    console.log('content', mutationsParams);
  };
}
decorate(CollectionsStore, {
  ...decorateDefault,
  records: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  contentId: observable,
  initRequest: action,
});
export default new CollectionsStore();
