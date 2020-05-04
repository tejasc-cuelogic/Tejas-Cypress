import { decorate, observable, action, computed, toJS } from 'mobx';
import { get } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import { COLLECTION, OVERVIEW, CONTENT, TOMBSTONE_BASIC } from '../../../constants/admin/collection';
import { adminCollectionUpsert, getCollections, getCollection, getCollectionMapping } from '../../queries/collection';
import Helper from '../../../../helper/utility';

import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import authStore from '../shared/authStore';

class CollectionsStore extends DataModelStore {
  constructor() {
    super({ adminCollectionUpsert, getCollections, getCollection, getCollectionMapping });
  }

  collectionDetails = null;

  collectionMappingsData = null;

  collections = [
    {
      id: '1111',
      name: 'Cevitas',
      slug: 'chetan-b',
      order: 2,
      previewPassword: 'nextseedTest',
      lock: false,
      marketing: {
        tombstone: {
          image: 'group/ns-securities.jpg',
          bgColor: 'green',
          title: 'Invest with Cevitas Capital',
          description: 'lorem ipsum some random words to fill out some space and look like there\'s an actual text for the description. It\'s all nothing but random text',
          tag: {
            color: 'blue',
            text: 'New',
          },
        },
      },
    },
    {
      id: '1112',
      name: 'Houston Angel Network (HAN)',
      slug: 'chetan-b',
      order: 3,
      previewPassword: 'nextseedTest',
      lock: false,
      marketing: {
        tombstone: {
          image: 'group/ns-securities.jpg',
          bgColor: 'green',
          title: 'Houston Angel Network (HAN)',
          description: 'lorem ipsum some random words to fill out some space and look like there\'s an actual text for the description. It\'s all nothing but random text',
          tag: {
            color: 'blue',
            text: 'New',
          },
        },
      },
    },
    {
      id: '1113',
      name: 'Houston, Tx',
      slug: 'chetan-b',
      order: 4,
      previewPassword: 'nextseedTest',
      lock: false,
      marketing: {
        tombstone: {
          image: 'group/ns-securities.jpg',
          bgColor: 'green',
          title: 'Houston, Tx',
          description: 'lorem ipsum some random words to fill out some space and look like there\'s an actual text for the description. It\'s all nothing but random text',
          tag: {
            color: 'blue',
            text: 'New',
          },
        },
      },
    },
    {
      id: '1114',
      name: 'NextSeed Securities',
      slug: 'chetan-b',
      order: 5,
      previewPassword: 'nextseedTest',
      lock: false,
      marketing: {
        tombstone: {
          image: 'group/ns-securities.jpg',
          bgColor: 'green',
          title: 'NextSeed Securities',
          description: 'lorem ipsum some random words to fill out some space and look like there\'s an actual text for the description. It\'s all nothing but random text',
          tag: {
            color: 'blue',
            text: 'New',
          },
        },
      },
    },
  ];

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

  getCollection = (slug) => {
    this.setFieldValue('collectionMappingsData', null);
    this.executeQuery({
      clientType: 'PUBLIC',
      query: 'getCollection',
      setLoader: 'getCollection',
      variables: { slug },
    }).then((res) => {
      if (get(res, 'getCollection')) {
        this.setFieldValue('collectionDetails', res.getCollection);
        if (authStore.isUserLoggedIn) {
          this.getCollectionMappingPublic(res.getCollection.id);
          // this.getCollectionMapping(res.getCollection.id, 'INSIGHT');
        }
      }
    });
  };

  getCollectionMappingPublic = (collectionId) => {
    this.executeQuery({
      query: 'getCollectionMapping',
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

  get getOfferingsList() {
    return get(this.collectionMappingsData, 'offerings[0]') ? toJS(get(this.collectionMappingsData, 'offerings')) : [];
  }

  get getInsightsList() {
    return get(this.collectionMappingsData, 'insights[0]') ? toJS(get(this.collectionMappingsData, 'insights')) : [];
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

  // @computed get active() {
  //   const collectionList = this.orderedActiveList.slice();
  //   return collectionList.splice(0, this.activeToDisplay);
  // }
}
decorate(CollectionsStore, {
  ...decorateDefault,
  collections: observable,
  collectionMappingsData: observable,
  getOfferingsList: computed,
  getInsightsList: computed,
  collectionDetails: observable,
  PARTNER_FRM: observable,
  OVERVIEW_FRM: observable,
  contentId: observable,
  initRequest: action,
  upsertCollection: action,
});
export default new CollectionsStore();
