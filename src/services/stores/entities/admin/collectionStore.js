import { decorate, observable, action } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import DataModelStore, * as dataModelStore from '../shared/dataModelStore';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC, COLLECTION_MAPPING } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, getCollectionMapping } from '../../queries/collection';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';


class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, getCollectionMapping });
  }

  collections = [];

  initLoad = [];

  collection = {};

  collectionMapping = {};

  collectionIndex = null;

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  COLLECTION_MAPPING_FRM = Validator.prepareFormObject(COLLECTION_MAPPING);

  collectionId = null;

  collectionLoading = [];

  initRequest = () => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'getCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          this.setSelectedCollections((get(res, 'getCollections')));
          this.setFieldValue('collections', res.getCollections);
        }
        this.setFieldValue('apiHit', false);
      });
    }
  };

  setSelectedCollections = (collections) => {
    this.COLLECTION_MAPPING_FRM.fields.collection.value = [];
    const selectedCollections = collections.slice(0, 4).map(c => c.id);
    this.COLLECTION_MAPPING_FRM.fields.collection.value = [
      ...this.COLLECTION_MAPPING_FRM.fields.collection.value,
      ...selectedCollections,
    ];
  }


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
        } else if (f === 'TOMBSTONE_FRM') {
          data = { collectionDetails: { marketing: { tombstone: Validator.evaluateFormData(this[f].fields) } } };
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
    this.collectionLoading.push('getCollection');
    this.executeQuery({
      query: 'getCollection',
      variables: { slug },
      // setLoader: 'getCollection',
    }).then((res) => {
      if (get(res, 'getCollection')) {
        this.setFieldValue('collectionId', res.getCollection.id);
        this.setFieldValue('collection', res.getCollection);
        this.setFieldValue('collectionLoading', []);
        this.COLLECTION_OVERVIEW_FRM = Validator.setFormData(this.COLLECTION_OVERVIEW_FRM, res.getCollection);
        this.loading = false;
      }
    }).catch(() => {
      this.setFieldValue('collectionLoading', []);
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
          const tempData = {};
          if (params.type === 'OFFERING') {
            data = {
              live: data.filter(d => d.offering.stage === 'LIVE').map(d => d.offering),
              complete: data.filter(d => d.offering.stage === 'COMPLETE').map(d => d.offering),
            };
            tempData[params.type] = data;
          } else if (params.type === 'INSIGHT') {
            tempData[params.type] = data.map(d => d.insight);
          } else {
            tempData[params.type] = data;
          }
          this.setFieldValue('collectionIndex', index);
          this.collectionMapping = { ...tempData };
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
      uiStore.setProgress('save');
      const { collection } = this;
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
      this.getCollection(get(collection, 'slug'));
      uiStore.setProgress(false);
      return res;
    } catch (err) {
      uiStore.setProgress(false);
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
  COLLECTION_MAPPING_FRM: observable,
  collectionMapping: observable,
  collectionId: observable,
  collectionIndex: observable,
  TOMBSTONE_FRM: observable,
  contentId: observable,
  collection: observable,
  initLoad: observable,
  initRequest: action,
  upsertCollection: action,
  filterInitLoad: action,
  mergeCollection: action,
  setFormData: action,
  getActionType: action,
  setSelectedCollections: action,
  collectionLoading: observable,
  getCollection: action,
});
export default new CollectionsStore();
