/* eslint-disable max-len */
import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import { isArray, orderBy, find, map, filter, get, kebabCase, remove } from 'lodash';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { KNOWLEDGE_BASE, CATEGORY_TYPES } from '../../../constants/admin/knowledgeBase';
import { getKnowledgeBaseDetails, getKnowledgeBaseById, createKnowledgeBase, updateKnowledgeBase, deleteKBById, getAllKnowledgeBaseByFilters, updateKnowledgeBaseItem, deleteKnowledgeBaseItem, setOrderForKnowledgeBase } from '../../queries/knowledgeBase';
import { getCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';

export class KnowledgeBaseStore {
  @observable data = [];
  @observable Categories = [];
  @observable CategoryList = [];
  @observable article = null;
  @observable KNOWLEDGE_BASE_FRM = Validator.prepareFormObject(KNOWLEDGE_BASE);
  @observable categoryDDList = Validator.prepareFormObject(CATEGORY_TYPES);
  @observable filters = false;
  @observable globalAction = '';
  @observable selectedRecords = [];
  @observable LOADING = false;
  @observable isReadOnly = true;
  @observable defaultUserType = 'ISSUER_KB';
  @observable confirmBox = {
    entity: '',
    refId: '',
  };
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: {},
  };
  @observable db;
  @observable categoriesLoaded = false;

  @action
  setGlobalAction = (name, globalAction) => {
    this[name] = globalAction;
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  resetSearch = () => {
    this.requestState.search = {};
  }
  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }
  @action
  removeFilter = (name) => {
    delete this.requestState.search[name];
    this.initRequest();
  }
  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.initiateSearch(srchParams);
  }

  @action
  setSearchFilters = (name, value) => {
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      this.requestState.search[name] = value;
    } else {
      delete this.requestState.search[name];
    }
  }
  @action
  initiateSearch = (srchParams, getAllUsers = false) => {
    this.requestState.search = srchParams;
    this.applyFilter(null, getAllUsers);
  }

  @action
  getKnowledgeBase = (id, isPublic = true) => {
    this.resetSearch();
    this.toggleSearch();
    const query = isPublic ? getKnowledgeBaseDetails : getKnowledgeBaseById;
    const apiClient = isPublic ? clientPublic : client;
    this.data = graphql({
      client: apiClient,
      query,
      variables: { id },
      onFetch: (res) => {
        if (res && res.knowledgeBaseById && res.knowledgeBaseById !== null) {
          this.setFormData(res.knowledgeBaseById);
        } else {
          Helper.toast('Invalid knowledge base id', 'error');
        }
      },
      onError: (err) => {
        Helper.toast(`${err} Error`, 'error');
      },
    });
  }

  @action
  save = (id, status, isDraft = false) => new Promise((resolve, reject) => {
    uiStore.setProgress();
    this.KNOWLEDGE_BASE_FRM.fields.itemStatus.value = status;
    const data = Validator.ExtractValues(this.KNOWLEDGE_BASE_FRM.fields);
    const payload = id === 'new' ? { payload: data } : { payload: data, id };
    payload.isPartial = isDraft;

    client
      .mutate({
        mutation: id === 'new' ? createKnowledgeBase : updateKnowledgeBase,
        variables: payload,
      })
      .then(() => {
        Helper.toast(id === 'new' ? 'Knowledge base added successfully.' : 'Knowledge base updated successfully.', 'success');
        resolve();
      })
      .catch((res) => {
        Helper.toast(`${res} Error`, 'error');
        reject();
      })
      .finally(() => uiStore.setProgress(false));
  })

  @computed get AllKnowledgeBase() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
    // return this.sortBydate(list);
  }

  sortBydate = data => orderBy(orderBy(data, o => (o.updated.date ? new Date(o.updated.date) : ''), ['desc']), d => d.order, ['asc'])

  @computed get count() {
    return (this.data.data && this.data.data.knowledgeBaseByFilters &&
      this.data.data.knowledgeBaseByFilters.length) || 0;
  }

  @computed get getSelectedRecords() {
    return toJS(this.selectedRecords);
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @computed get page() {
    return this.requestState.perPage || 1;
  }

  @action selectRecordsOnPage = (isChecked) => {
    if (isChecked) {
      const data = this.db.slice(this.requestState.skip, this.requestState.displayTillIndex) || [];
      data.forEach((d) => {
        if (!this.selectedRecords.includes(d.id)) {
          this.selectedRecords.push(d.id);
        }
      });
      this.isReadOnly = false;
    } else {
      this.selectedRecords = [];
      this.isReadOnly = true;
    }
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
  }

  @computed get knowledgeBase() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get knowledgeBaseOptionText() {
    const res = find(this.categoriesDropdown, c => find(c.options, e =>
      e.value === this.requestState.search.categoryId));
    return find(get(res, 'options') || [], d =>
      d.value === this.requestState.search.categoryId);
    // return find(find(this.categoriesDropdown, c => find(c.options, e =>
    //   e.value === this.requestState.search.categoryId)), d =>
    //   d.value === this.requestState.search.categoryId);
  }

  @action
  getCategoryList = (isPublic = true) => {
    const apiClient = isPublic ? clientPublic : client;
    this.Categories = graphql({
      client: apiClient,
      query: getCategories(isPublic),
      variables: { types: ['INVESTOR_KB', 'ISSUER_KB'] },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && !this.Categories.loading) {
          this.setGlobalAction('categoriesLoaded', true);
        }
      },
    });
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get categoryLoading() {
    return this.Categories.loading;
  }

  @computed get disableApply() {
    return this.isReadOnly;
  }

  @action
  reset = () => {
    this.KNOWLEDGE_BASE_FRM = Validator.prepareFormObject(KNOWLEDGE_BASE);
  }
  @action
  htmlContentChange = (field, value) => {
    this.KNOWLEDGE_BASE_FRM.fields[field].value = value;
    Validator.validateForm(this.KNOWLEDGE_BASE_FRM);
  }
  @action
  knowledgeBaseChange = (e, result) => {
    this.KNOWLEDGE_BASE_FRM = Validator.onChange(
      this.KNOWLEDGE_BASE_FRM,
      Validator.pullValues(e, result),
    );
    if (result.name === 'title') {
      const formValue = { value: kebabCase(result.value), name: 'slug' };
      this.KNOWLEDGE_BASE_FRM = Validator.onChange(
        this.KNOWLEDGE_BASE_FRM,
        Validator.pullValues(e, formValue),
      );
    }
  };
  @action
  maskChange = (values, field) => {
    if (moment(values.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      const isoDate = field === 'startDate' ? moment(new Date(values.formattedValue)).toISOString() :
        moment(new Date(values.formattedValue)).add(1, 'day').toISOString();
      this.setInitiateSrch(field, isoDate);
    } else {
      this.setInitiateSrch(field, values.value);
    }
  }

  @computed get categoriesList() {
    return (this.Categories.data && this.Categories.data.categories &&
      toJS(this.Categories.data.categories)) || [];
  }

  @computed get getCategories() {
    return filter(map(this.categoriesList, c =>
      ((c.categoryType === `${this.KNOWLEDGE_BASE_FRM.fields.userType.value}_KB`) ?
        { key: c.categoryName, value: c.id, text: c.categoryName } : false)), d => d);
  }
  @computed get categoriesDropdown() {
    const categoriesArray = [];
    if (this.Categories.data && this.Categories.data.categories) {
      this.Categories.data.categories.map((ele) => {
        categoriesArray.push({ key: ele.categoryName, value: ele.id, text: ele.categoryName });
        return categoriesArray;
      });
      return categoriesArray;
    }
    return null;
  }
  @action
  userTypeChange = (e, result) => {
    this.KNOWLEDGE_BASE_FRM = Validator.onChange(
      this.KNOWLEDGE_BASE_FRM,
      Validator.pullValues(e, result),
    );
  }
  @action
  setFormData = (formData) => {
    Object.keys(this.KNOWLEDGE_BASE_FRM.fields).map(action((key) => {
      this.KNOWLEDGE_BASE_FRM.fields[key].value = formData[key];
    }));
    Validator.validateForm(this.KNOWLEDGE_BASE_FRM);
  }
  @action
  resetFormData = (form) => {
    const resettedForm = Validator.resetFormData(this[form]);
    this[form] = resettedForm;
  }
  @action
  deleteKBById = (id) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteKBById,
        variables: {
          id,
        },
        refetchQueries: [{ query: getAllKnowledgeBaseByFilters }],
      })
      .then(() => Helper.toast('Knowledge base item deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting knowledge base ', 'error'))
      .finally(() => uiStore.setProgress());
  }
  @action
  setConfirmBox = (entity, refId) => {
    this.confirmBox.entity = entity;
    this.confirmBox.refId = refId;
  }
  @action
  setDb = (data) => {
    const d = map(data, (dd) => {
      const de = { teamId: dd.id, ...dd };
      return de;
    });
    this.db = ClientDb.initiateDb(d, true);
  }

  @action
  initRequest = () => {
    this.resetSearch();
    this.toggleSearch();
    this.data = graphql({
      client,
      query: getAllKnowledgeBaseByFilters,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && !this.data.loading) {
          // this.requestState.page = 1;
          // this.requestState.skip = 0;
          // this.requestState.displayTillIndex = 10;
          this.setDb(this.sortBydate(res.knowledgeBaseByFilters));
        }
      },
    });
  }

  @action
  applyFilter = (reqParams, getAllUsers = false) => {
    const {
      keyword,
      categoryId,
      itemStatus,
      authorName,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    const params = {
      title: keyword,
      categoryId,
      itemStatus,
      authorName,
      page: reqParams ? reqParams.page : 1,
      limit: getAllUsers ? 100 : this.requestState.perPage,
    };

    this.requestState.page = params.page || 1;
    this.data = graphql({
      client,
      query: getAllKnowledgeBaseByFilters,
      variables: params,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        // this.resetSearch();
        if (res && !this.data.loading) {
          this.requestState.page = params.page || 1;
          this.requestState.skip = params.skip || 0;
          this.setDb(this.sortBydate(res.knowledgeBaseByFilters));
        }
      },
    });
  }

  @action
  addSelectedRecords = (id) => {
    this.isReadOnly = false;
    if (!this.selectedRecords.includes(id)) {
      this.selectedRecords.push(id);
    }
  }

  @action
  removeSelectedRecords = (id) => {
    remove(this.selectedRecords, e => e === id);
    if (this.selectedRecords && this.selectedRecords.length <= 0) {
      this.isReadOnly = true;
    }
  }

  @computed get selectedRecordsCount() {
    console.log('inside selectedRecordsCount');
    return this.selectedRecords.length || 0;
  }

  @action
  applyGlobalAction = () => {
    const idArr = this.selectedRecords;
    const status = this.globalAction;
    this.data.loading = true;
    if (status === 'delete') {
      this.deleteRecords(idArr);
    } else {
      this.updateRecordStatus(idArr, status);
    }
  }

  @action
  resetSelectedRecords = () => {
    this.selectedRecords = [];
    this.isReadOnly = true;
    this.globalAction = '';
  }

  updateRecordStatus = (id, status) => {
    client.mutate({
      mutation: updateKnowledgeBaseItem,
      variables: {
        id,
        status,
      },
      refetchQueries: [{ query: getAllKnowledgeBaseByFilters }],
    }).then(() => {
      this.resetSelectedRecords();
      Helper.toast('Status updated successfully.', 'success');
    }).catch(() => {
      this.resetSelectedRecords();
      Helper.toast('Error while updating status.', 'error');
    });
  }

  deleteRecords = (id) => {
    client.mutate({
      mutation: deleteKnowledgeBaseItem,
      variables: {
        id,
      },
      refetchQueries: [{ query: getAllKnowledgeBaseByFilters }],
    }).then(() => {
      this.resetSelectedRecords();
      Helper.toast('Records deleted successfully.', 'success');
    }).catch(() => {
      this.resetSelectedRecords();
      Helper.toast('Error while deleting records.', 'error');
    });
  }

  @action
  setKnowledgeBaseOrder = (newArr) => {
    uiStore.setProgress();
    const data = [];
    newArr.forEach((item, index) => {
      const i = this.requestState.skip + index;
      data.push({
        id: item.id,
        order: i + 1,
      });
      // eslint-disable-next-line no-param-reassign
      newArr[index].order = i + 1;
    });
    this.setDb(newArr);
    this.data.loading = true;
    client
      .mutate({
        mutation: setOrderForKnowledgeBase,
        variables: { knowledgeBaseItemsList: data },
        refetchQueries: [{ query: getAllKnowledgeBaseByFilters }],
      }).then(() => {
        Helper.toast('Order updated successfully.', 'success');
      }).catch(() => {
        Helper.toast('Error while updating order', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
  @computed get allCategorizedKnowledgeBase() {
    const arrKnowledgeBase = [];
    if (this.db && this.db.length) {
      this.db.forEach((knowledgeBase) => {
        if (arrKnowledgeBase[knowledgeBase.userType]) {
          if (arrKnowledgeBase[knowledgeBase.userType][knowledgeBase.categoryId]) {
            arrKnowledgeBase[knowledgeBase.userType][knowledgeBase.categoryId].push(knowledgeBase);
          } else {
            arrKnowledgeBase[knowledgeBase.userType][knowledgeBase.categoryId] = [];
            arrKnowledgeBase[knowledgeBase.userType][knowledgeBase.categoryId].push(knowledgeBase);
          }
        } else {
          arrKnowledgeBase[`${knowledgeBase.userType}`] = [];
          arrKnowledgeBase[`${knowledgeBase.userType}`][`${knowledgeBase.categoryId}`] = [];
          arrKnowledgeBase[`${knowledgeBase.userType}`][`${knowledgeBase.categoryId}`].push(knowledgeBase);
        }
      });
    }
    return arrKnowledgeBase;
  }
}


export default new KnowledgeBaseStore();
