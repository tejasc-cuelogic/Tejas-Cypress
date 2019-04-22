import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import map from 'lodash/map';
import { isArray } from 'lodash';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { ARTICLES, ARTICLE_STATUS_VALUES } from '../../../constants/admin/knowledgeBase';
import { getArticleDetails, getArticleById, createKnowledgeBase, updateKnowledgeBase, getAllKnowledgeBase, deleteKBById, getAllKnowledgeBaseByFilters } from '../../queries/knowledgeBase';
import { getCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';

export class KnowledgeBaseStore {
  @observable data = [];
  @observable Categories = [];
  @observable article = null;
  @observable ARTICLE_FRM = Validator.prepareFormObject(ARTICLES);
  @observable featuredData = [];
  @observable featuredCategoryId = '406735f5-f83f-43f5-8272-180a1ea570b0';
  @observable filters = false;
  @observable ID_VERIFICATION_FRM = Validator.prepareFormObject(ARTICLE_STATUS_VALUES);
  @observable globalAction = '';
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

  @action
  setGlobalAction = (name, globalAction) => {
    this[name] = globalAction;
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  resetData = () => {
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
    this.initRequest(null, getAllUsers);
  }

  @action
  requestAllArticles = (isPublic = true, sortAsc = false, categoryId = null) => {
    this.resetData();
    const apiClient = isPublic ? clientPublic : client;
    this.data = graphql({
      client: apiClient,
      query: getAllKnowledgeBase,
      fetchPolicy: 'network-only',
      variables: { sortByCreationDateAsc: sortAsc, categoryId },
    });
  }

  @action
  getArticle = (id, isPublic = true) => {
    this.resetData();
    this.toggleSearch();
    const query = isPublic ? getArticleDetails : getArticleById;
    const apiClient = isPublic ? clientPublic : client;
    this.article = graphql({
      client: apiClient,
      query,
      variables: { id },
      onFetch: (res) => {
        if (!isPublic && res) {
          Object.keys(this.ARTICLE_FRM.fields).map((key) => {
            this.ARTICLE_FRM.fields[key].value = res.knowledgeBaseById[key];
            return null;
          });
          Validator.validateForm(this.ARTICLE_FRM);
        }
      },

    });
  }

  @action
  save = (id) => {
    const data = Validator.ExtractValues(this.ARTICLE_FRM.fields);
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
    return (this.data.data && (toJS(this.data.data.knowledgeBaseByFilters)
      || toJS(this.data.data.knowledgeBaseItems))) || [];
  }

  @computed get articleLoading() {
    return this.article.loading;
  }

  @computed get count() {
    return (this.db && this.db.length) || 0;
  }

  @computed get totalRecords() {
    return (this.data.data && this.data.data.knowledgeBaseItems &&
      this.data.data.knowledgeBaseItems.length) || 0;
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @computed get knowledgeBase() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @action
  getCategoryList = (isPublic = true) => {
    const apiClient = isPublic ? clientPublic : client;
    this.Categories = graphql({
      client: apiClient,
      query: getCategories(isPublic),
      variables: { types: ['INVESTOR_KB', 'ISSUER_KB'] },
      fetchPolicy: 'network-only',
    });
  }

  @computed get loading() {
    return this.data.loading;
  }
  @action
  reset = () => {
    this.ARTICLE_FRM = Validator.prepareFormObject(ARTICLES);
  }
  @action
  htmlContentChange = (field, value) => {
    this.ARTICLE_FRM.fields[field].value = value;
    Validator.validateForm(this.ARTICLE_FRM);
  }
  @action
  articleChange = (e, result) => {
    this.ARTICLE_FRM = Validator.onChange(this.ARTICLE_FRM, Validator.pullValues(e, result));
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
  @computed get categoriesDropdown() {
    console.log(this.Categories);
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
  personalInfoChange = (e, result) => {
    this.ARTICLE_FRM = Validator.onChange(
      this.ARTICLE_FRM,
      Validator.pullValues(e, result),
    );
  };
  @action
  userTypeChange = (e, result) => {
    this.ARTICLE_FRM = Validator.onChange(
      this.ARTICLE_FRM,
      Validator.pullValues(e, result),
    );
  }
  @action
  deleteKBById = (id) => {
    client
      .mutate({
        mutation: deleteKBById,
        variables: {
          id,
        },
        refetchQueries: [{ query: getAllKnowledgeBase }],
      })
      .then(() => Helper.toast('Knowledge base deleted successfully.', 'success'))
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
  initRequest = (reqParams, getAllUsers = false) => {
    const {
      keyword,
      categoryId,
      itemStatus,
      authorId,
    } = this.requestState.search;
    // const filters = toJS({ ...this.requestState.search });
    const params = {
      title: keyword,
      categoryId,
      itemStatus,
      authorId,
      page: reqParams ? reqParams.page : 1,
      limit: getAllUsers ? 100 : this.requestState.perPage,
    };

    this.requestState.page = params.page;
    this.data = graphql({
      client,
      query: getAllKnowledgeBaseByFilters,
      variables: params,
      fetchPolicy: 'network-only',
    });
  }
}


export default new KnowledgeBaseStore();
