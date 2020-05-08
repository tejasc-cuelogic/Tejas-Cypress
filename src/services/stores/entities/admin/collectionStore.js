/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { decorate, observable, action, computed, toJS, runInAction } from 'mobx';
import { get, orderBy } from 'lodash';
import cleanDeep from 'clean-deep';
import omitDeep from 'omit-deep';
import { FormValidator as Validator } from '../../../../helper';
import DataModelStore, * as dataModelStore from '../shared/dataModelStore';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC, COLLECTION_MAPPING, HEADER_META, CARD_HEADER_META, CARD_HEADER_SOCIAL_META } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections, getPublicCollections, adminSetOrderForCollection, getPublicCollection, getPublicCollectionMapping, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, adminDeleteCollectionMapping, getCollectionMapping, adminDeleteCollection } from '../../queries/collection';
import Helper from '../../../../helper/utility';
import { uiStore, authStore, offeringsStore } from '../../index';


class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, adminSetOrderForCollection, getPublicCollections, getPublicCollection, adminDeleteCollection, getPublicCollectionMapping, getCollection, adminLockOrUnlockCollection, adminCollectionMappingUpsert, adminDeleteCollectionMapping, getCollectionMapping });
  }

  collectionApiHit = false;

  collectionDetails = null;

  collectionMappingsData = null;

  collections = [];

  publicCollections = [];

  initLoad = [];

  collection = {};

  collectionMapping = {};

  collectionMappingList = [];

  collectionIndex = null;

  COLLECTION_FRM = Validator.prepareFormObject(COLLECTION);

  COLLECTION_OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  COLLECTION_CONTENT_FRM = Validator.prepareFormObject(CONTENT);

  TOMBSTONE_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  HEADER_META_FRM = Validator.prepareFormObject(HEADER_META);

  CARD_HEADER_META_FRM = Validator.prepareFormObject(CARD_HEADER_META);

  CARD_HEADER_SOCIAL_FRM = Validator.prepareFormObject(CARD_HEADER_SOCIAL_META);

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
            this.setSelectedCollections(type, referenceId).then(action(() => {
              this.setFieldValue('collectionMappingList',
                get(res, 'getCollections').map(c => ({ key: c.id, text: c.name, value: c.id })));
            }));
          } else {
            this.setCollectionMetaList(get(res, 'getCollections'));
            this.setFieldValue('collections', get(res, 'getCollections'));
          }
        }
        this.setFieldValue('apiHit', false);
      });
    }
  }

  getCollections = () => {
    if (!this.collectionApiHit) {
      this.setFieldValue('publicCollections', []);
      this.executeQuery({
        clientType: authStore.isUserLoggedIn ? 'PRIVATE' : 'PUBLIC',
        query: 'getPublicCollections',
        setLoader: 'getCollections',
      }).then((res) => {
        if (get(res, 'getCollections')) {
          this.setFieldValue('publicCollections', res.getCollections);
        }
        this.setFieldValue('collectionApiHit', true);
      });
    }
  }

  setSelectedCollections = (type, referenceId, isContentMapping = false) => new Promise(async (resolve) => {
    const params = {
      type: this.getContentType(type),
      referenceId,
    };
    this.collectionMappingWrapper(params).then(action((res) => {
      this.setCollectionMetaList(get(res, 'getCollectionMapping'), isContentMapping);
      resolve();
    }));
  })

  setCollectionMetaList = (data, isContentMapping) => {
    const mappingId = isContentMapping ? 'id' : 'collectionId';
    if (data) {
      this.COLLECTION_MAPPING_FRM.fields.mappingMeta.value = [];
      const selectedCollections = data.map(c => c[mappingId]);
      this.COLLECTION_MAPPING_FRM.fields.mappingMeta.value = [
        ...this.COLLECTION_MAPPING_FRM.fields.mappingMeta.value,
        ...selectedCollections,
      ];
    }
  }


  getPublicCollection = (slug) => {
    this.setFieldValue('collectionMappingsData', null);
    this.executeQuery({
      clientType: authStore.isUserLoggedIn ? 'PRIVATE' : 'PUBLIC',
      query: 'getPublicCollection',
      setLoader: 'getCollection',
      variables: { slug },
    }).then((res) => {
      if (get(res, 'getCollection')) {
        this.setFieldValue('collectionDetails', res.getCollection);
        // if (authStore.isUserLoggedIn) {
        this.getCollectionMappingPublic(res.getCollection.id);
        // }
      }
    });
  };

  getCollectionMappingPublic = (collectionId) => {
    this.executeQuery({
      clientType: authStore.isUserLoggedIn ? 'PRIVATE' : 'PUBLIC',
      query: 'getPublicCollectionMapping',
      setLoader: 'getCollectionMapping',
      variables: { collectionId },
    }).then((res) => {
      if (get(res, 'getCollectionMapping')) {
        const data = {
          offerings: [],
          insights: [],
        };
        res.getCollectionMapping.forEach((c) => {
          if (c.referenceId === get(c.offering, 'id')) {
            data.offerings.push({ ...c.offering, sortOrder: c.order });
          } else if (c.referenceId === get(c.insight, 'id')) {
            data.insights.push({ ...c.insight, sortOrder: c.order });
          }
        });
        this.setFieldValue('collectionMappingsData', data);
      }
    });
  }

  get getCollectionLength() {
    return get(this.publicCollections, '[0]') ? this.publicCollections.length : 0;
  }

  get getActiveCollectionLength() {
    return get(this.publicCollections, '[0]') ? this.publicCollections.filter(c => c.status === 'ACTIVE').length : 0;
  }

  get getOfferingsList() {
    return get(this.collectionMappingsData, 'offerings[0]') ? toJS(get(this.collectionMappingsData, 'offerings')) : [];
  }

  get getActiveOfferingsList() {
    return orderBy(this.getOfferingsList.filter(o => ['LIVE'].includes(o.stage)), 'sortOrder', ['ASC']);
  }

  get getPastOfferingsList() {
    return orderBy(this.getOfferingsList.filter(o => ['COMPLETE', 'IN_REPAYMENT', 'STARTUP_PERIOD'].includes(o.stage)), 'sortOrder', ['ASC']);
  }

  get getInsightsList() {
    return get(this.collectionMappingsData, 'insights[0]') ? orderBy(toJS(get(this.collectionMappingsData, 'insights')), 'sortOrder', ['ASC']) : [];
  }

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    const { collection } = this;
    if (!collection) {
      return false;
    }
    if (form === 'HEADER_META_FRM') {
      const metaList = get(collection, 'marketing.content') ? collection.marketing.content.map(c => c.meta) : [];
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
    const { forms, cleanData } = params;
    let data = {};
    let collectionData = {};
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        if (f === 'COLLECTION_CONTENT_FRM') {
          // const headerFields = Validator.evaluateFormData(this.HEADER_META_FRM.fields);
          const contentObj = Validator.evaluateFormData(this[f].fields);
          // const contentWithMeta = contentObj.content.map((c, index) => {
          //   c.meta = JSON.stringify(headerFields.meta[index]);
          //   return c;
          // });
          data = { collectionDetails: { marketing: contentObj } };
        } else if (f === 'TOMBSTONE_FRM') {
          data = { collectionDetails: { marketing: { tombstone: Validator.evaluateFormData(this[f].fields) } } };
        } else if (['CARD_HEADER_META_FRM', 'CARD_HEADER_SOCIAL_FRM'].includes(f)) {
          data = { ...data, ...Validator.evaluateFormData(this[f].fields) };
          // data = { collectionDetails: { marketing: { header: Validator.evaluateFormData(this[f].fields) } } };
        } else {
          data = { collectionDetails: Validator.evaluateFormData(this[f].fields) };
        }
      });
    }

    if (cleanData) {
      data = cleanDeep(data);
      data = omitDeep(data, ['__typename', 'fileHandle']);
    }
    if (forms.includes('CARD_HEADER_META_FRM')) {
      collectionData = { collectionDetails: { marketing: { header: { ...data } } } };
    } else {
      collectionData = { ...data };
    }

    if (this.collectionId !== null) {
      collectionData.id = this.collectionId;
    }
    // if (keyName) {
    //   collectionData[keyName] = data;
    // } else {
    //   collectionData = { ...data };
    // }
    return collectionData;
  }

  parseData = (data) => {
    if (get(data, 'marketing.content')) {
      data.marketing.content.forEach((c) => {
        // eslint-disable-next-line no-param-reassign
        c.meta = JSON.parse(c.meta);
      });
    }
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
        // this.setFieldValue('collection', this.parseData(res.getCollection));
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
            const { value: contentValue } = this.COLLECTION_CONTENT_FRM.fields.content[index].contentType;
            const tempData = {};
            if (params.type === 'OFFERING') {
              data = {
                live: data.filter(d => d.offering.stage === 'LIVE').map((d) => {
                  d.offering.isAvailablePublicly = d.scope;
                  return d.offering;
                }),
                completed: data.filter(d => d.offering.stage === 'COMPLETE').map((d) => {
                  d.offering.isAvailablePublicly = d.scope;
                  return d.offering;
                }),
              };
              const stage = contentValue === 'ACTIVE_INVESTMENTS' ? 'live' : 'completed';
              offeringsStore.getOfferingsForCollection({ stage });
              this.setCollectionMetaList(data[stage], true);
              tempData[params.type] = data;
            } else if (params.type === 'INSIGHT') {
              tempData[params.type] = data.map((d) => {
                d.insight.scope = d.scope;
                return d.insight;
              });
            } else {
              tempData[params.type] = data;
            }
            this.setFieldValue('collectionIndex', index);
            this.collectionMapping = { ...tempData };
          }
        })
        .catch(() => {
          this.setFieldValue('collectionIndex', index);
        });
    } else {
      this.setFieldValue('collectionIndex', index);
    }
  }

  mapDataByContentType = data => data.map(c => ({ key: c.id, text: c.offeringSlug, value: c.id }))

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


  adminDeleteCollection = id => new Promise(async (res, rej) => {
    const variables = {
      id,
    };
    try {
      const data = await this.executeMutation({
        mutation: 'adminDeleteCollection',
        setLoader: 'adminDeleteCollection',
        variables,
      });
      window.logger(data);
      res();
    } catch (error) {
      Helper.toast('Something went wrong.', 'error');
      rej(error);
    }
  });

  adminPublishCollection = async (params) => {
    try {
      uiStore.setProgress('save');
      await this.executeMutation({
        mutation: 'adminCollectionUpsert',
        setLoader: 'adminCollectionUpsert',
        variables: { ...params },
      });
    } catch (err) {
      if (get(err, 'message')) {
        Helper.toast(get(err, 'message'), 'error');
      } else {
        Helper.toast('Something went wrong.', 'error');
      }
    }
  }

  updateContent = () => {
    if (get(this.collection, 'marketing.content')) {
      this.collection.marketing.content = [...this.collection.marketing.content,
      ...Validator.evaluateFormData(this.COLLECTION_CONTENT_FRM.fields).content,
      ];
    }
  }

  setOrderForCollections = async (newArr) => {
    try {
      let collectionItemsList = [];
      collectionItemsList = newArr.map((item, index) => ({
          id: item.id,
          order: index + 1,
        }));
      await this.executeMutation({
        mutation: 'adminSetOrderForCollection',
        setLoader: 'adminSetOrderForCollection',
        variables: { collectionItemsList },
      });
      this.initRequest();
      return true;
    } catch (err) {
      uiStore.setProgress(false);
      if (get(err, 'message')) {
        Helper.toast(get(err, 'message'), 'error');
      } else {
        Helper.toast('Something went wrong.', 'error');
      }
      return false;
    }
  }

  collectionMappingMutation = (mutation, params, additionalParams = {}) => new Promise(async (res, rej) => {
    const { isContentMapping, id } = additionalParams;
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
      if (isContentMapping) {
        if (mutation === 'adminDeleteCollectionMapping') {
          runInAction(() => {
            this.collectionMapping.OFFERING.live = this.collectionMapping.OFFERING.live.filter(c => c.id !== id);
          });
        }
      }
      res();
    } catch (error) {
      rej(error);
      Helper.toast('Something went wrong.', 'error');
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

      if (['TOMBSTONE_FRM', 'CARD_HEADER_META_FRM', 'CARD_HEADER_SOCIAL_FRM'].includes(params.forms[0])) {
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

  reOrderHandle = (orderedForm, form, arrayName) => {
    const content = toJS(orderedForm).map(d => ({ ...d }));
    this.setFieldValue(form, content, `fields.${arrayName}`);
  }

  getCaseSensetiveFieldvalue = (formValue, caseValue) => {
    if (caseValue === 'LOWERCASE') {
      formValue.toLowerCase();
    }

    if (caseValue === 'CAPITAL') {
      formValue.toUpperCase();
    }
  }

  // @computed get active() {
  //   const collectionList = this.orderedActiveList.slice();
  //   return collectionList.splice(0, this.activeToDisplay);
  // }
}
decorate(CollectionsStore, {
  ...dataModelStore.decorateDefault,
  collections: observable,
  publicCollections: observable,
  collectionMappingsData: observable,
  collectionApiHit: observable,
  getOfferingsList: computed,
  getInsightsList: computed,
  collectionDetails: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  COLLECTION_CONTENT_FRM: observable,
  COLLECTION_MAPPING_FRM: observable,
  collectionMapping: observable,
  collectionMappingList: observable,
  collectionId: observable,
  collectionIndex: observable,
  HEADER_META_FRM: observable,
  TOMBSTONE_FRM: observable,
  contentId: observable,
  collection: observable,
  initLoad: observable,
  initRequest: action,
  updateContent: action,
  upsertCollection: action,
  setCollectionMetaList: action,
  getActiveCollectionLength: computed,
  getCollectionLength: computed,
  filterInitLoad: action,
  collectionMappingMutation: action,
  parseData: action,
  setFormData: action,
  getActionType: action,
  setSelectedCollections: action,
  collectionLoading: observable,
  getCollection: action,
  CARD_HEADER_META_FRM: observable,
  CARD_HEADER_SOCIAL_FRM: observable,
  reOrderHandle: action,
  getCaseSensetiveFieldvalue: action,
});
export default new CollectionsStore();
