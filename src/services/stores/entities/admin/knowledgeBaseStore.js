import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
// import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
// import { uniqWith, isEqual, map } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { ARTICLES, ARTICLE_STATUS_VALUES } from '../../../constants/admin/knowledgeBase';
import { getArticleDetails, getArticleDetailsBySlug, getArticlesByCatId, getArticleById, createKnowledgeBase, updateKnowledgeBase, getAllKnowledgeBase, deleteKBById } from '../../queries/knowledgeBase';
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
  @observable requestState = {
    search: {},
  };
  @observable globalAction = '';
  @observable confirmBox = {
    entity: '',
    refId: '',
  };
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 50,
    displayTillIndex: 50,
    filters: false,
    search: {
    },
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
  setInitiateSrch = (keyword, value) => {
    this.requestState.search[keyword] = value;
    this.initiateFilters();
  }
  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    if (keyword) {
      resultArray = ClientDb.filterData('memberName', keyword, 'likenocase');
      this.setDb(uniqWith(resultArray, isEqual));
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.data.data.knowledgeBaseItems);
    }
  }

  @action
  requestAllArticles = (isPublic = true, sortAsc = false, categoryId = null) => {
    const apiClient = isPublic ? clientPublic : client;
    this.data = graphql({
      client: apiClient,
      query: getAllKnowledgeBase,
      fetchPolicy: 'network-only',
      variables: { sortByCreationDateAsc: sortAsc, categoryId },
    });
  }

  @action
  requestArticlesByCategoryId = (id) => {
    this.data = graphql({ client: clientPublic, query: getArticlesByCatId, variables: { id } });
  }

  @action
  getArticle = (id, isPublic = true) => {
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

  @action
  featuredRequestArticlesByCategoryId = () => {
    const id = this.featuredCategoryId;
    this.featuredData =
      graphql({ client: clientPublic, query: getArticlesByCatId, variables: { id } });
  }

  @action
  getArticleDetailsBySlug = (slug) => {
    this.article = graphql({
      client: clientPublic,
      query: getArticleDetailsBySlug,
      variables: { slug },
    });
  }

  @computed get InsightArticles() {
    return (this.data.data && (toJS(this.data.data.knowledgeBaseByFilters)
    || toJS(this.data.data.knowledgeBaseItems))) || [];
  }
  @computed get InsightFeaturedArticles() {
    return (this.data.data && (toJS(this.data.data.knowledgeBaseByFilters)
    || toJS(this.data.data.knowledgeBaseItems))) || [];
  }

  @computed get ArticlesDetails() {
    return (this.article.data && toJS(this.article.data.insightArticleBySlug)) || null;
  }

  @computed get articleLoading() {
    return this.article.loading;
  }

  @action
  getCategoryList = (isPublic = true) => {
    const apiClient = isPublic ? clientPublic : client;
    this.Categories = graphql({
      client: apiClient,
      query: getCategories(isPublic),
      variables: { types: ['INSIGHTS'] },
      fetchPolicy: 'network-only',
    });
  }

  @computed get InsightCategories() {
    const iMap = { categoryName: 'title', id: 'to' };
    const categories = (this.Categories.data && toJS(this.Categories.data.categories)) || [];
    const categoryRoutes = map(categories, i => mapKeys(i, (v, k) => iMap[k] || k));
    const categoryRoutesModified = map(categoryRoutes, c => mapValues(c, (v, k) => (k === 'to' ? `category/${v}` : v)));
    return categoryRoutesModified;
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
}


export default new KnowledgeBaseStore();
