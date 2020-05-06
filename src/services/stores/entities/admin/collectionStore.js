/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { decorate, observable, action } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import DataModelStore, * as dataModelStore from '../shared/dataModelStore';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC, COLLECTION_MAPPING, HEADER_META } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, adminDeleteCollectionMapping, getCollectionMapping } from '../../queries/collection';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';


class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, adminDeleteCollectionMapping, getCollectionMapping });
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

  HEADER_META_FRM = Validator.prepareFormObject(HEADER_META);

  COLLECTION_MAPPING_FRM = Validator.prepareFormObject(COLLECTION_MAPPING);

  collectionId = null;

  collectionLoading = [];

  initRequest = (type = false, referenceId = undefined) => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'getCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          if (type) {
            this.setSelectedCollections(type, referenceId).then(() => {
              this.setFieldValue('collections', res.getCollections);
            });
          }
        }
        this.setFieldValue('apiHit', false);
      });
    }
  }

  setSelectedCollections = (type, referenceId) => new Promise(async (resolve) => {
    const params = {
      type: this.getContentType(type),
      referenceId,
    };
    this.collectionMappingWrapper(params).then(action((res) => {
      const data = get(res, 'getCollectionMapping');
      if (data) {
        this.COLLECTION_MAPPING_FRM.fields.collection.value = [];
        const selectedCollections = data.map(c => c.collectionId);
        this.COLLECTION_MAPPING_FRM.fields.collection.value = [
          ...this.COLLECTION_MAPPING_FRM.fields.collection.value,
          ...selectedCollections,
        ];
      }
      resolve();
    }));
  })


  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    const { collection } = this;
    if (!collection) {
      return false;
    }
    if (form === 'HEADER_META_FRM') {
      const metaList = collection.marketing.content.map(c => c.meta);
      this[form] = Validator.setFormData(this[form], { meta: metaList }, ref, keepAtLeastOne);
    } else {
      this[form] = Validator.setFormData(this[form], collection, ref, keepAtLeastOne);
    }
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }

  collectionMeta = index => this.collection.marketing.content[index]

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
          const headerFields = Validator.evaluateFormData(this.HEADER_META_FRM.fields);
          const contentObj = Validator.evaluateFormData(this[f].fields);
          const contentWithMeta = contentObj.content.map((c, index) => {
            c.meta = JSON.stringify(headerFields.meta[index]);
            return c;
          });
          data = { collectionDetails: { marketing: { content: contentWithMeta } } };
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

  parseData = (data) => {
    data.marketing.content.forEach((c) => {
      // eslint-disable-next-line no-param-reassign
      c.meta = JSON.parse(c.meta);
    });
    return data;
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
        this.setFieldValue('collection', this.parseData(res.getCollection));
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

  getCollectionMapping = (type, index) => {
    if (this.collectionIndex !== index
      && ['ACTIVE_INVESTMENTS', 'COMPLETE_INVESTMENTS', 'INSIGHTS'].includes(type)) {
      const params = {
        type: this.getContentType(type),
        collectionId: this.collectionId,
      };
      this.collectionMappingWrapper(params)
        .then((res) => {
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
        })
        .catch(() => {
          this.setFieldValue('collectionIndex', null);
        });
    } else {
      this.setFieldValue('collectionIndex', index);
    }
  }

  collectionMappingWrapper = params => new Promise(async (resolve, rej) => {
    this.executeQuery({
      query: 'getCollectionMapping',
      variables: { ...params },
      setLoader: 'getCollectionMapping',
    }).then((res) => {
      resolve(res);
    }).catch(() => {
      rej();
    });
  })

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


  updateContent = () => {
    this.collection.marketing.content = [...this.collection.marketing.content, ...Validator.evaluateFormData(this.COLLECTION_CONTENT_FRM.fields).content];
  }

  collectionMapping = (mutation, params) => new Promise(async (res, rej) => {
    const variables = {
      ...params,
    };
    try {
      const data = await this.executeMutation({
        mutation,
        setLoader: mutation,
        variables,
      });
      window.logger(data);
      res();
    } catch (error) {
      rej(error);
      Helper.toast('Collection cannot be added', 'error');
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
      if ((params.forms[0] === 'TOMBSTONE')) {
        this.getCollection(get(collection, 'slug'));
      }
      this.updateContent();
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
  HEADER_META_FRM: observable,
  TOMBSTONE_FRM: observable,
  contentId: observable,
  collection: observable,
  initLoad: observable,
  initRequest: action,
  upsertCollection: action,
  filterInitLoad: action,
  parseData: action,
  setFormData: action,
  getActionType: action,
  setSelectedCollections: action,
  collectionLoading: observable,
  getCollection: action,
});
export default new CollectionsStore();
