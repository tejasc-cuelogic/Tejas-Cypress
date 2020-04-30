import { decorate, observable, action } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import DataModelStore, * as dataModelStore from '../shared/dataModelStore';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert } from '../../queries/collection';
import Helper from '../../../../helper/utility';

class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert });
  }

  collections = [];

  initLoad = [];

  collection = {};

  collectionMappingOfferings = []

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  contentId = null;

  initRequest = () => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'getCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          ['collectionMappingOfferings', 'collections'].forEach(obs => (
            this.setFieldValue(obs, res.getCollections)));
        }
        this.setFieldValue('apiHit', false);
      });
    }
  };

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    const { collection } = this;
    if (!collection) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], collection, ref, keepAtLeastOne);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      [formName]: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  filterInitLoad = (formName) => {
    this.initLoad = this.initLoad.filter(f => f !== formName);
  }

  formPayLoad = (params) => {
    const { forms } = params;
    let data = {};
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        if (f === 'COLLECTION_CONTENT_FRM') {
          data = { collectionDetails: { marketing: Validator.evaluateFormData(this[f].fields) } };
        } if (f === 'TOMBSTONE_FRM') {
          data = { collectionDetails: { marketing: { tombstone: Validator.evaluateFormData(this[f].fields) } } };
        } else {
          data = { collectionDetails: Validator.evaluateFormData(this[f].fields) };
        }
      });
    }
    if (this.contentId !== null) {
      data.id = this.contentId;
    }
    return data;
  }

  mergeCollection = (data) => {
    this.collections = [...this.collections, [...data]];
  }

  getCollection = (slug) => {
    this.initLoad.push('getCollection');
    this.executeQuery({
      query: 'getCollection',
      variables: { slug },
      setLoader: 'getCollection',
    }).then((res) => {
      if (get(res, 'getCollection')) {
        this.setFieldValue('contentId', res.getCollection.id);
        this.setFieldValue('collection', res.getCollection);
        this.COLLECTION_OVERVIEW_FRM = Validator.setFormData(this.COLLECTION_OVERVIEW_FRM, res.getCollection);
      }
    });
  }

  adminLockOrUnlockCollection = lockAction => new Promise(async (res, rej) => {
    const variables = {
      id: this.contentId,
      action: lockAction,
    };
    try {
      const data = await this.executeMutation({
        mutation: 'adminLockOrUnlockCollection',
        setLoader: 'adminLockOrUnlockCollection',
        variables,
      });
      window.logger(data);
      const lockObj = get(data, 'data.adminLockOrUnlockCollection') ? {
        date: get(data, 'data.adminLockOrUnlockCollection.date'),
        by: get(data, 'data.adminLockOrUnlockCollection.by'),
        id: get(data, 'data.adminLockOrUnlockCollection.id'),
      } : null;
      this.setFieldValue('collection', lockObj, 'lock');
      res();
    } catch (error) {
      rej(error);
    }
  });

  adminCollectionMappingUpsert = (params, mappingObj) => new Promise(async (res, rej) => {
    const variables = {
      ...params,
    };
    try {
      const data = await this.executeMutation({
        mutation: 'adminCollectionMappingUpsert',
        setLoader: 'adminCollectionMappingUpsert',
        variables,
      });
      window.logger(data);
      this[mappingObj] = mappingObj.filter(obj => obj.id !== params.id);
      res();
    } catch (error) {
      rej(error);
    }
  });

  upsertCollection = async (params) => {
    try {
      const res = await this.executeMutation({
        mutation: 'adminCollectionUpsert',
        setLoader: 'adminCollectionUpsert',
        variables: this.formPayLoad(params),
      });
      // if (get(res, 'adminCollectionUpsert')) {
      //   this.setFieldValue('contentId', res.adminCollectionUpsert.id);
      //   if (this.contentId === null) {
      //     this.mergeCollection(res.adminCollectionUpsert);
      //   }
      // }
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

  @action
  customFormArrayChange = (e, result, form, subForm = '', index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result),
      subForm,
      index,
    );
  }
}
decorate(CollectionsStore, {
  ...dataModelStore.decorateDefault,
  collections: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  COLLECTION_CONTENT_FRM: observable,
  contentId: observable,
  collection: observable,
  initLoad: observable,
  initRequest: action,
  upsertCollection: action,
  filterInitLoad: action,
  mergeCollection: action,
  setFormData: action,
  getActionType: action,
  customFormArrayChange: action,
});
export default new CollectionsStore();
