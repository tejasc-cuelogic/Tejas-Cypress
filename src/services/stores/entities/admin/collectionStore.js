import { decorate, observable, action } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import DataModelStore, * as dataModelStore from '../shared/dataModelStore';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC } from '../../../constants/admin/collection';
import { offeringCreationStore } from '../../index';
import { adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, getCollectionMapping } from '../../queries/collection';
import Helper from '../../../../helper/utility';

class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, getCollectionMapping });
  }

  collections = [];

  initLoad = [];

  collection = {};

  collectionMapping = {};

  collectionIndex = null;

  collectionMappingOfferings = []

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  collectionId = null;

  initRequest = () => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'getCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          offeringCreationStore.setSelectedCollections((get(res, 'getCollections')));
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
        } else {
          data = { collectionDetails: Validator.evaluateFormData(this[f].fields) };
        }
      });
    }
    if (this.collectionId !== null) {
      data.id = this.collectionId;
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
        this.setFieldValue('collectionId', res.getCollection.id);
        this.setFieldValue('collection', res.getCollection);
        this.COLLECTION_OVERVIEW_FRM = Validator.setFormData(this.COLLECTION_OVERVIEW_FRM, res.getCollection);
      }
    });
  }

  getContentType = (contentType) => {
    if (['ACTIVE_INVESTMENTS', 'COMPLETE_INVESTMENTS'].includes(contentType)) {
      return 'OFFERING';
    }
    return 'INSIGHT';
  }

  getCollectionMapping = (index) => {
    const { value } = this.COLLECTION_CONTENT_FRM.fields.content[index].contentType;
    if (this.collectionIndex !== index
       && ['ACTIVE_INVESTMENTS', 'COMPLETE_INVESTMENTS', 'INSIGHTS'].includes(value)) {
      const params = {
        type: this.getContentType(value),
        collectionId: this.collectionId,
      };
      this.executeQuery({
        query: 'getCollectionMapping',
        variables: { ...params },
        setLoader: 'getCollectionMapping',
      }).then((res) => {
        if (get(res, 'getCollectionMapping')) {
          let data = get(res, 'getCollectionMapping');
          if (params.type === 'OFFERING') {
            data = {
              live: data.filter(d => d.offering.stage === 'LIVE').map(d => d.offering),
              complete: data.filter(d => d.offering.stage === 'COMPLETE').map(d => d.offering),
            };
          }
          this.collectionMapping[params.type] = data;
          this.setFieldValue('collectionIndex', index);
        }
      }).catch(() => {
        this.setFieldValue('collectionIndex', null);
      });
    } else {
      this.setFieldValue('collectionIndex', index);
    }
  }

  adminLockOrUnlockCollection = lockAction => new Promise(async (res, rej) => {
    const variables = {
      id: this.collectionId,
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

  adminCollectionMappingUpsert = params => new Promise(async (res, rej) => {
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
      //   this.setFieldValue('collectionId', res.adminCollectionUpsert.id);
      //   if (this.collectionId === null) {
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
}
decorate(CollectionsStore, {
  ...dataModelStore.decorateDefault,
  collections: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  COLLECTION_CONTENT_FRM: observable,
  collectionId: observable,
  collection: observable,
  initLoad: observable,
  collectionMappingOfferings: observable,
  initRequest: action,
  upsertCollection: action,
  filterInitLoad: action,
  mergeCollection: action,
  setFormData: action,
  getActionType: action,
});
export default new CollectionsStore();
