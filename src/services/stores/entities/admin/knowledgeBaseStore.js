import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import { isArray, orderBy, find, map, filter, get } from 'lodash';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { KNOWLEDGE_BASE, CATEGORY_TYPES } from '../../../constants/admin/knowledgeBase';
import { getKnowledgeBaseDetails, getKnowledgeBaseById, createKnowledgeBase, updateKnowledgeBase, deleteKBById, getAllKnowledgeBaseByFilters, updateKnowledgeBaseItem, deleteKnowledgeBaseItem } from '../../queries/knowledgeBase';
import { getCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';

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
          Object.keys(this.KNOWLEDGE_BASE_FRM.fields).map((key) => {
            this.KNOWLEDGE_BASE_FRM.fields[key].value = res.knowledgeBaseById[key];
            return null;
          });
          Validator.validateForm(this.KNOWLEDGE_BASE_FRM);
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
  save = (id) => {
    const data = Validator.ExtractValues(this.KNOWLEDGE_BASE_FRM.fields);
    client
      .mutate({
        mutation: id === 'new' ? createKnowledgeBase : updateKnowledgeBase,
        variables: id === 'new' ? { payload: data } :
          { ...{ payload: data }, id },
      })
      .then(() => {
        Helper.toast(id === 'new' ? 'Knowledge base added successfully.' : 'Knowledge base updated successfully.', 'success');
      })
      .catch(res => Helper.toast(`${res} Error`, 'error'));
  }

  @computed get AllKnowledgeBase() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
    // return this.sortBydate(list);
  }

  sortBydate = data => orderBy(data, o => (o.updated.date ? moment(new Date(o.updated.date)) : ''), ['desc'])

  @computed get count() {
    return (this.data.data && this.data.data.knowledgeBaseByFilters &&
      this.data.data.knowledgeBaseByFilters.length) || 0;
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
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
    const categoriesArray = {};
    if (this.Categories.data && this.Categories.data.categories) {
      this.Categories.data.categories.map((ele) => {
        if (!categoriesArray[ele.categoryType]) {
          categoriesArray[ele.categoryType] = [];
        }

        categoriesArray[ele.categoryType].push({
          key: ele.categoryName,
          value: ele.id,
          text: ele.categoryName,
          header: ele.categoryType,
        });

        return categoriesArray;
      });
      return map(categoriesArray, (c, k) => ({ title: CATEGORY_TYPES[k], options: c }));
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
  resetFormData = (form) => {
    const resettedForm = Validator.resetFormData(this[form]);
    this[form] = resettedForm;
  }
  @action
  deleteKBById = (id) => {
    client
      .mutate({
        mutation: deleteKBById,
        variables: {
          id,
        },
        refetchQueries: [{ query: getAllKnowledgeBaseByFilters }],
      })
      .then(() => Helper.toast('Knowledge base item deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting knowledge base ', 'error'));
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
          this.requestState.page = 1;
          this.requestState.skip = 0;
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
      authorId,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    const params = {
      title: keyword,
      categoryId,
      itemStatus,
      authorId,
      page: reqParams ? reqParams.page : 1,
      limit: getAllUsers ? 100 : this.requestState.perPage,
    };

    if (itemStatus && itemStatus === 'All') {
      delete (params.itemStatus);
    }

    if (authorId && authorId === 'All') {
      delete (params.authorId);
    }

    this.requestState.page = params.page || 1;
    this.data = graphql({
      client,
      query: getAllKnowledgeBaseByFilters,
      variables: params,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
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
    this.selectedRecords.push(id);
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
}


export default new KnowledgeBaseStore();
