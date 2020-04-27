import { decorate, observable, action } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections } from '../../queries/collection';
import Helper from '../../../../helper/utility';

import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections });
  }

  collections = [];

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  contentId = '';

  initRequest = () => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'getCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          this.setFieldValue('collections', res.getCollections);
        }
        this.setFieldValue('apiHit', true);
      });
    }
  };

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

  formPayLoad = (params) => {
    const { forms } = params;
    let data = {};
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        if (f === 'COLLECTION_FRM') {
          data = { collectionDetails: Validator.evaluateFormData(this[f].fields) };
        }
      });
    }
    if (this.contentId !== '') {
      data.id = this.contentId;
    }
    return data;
  }

  upsertCollection = async (mutation, params) => {
    try {
      const res = await this.executeMutation({
        mutation,
        setLoader: mutation,
        variables: this.formPayLoad(params),
      });
      return res;
    } catch (err) {
      if (get(err, 'message')) {
        Helper.toast(get(err, 'message'), 'error');
      } else {
        Helper.toast('Something went wrong.', 'error');
      }
      return false;
    }
  };
}
decorate(CollectionsStore, {
  ...decorateDefault,
  collections: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  contentId: observable,
  initRequest: action,
  upsertCollection: action,
});
export default new CollectionsStore();
