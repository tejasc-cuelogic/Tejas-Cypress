import { action, computed, toJS, decorate, observable } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import { map, kebabCase, sortBy, remove, orderBy, filter, get, join, pick } from 'lodash';
import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { ARTICLES, THUMBNAIL_EXTENSIONS, SOCIAL } from '../../../constants/admin/article';
import { getArticleDetailsBySlug, adminDeleteArticle, allInsightArticles, getArticleDetails, adminInsightsArticle, adminCreateArticle, adminUpdateArticleInfo, adminInsightArticlesListByFilter } from '../../queries/insightArticle';
import { getCategories, adminCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';
import { uiStore, commonStore } from '../..';
import { fileUpload } from '../../../actions';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

export class ArticleStore extends DataModelStore {
  data = [];

  Categories = [];

  article = null;

  ARTICLE_FRM = Validator.prepareFormObject(ARTICLES);

  ARTICLE_MISC_FRM = Validator.prepareFormObject(SOCIAL);

  featuredData = [];

  featuredCategoryId = '406735f5-f83f-43f5-8272-180a1ea570b0';

  filters = false;

  currentArticleId = null;

  globalAction = '';

  allInsightsList = [];

  db = [];

  selectedRecords = [];

  isReadOnly = true;

  requestState = {
    filters: false,
    search: {},
  };

  sortOrder = {
    column: null,
    direction: 'asc',
  }

  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initiateFilters();
  }

  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.requestState.page = 1;
    this.initiateSearch(srchParams);
  }

  initiateFilters = () => {
    const { title } = this.requestState.search;
    if (title) {
      this.setDb(this.sortBydate(this.allInsightsListing));
      ClientDb.filterFromNestedObjs(['title', 'category', 'author'], title);
      this.db = ClientDb.getDatabase();
    } else {
      this.setDb(this.sortBydate(this.allInsightsListing));
    }
  }

  setGlobalAction = (name, globalAction) => {
    this[name] = globalAction;
  }

  toggleSearch = () => {
    this.filters = !this.filters;
  }

  requestAllArticles = (isPublic = true, sortAsc = false, categoryId = null) => {
    const apiClient = isPublic ? clientPublic : client;
    this.data = graphql({
      client: apiClient,
      query: allInsightArticles,
      fetchPolicy: 'network-only',
      variables: { sortByCreationDateAsc: sortAsc, categoryId },
    });
  }

  getSingleInsightAdmin = (id) => {
    this.article = graphql({
      client,
      query: adminInsightsArticle,
      variables: { id },
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && res.adminInsightsArticle) {
          this.setForm(res.adminInsightsArticle);
          this.setMiscFormData(res.adminInsightsArticle);
        }
      },
    });
  }

  setFormData = (id) => {
    const formData = this.adminInsightList.find(obj => obj.id === id);
    this.ARTICLE_FRM = Validator.setFormData(
      this.ARTICLE_FRM,
      formData,
    );
    if (formData && formData.featuredImage) {
      this.ARTICLE_FRM.fields.featuredImage.preSignedUrl = formData.featuredImage;
      this.ARTICLE_FRM.fields.featuredImage.value = formData.featuredImage;
    }
    Validator.validateForm(this.ARTICLE_FRM);
  }

  setForm = (res) => {
    Validator.validateForm(this.ARTICLE_FRM);
    // if (!this.article.loading) {
    Object.keys(this.ARTICLE_FRM.fields).map((key) => {
      if (key === 'featuredImage') {
        this.ARTICLE_FRM.fields[key].preSignedUrl = res[key];
        this.ARTICLE_FRM.fields[key].value = res[key];
      } else if (key === 'tags') {
        this.ARTICLE_FRM.fields[key].value = join(res.tags, ',');
      } else {
        this.ARTICLE_FRM.fields[key].value = res[key];
      }
      return null;
    });
    Validator.validateForm(this.ARTICLE_FRM);
    // }
  }

  setThumbnail(attr, value, field) {
    this.ARTICLE_FRM.fields[field][attr] = value;
  }

  save = (id, status, isDraft = false) => new Promise((resolve, reject) => {
    uiStore.setProgress();
    this.ARTICLE_FRM.fields.articleStatus.value = status;
    const data = Validator.ExtractValues(this.ARTICLE_FRM.fields);
    if (data.minuteRead === null || data.minuteRead === '') {
      delete (data.minuteRead);
    }
    const payload = { ...data };
    payload.tags = payload.tags.split(',').filter(tag => tag !== '');
    client
      .mutate({
        mutation: id === 'new' ? adminCreateArticle : adminUpdateArticleInfo,
        variables: id === 'new' ? { payload, isPartial: isDraft } : { payload, id, isPartial: isDraft },
      }).then(() => {
        Helper.toast('Category Saved successfully.', 'success');
        resolve();
      }).catch(() => {
        Helper.toast('Error while Saving Category', 'error');
        reject();
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  });

  toggleArticleVisibility = (id, payload) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: adminUpdateArticleInfo,
        variables: { payload, id },
      }).then(() => {
        Helper.toast('Article visibility Updated successfully.', 'success');
      }).catch(() => {
        Helper.toast('Error while Updating article visibility', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  sortBydate = data => orderBy(data, o => (o.updated.date ? new Date(o.updated.date) : ''), ['desc'])

  sortArticlesByFilter = () => {
    this.allInsightsList = graphql({
      client,
      query: adminInsightArticlesListByFilter,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && res.adminInsightArticlesListByFilter) {
          this.setDb(this.sortBydate(res.adminInsightArticlesListByFilter));
        }
      },
    });
  }

  setSortingOrder = (column = null, direction = null) => {
    this.sortOrder.column = column;
    this.sortOrder.direction = direction;
  }

  get adminInsightList() {
    if (this.sortOrder.column && this.sortOrder.direction && this.db) {
      return orderBy(
        this.db,
        [user => (this.sortOrder.column === 'updated'
          && user[this.sortOrder.column] && user[this.sortOrder.column].date
          ? moment(user[this.sortOrder.column].date).unix()
          : user[this.sortOrder.column] && user[this.sortOrder.column].toString().toLowerCase())],
        [this.sortOrder.direction],
      );
    }
    return this.db || [];
  }

  get getInsightArticleListing() {
    return (this.allInsightsList.data && (toJS(this.allInsightsList.data.insightArticlesByCategoryId))) || [];
  }

  get adminInsightArticleListing() {
    return (this.allInsightsList && this.allInsightsList.data
      && this.allInsightsList.data.adminInsightArticlesListByFilter) || [];
  }

  get articleListingLoader() {
    return this.allInsightsList.loading;
  }

  deleteArticle = id => new Promise((resolve, reject) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: adminDeleteArticle,
        variables: { id },
      }).then(() => {
        Helper.toast('Category deleted successfully.', 'success');
        resolve();
      }).catch(() => {
        Helper.toast('Error while Deleting Category', 'error');
        reject();
      }).finally(() => uiStore.setProgress(false));
  });

  featuredRequestArticles = () => {
    this.featuredData = graphql({
      client: clientPublic,
      query: allInsightArticles,
      fetchPolicy: 'network-only',
      variables: { sortByCreationDateAsc: false },
    });
  }

  getArticle = (id) => {
    this.article = graphql({ client: clientPublic, query: getArticleDetails, variables: { id } });
  }

  getArticleDetailsBySlug = (slug) => {
    this.article = graphql({
      client: clientPublic,
      query: getArticleDetailsBySlug,
      variables: { slug },
    });
  }

  get InsightArticles() {
    return (toJS(this.data.data.insightArticlesByCategoryId)
      || toJS(this.data.data.getInsightsArticles)) || [];
  }

  get InsightFeaturedArticles() {
    const featured = get(this.featuredData, 'data.getInsightsArticles') || [];
    return filter(featured, a => a.isFeatured);
  }

  get ArticlesDetails() {
    return (this.article.data && toJS(this.article.data.insightArticleBySlug)) || null;
  }

  get singleArticlesDetails() {
    return (this.article.data && toJS(this.article.data.adminInsightsArticle)) || null;
  }

  get articleLoading() {
    return this.article.loading;
  }

  getCategoryList = (isPublic = true, types = ['INSIGHTS']) => {
    const apiClient = isPublic ? clientPublic : client;
    this.Categories = graphql({
      client: apiClient,
      query: isPublic ? getCategories : adminCategories,
      variables: { types },
      fetchPolicy: 'network-only',
    });
  }

  get InsightCategories() {
    const iMap = { categoryName: 'title', id: 'to' };
    const categories = (this.Categories.data && toJS(this.Categories.data.categories)) || [];
    const categoryRoutes = map(categories, i => mapKeys(i, (v, k) => iMap[k] || k));
    const categoryRoutesModified = map(categoryRoutes, c => mapValues(c, (v, k) => (k === 'to' ? `category/${v}` : v)));
    return categoryRoutesModified;
  }

  get publicArticleloading() {
    return (this.data.loading || this.featuredData.loading);
  }

  htmlContentChange = (field, value) => {
    this.ARTICLE_FRM.fields[field].value = value;
    Validator.validateForm(this.ARTICLE_FRM);
  }

  articleChange = (e, result) => {
    if (result && result.type === 'checkbox') {
      this.ARTICLE_FRM = Validator.onChange(
        this.ARTICLE_FRM,
        Validator.pullValues(e, result),
        '',
        true,
        { value: result.checked },
      );
    } else {
      this.ARTICLE_FRM = Validator.onChange(this.ARTICLE_FRM, Validator.pullValues(e, result));
    }
    if (result.name === 'title') {
      this.creteSlug('ARTICLE_FRM', result.name);
    }
  };

  maskChange = (values, field) => {
    if (moment(values.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      const isoDate = field === 'startDate' ? moment(new Date(values.formattedValue)).toISOString()
        : moment(new Date(values.formattedValue)).add(1, 'day').toISOString();
      this.setInitiateSrch(field, isoDate);
    } else {
      this.setInitiateSrch(field, values.value);
    }
    if (field === 'minuteRead') {
      this.ARTICLE_FRM = Validator.onChange(
        this.ARTICLE_FRM,
        { name: field, value: values.floatValue },
      );
    }
  }

  creteSlug = (formName, field) => {
    const { value } = this[formName].fields[field];
    this[formName].fields.slug.value = kebabCase(value);
  }

  get getSelectedRecords() {
    return toJS(this.selectedRecords);
  }

  selectRecordsOnPage = (isChecked) => {
    if (isChecked) {
      const data = this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)
        || [];
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

  addSelectedRecords = (id) => {
    this.isReadOnly = false;
    if (!this.selectedRecords.includes(id)) {
      this.selectedRecords.push(id);
    }
  }

  removeSelectedRecords = (id) => {
    remove(this.selectedRecords, e => e === id);
    if (this.selectedRecords && this.selectedRecords.length <= 0) {
      this.isReadOnly = true;
    }
  }

  get selectedRecordsCount() {
    return this.selectedRecords.length || 0;
  }

  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  get count() {
    return (this.db && this.db.length) || 0;
  }

  setDb = (data) => {
    const d = map(data, (dd) => {
      const de = { categoryId: dd.categoryId, ...dd };
      return de;
    });
    this.db = ClientDb.initiateDb(d, true);
  }

  get allInsightsListing() {
    return (this.allInsightsList && this.allInsightsList.data
      && this.allInsightsList.data.adminInsightArticlesListByFilter
      && toJS(sortBy(
        this.allInsightsList.data.adminInsightArticlesListByFilter,
        ['title'],
      ).slice(this.requestState.skip, this.requestState.displayTillIndex))) || [];
  }

  get categoriesDropdown() {
    const categoriesArray = [];
    if (this.Categories.data && this.Categories.data.adminCategories) {
      this.Categories.data.adminCategories.map((ele) => {
        categoriesArray.push({ key: ele.categoryName, value: ele.id, text: ele.categoryName });
        return categoriesArray;
      });
      return categoriesArray;
    }
    return null;
  }

  setFileUploadData = (form, name, files, id) => {
    let fileField = '';
    fileField = this[form].fields[name];
    fileField.showLoader = true;
    fileUpload.uploadToS3(files[0], `insights/${id}`)
      .then(action((res) => {
        Helper.toast('file uploaded successfully', 'success');
        fileField.value = files[0].name;
        fileField.preSignedUrl = res;
        fileField.fileId = `${files[0].name}${Date.now()}`;
        fileField.fileName = `${files[0].name}${Date.now()}`;
      }))
      .catch(action(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        fileField.showLoader = false;
      }))
      .finally(action(() => {
        fileField.showLoader = false;
      }));
  }

  removeMediaUpload = (name, id) => {
    let filename = '';
    filename = this.ARTICLE_FRM.fields[name].value;
    commonStore.deleteCdnS3File(`insights/${id}/${filename}`)
      .then((res) => {
        window.logger(res);
        Helper.toast(`${this.ARTICLE_FRM.fields[name].label} removed successfully.`, 'success');
        this.resetFormField('ARTICLE_FRM', name, undefined);
      })
      .catch((err) => {
        // force record deletion from db;
        this.resetFormField('ARTICLE_FRM', name, undefined);
        this.updateOffering(this.currentOfferingId, this.ARTICLE_FRM.fields, 'media', false, false);
        window.logger(err);
      });
  }

  resetFormField = (form, field, fileObj, RemoveIndex) => {
    if (fileObj && Array.isArray(toJS(this.ARTICLE_FRM.fields[field].preSignedUrl))) {
      this.ARTICLE_FRM.fields[field].preSignedUrl.push(fileObj.location);
      this.ARTICLE_FRM.fields[field].fileId.push(`${Date.now()}_${fileObj.fileName}`);
      this.ARTICLE_FRM.fields[field].value.push(fileObj.location);
    } else if (fileObj) {
      this.ARTICLE_FRM.fields[field].preSignedUrl = fileObj.location;
      this.ARTICLE_FRM.fields[field].value = fileObj.location;
      this.ARTICLE_FRM.fields[field].fileId = `${Date.now()}_${fileObj.fileName}`;
    } else if (RemoveIndex > -1
      && Array.isArray(toJS(this.ARTICLE_FRM.fields[field].preSignedUrl))) {
      this.ARTICLE_FRM.fields[field].preSignedUrl.splice(RemoveIndex, 1);
      this.ARTICLE_FRM.fields[field].value.splice(RemoveIndex, 1);
    } else if (RemoveIndex === undefined) {
      this.ARTICLE_FRM.fields[field].preSignedUrl = '';
      this.ARTICLE_FRM.fields[field].value = '';
    }
    this[form].fields[field] = {
      ...this.ARTICLE_FRM.fields[field],
      ...{
        src: '',
        meta: {},
      },
    };
  }

  resetThumbnail = (field) => {
    const attributes = ['src', 'error', 'meta'];
    attributes.forEach((val) => {
      if ((typeof this.ARTICLE_FRM.fields[field][val] === 'object') && (this.ARTICLE_FRM.fields[field][val] !== null)) {
        this.ARTICLE_FRM.fields[field][val] = {};
      } else {
        this.ARTICLE_FRM.fields[field][val] = '';
      }
    });
  }

  adminUpdateSocialLinks = id => new Promise((resolve, reject) => {
    uiStore.setProgress(true);
    const payload = {
      ...pick(Validator.evaluateFormData(this.ARTICLE_FRM.fields), ['title', 'articleStatus']),
      ...this.evaluateFormFieldToArray(this.ARTICLE_MISC_FRM.fields, false),
    };
    client
      .mutate({
        mutation: adminUpdateArticleInfo,
        variables: {
          payload, id, isPartialData: true,
        },
      }).then(() => {
        Helper.toast('Category Saved successfully.', 'success');
        uiStore.setProgress(false);
        resolve();
      }).catch(() => {
        uiStore.setProgress(false);
        Helper.toast('Error while Saving Category', 'error');
        reject();
      });
  })

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      [formName]: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  setMiscFormData = (data) => {
    this.ARTICLE_MISC_FRM = Validator.setFormData(this.ARTICLE_MISC_FRM, data);
    const multiForm = this.getActionType('ARTICLE_MISC_FRM', 'isMultiForm');
    this.ARTICLE_MISC_FRM = Validator.validateForm(this.ARTICLE_MISC_FRM, multiForm, false, false);
  }

  handleVerifyFileExtension = (fileExt) => {
    if (THUMBNAIL_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${THUMBNAIL_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.setThumbnail(field, errorMsg);
    }
  }

  removeUploadedData(field) {
    const { fileId } = this.ARTICLE_FRM.fields[field];
    fileUpload.removeUploadedData(fileId).then(action(() => {
      this.ARTICLE_FRM = Validator.onChange(
        this.ARTICLE_FRM,
        { name: field, value: '' },
      );
      this.ARTICLE_FRM.fields[field].fileId = '';
      this.ARTICLE_FRM.fields[field].preSignedUrl = '';
    }))
      .catch(() => { });
  }

  reset = () => {
    Validator.resetFormData(this.ARTICLE_FRM);
  }
}

decorate(ArticleStore, {
  ...decorateDefault,
  data: observable,
  Categories: observable,
  article: observable,
  ARTICLE_FRM: observable,
  ARTICLE_MISC_FRM: observable,
  featuredData: observable,
  featuredCategoryId: observable,
  filters: observable,
  currentArticleId: observable,
  globalAction: observable,
  allInsightsList: observable,
  db: observable,
  selectedRecords: observable,
  isReadOnly: observable,
  requestState: observable,
  sortOrder: observable,
  initiateSearch: action,
  setInitiateSrch: action,
  initiateFilters: action,
  setGlobalAction: action,
  toggleSearch: action,
  requestAllArticles: action,
  getSingleInsightAdmin: action,
  setFormData: action,
  setForm: action,
  setThumbnail: action,
  save: action,
  toggleArticleVisibility: action,
  sortArticlesByFilter: action,
  setSortingOrder: action,
  deleteArticle: action,
  featuredRequestArticles: action,
  getArticle: action,
  getArticleDetailsBySlug: action,
  htmlContentChange: action,
  articleChange: action,
  maskChange: action,
  creteSlug: action,
  selectRecordsOnPage: action,
  addSelectedRecords: action,
  removeSelectedRecords: action,
  setDb: action,
  pageRequest: action,
  setFileUploadData: action,
  removeMediaUpload: action,
  resetFormField: action,
  resetThumbnail: action,
  handleVerifyFileExtension: action,
  removeUploadedData: action,
  reset: action,
  getCategoryList: action,
  adminUpdateSocialLinks: action,
  getInsightArticleListing: computed,
  adminInsightArticleListing: computed,
  articleListingLoader: computed,
  InsightArticles: computed,
  InsightFeaturedArticles: computed,
  ArticlesDetails: computed,
  singleArticlesDetails: computed,
  articleLoading: computed,
  InsightCategories: computed,
  getSelectedRecords: computed,
  selectedRecordsCount: computed,
  count: computed,
  allInsightsListing: computed,
  categoriesDropdown: computed,
  adminInsightList: computed,
  publicArticleloading: computed,
});

export default new ArticleStore();
