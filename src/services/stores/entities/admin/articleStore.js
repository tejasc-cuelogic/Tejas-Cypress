import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import { map, kebabCase, sortBy, remove, orderBy, filter, get, join } from 'lodash';
import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { ARTICLES, THUMBNAIL_EXTENSIONS } from '../../../constants/admin/article';
import { getArticleDetailsBySlug, deleteArticle, allInsightArticles, getArticleDetails, getArticleById, createArticle, updateArticle, insightArticlesListByFilter } from '../../queries/insightArticle';
import { getCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';
import { uiStore, commonStore } from '../..';
import { fileUpload } from '../../../actions';

export class ArticleStore {
    @observable data = [];

    @observable Categories = [];

    @observable article = null;

    @observable ARTICLE_FRM = Validator.prepareFormObject(ARTICLES);

    @observable featuredData = [];

    @observable featuredCategoryId = '406735f5-f83f-43f5-8272-180a1ea570b0';

    @observable filters = false;

    @observable currentArticleId = null;

    @observable globalAction = '';

    @observable allInsightsList = [];

    @observable db = [];

    @observable selectedRecords= [];

    @observable isReadOnly = true;

    @observable requestState = {
      filters: false,
      search: {},
    };

    @observable sortOrder = {
      column: null,
      direction: 'asc',
    }

    @action
    initiateSearch = (srchParams) => {
      this.requestState.search = srchParams;
      this.initiateFilters();
    }

    @action
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

    @action
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

    @action
    setGlobalAction = (name, globalAction) => {
      this[name] = globalAction;
    }

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @action
    requestAllArticles = (isPublic = true, sortAsc = false, categoryId = null) => {
      const apiClient = isPublic ? clientPublic : client;
      this.data = graphql({
        client: apiClient,
        query: allInsightArticles,
        fetchPolicy: 'network-only',
        variables: { sortByCreationDateAsc: sortAsc, categoryId },
      });
    }

    @action
    getSingleInsightAdmin = (id) => {
      this.article = graphql({
        client,
        query: getArticleById,
        variables: { id },
        fetchPolicy: 'network-only',
        onFetch: (res) => {
          if (res && res.insightsArticle) {
            this.setForm(res.insightsArticle);
          }
        },
      });
    }

    @action
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

    @action
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

    @action
    setThumbnail(attr, value, field) {
      this.ARTICLE_FRM.fields[field][attr] = value;
    }

    @action
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
          mutation: id === 'new' ? createArticle : updateArticle,
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

    sortBydate = data => orderBy(data, o => (o.updated.date ? new Date(o.updated.date) : ''), ['desc'])

    @action
    sortArticlesByFilter = () => {
      this.allInsightsList = graphql({
        client,
        query: insightArticlesListByFilter,
        fetchPolicy: 'network-only',
        onFetch: (res) => {
          if (res && res.insightArticlesListByFilter) {
            this.setDb(this.sortBydate(res.insightArticlesListByFilter));
          }
        },
      });
    }

    @action
    setSortingOrder = (column = null, direction = null) => {
      this.sortOrder.column = column;
      this.sortOrder.direction = direction;
    }

    @computed get adminInsightList() {
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

    @computed get getInsightArticleListing() {
      return (this.allInsightsList.data && (toJS(this.data.data.insightsArticles)
        || toJS(this.allInsightsList.data.insightArticlesByCategoryId))) || [];
    }

    @computed get adminInsightArticleListing() {
      return (this.allInsightsList && this.allInsightsList.data
        && this.allInsightsList.data.insightArticlesListByFilter) || [];
    }

    @computed get articleListingLoader() {
      return this.allInsightsList.loading;
    }

    @action
    deleteArticle = id => new Promise((resolve, reject) => {
      uiStore.setProgress();
      client
        .mutate({
          mutation: deleteArticle,
          variables: { id },
        }).then(() => {
          Helper.toast('Category deleted successfully.', 'success');
          resolve();
        }).catch(() => {
          Helper.toast('Error while Deleting Category', 'error');
          reject();
        }).finally(() => uiStore.setProgress(false));
    });

    @action
    featuredRequestArticles = () => {
      this.featuredData = graphql({
        client: clientPublic,
        query: allInsightArticles,
        fetchPolicy: 'network-only',
        variables: { sortByCreationDateAsc: false },
      });
    }

    @action
    getArticle = (id) => {
      this.article = graphql({ client: clientPublic, query: getArticleDetails, variables: { id } });
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
      return (this.data.data && (toJS(this.data.data.insightsArticles)
        || toJS(this.data.data.insightArticlesByCategoryId)
        || toJS(this.data.data.getInsightsArticles))) || [];
    }

    @computed get InsightFeaturedArticles() {
      const featured = get(this.featuredData, 'data.getInsightsArticles') || [];
      return filter(featured, a => a.isFeatured);
    }

    @computed get ArticlesDetails() {
      return (this.article.data && toJS(this.article.data.insightArticleBySlug)) || null;
    }

    @computed get singleArticlesDetails() {
      return (this.article.data && toJS(this.article.data.insightsArticle)) || null;
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

    @action
    getCategoryListByTypes = (isPublic = true, types) => {
      const apiClient = isPublic ? clientPublic : client;
      this.Categories = graphql({
        client: apiClient,
        query: getCategories(isPublic),
        variables: { types },
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
      return (this.data.loading || this.featuredData.loading);
    }

    @action
    htmlContentChange = (field, value) => {
      this.ARTICLE_FRM.fields[field].value = value;
      Validator.validateForm(this.ARTICLE_FRM);
    }

    @action
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

    @action
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

    @action
    creteSlug = (formName, field) => {
      const { value } = this[formName].fields[field];
      this[formName].fields.slug.value = kebabCase(value);
    }

    @computed get getSelectedRecords() {
      return toJS(this.selectedRecords);
    }

    @action selectRecordsOnPage = (isChecked) => {
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
      return this.selectedRecords.length || 0;
    }

    @action
    pageRequest = ({ skip, page }) => {
      this.requestState.displayTillIndex = this.requestState.perPage * page;
      this.requestState.page = page;
      this.requestState.skip = skip;
    }

    @computed get count() {
      return (this.db && this.db.length) || 0;
    }

    @action
    setDb = (data) => {
      const d = map(data, (dd) => {
        const de = { categoryId: dd.categoryId, ...dd };
        return de;
      });
      this.db = ClientDb.initiateDb(d, true);
    }

    @computed get allInsightsListing() {
      return (this.allInsightsList && this.allInsightsList.data
        && this.allInsightsList.data.insightArticlesListByFilter
        && toJS(sortBy(
          this.allInsightsList.data.insightArticlesListByFilter,
          ['title'],
        ).slice(this.requestState.skip, this.requestState.displayTillIndex))) || [];
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

    @action
    uploadMedia = (name, form = 'ARTICLE_FRM', id) => {
      const fileObj = {
        obj: this[form].fields[name].base64String,
        // type: this[form].fields[name].meta.type,
        name: this[form].fields[name].fileName,
      };
      fileUpload.uploadToS3(fileObj, `insights/${id}`)
        .then((res) => {
          Helper.toast(`${this[form].fields[name].label} uploaded successfully.`, 'success');
          this.resetFormField(form, name, { fileName: fileObj.name, location: res });
        })
        .catch((err) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          console.log(err);
        });
    }

    @action
    removeMedia = (name, id) => {
      let filename = '';
      filename = this.ARTICLE_FRM.fields[name].value;
      commonStore.deleteCdnS3File(`insights/${id}/${filename}`)
        .then((res) => {
          console.log(res);
          Helper.toast(`${this.ARTICLE_FRM.fields[name].label} removed successfully.`, 'success');
          this.resetFormField('ARTICLE_FRM', name, undefined);
        })
        .catch((err) => {
          // force record deletion from db;
          this.resetFormField('ARTICLE_FRM', name, undefined);
          this.updateOffering(this.currentOfferingId, this.ARTICLE_FRM.fields, 'media', false, false);
          console.log(err);
        });
    }

    @action
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

    @action
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

    @action
    handleVerifyFileExtension = (fileExt) => {
      if (THUMBNAIL_EXTENSIONS.indexOf(fileExt) === -1) {
        const field = 'error';
        const errorMsg = `Only ${THUMBNAIL_EXTENSIONS.join(', ')}  extensions are allowed.`;
        this.setThumbnail(field, errorMsg);
      }
    }


    @action
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

    @action
    reset = () => {
      Validator.resetFormData(this.ARTICLE_FRM);
    }
}


export default new ArticleStore();
