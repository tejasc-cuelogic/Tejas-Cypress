import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import graphql from 'mobx-apollo';
import map from 'lodash/map';
// import { sortBy } from 'lodash';
import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { ARTICLES } from '../../../constants/admin/article';
import { getArticleDetailsBySlug, deleteArticle, allInsightArticles, getArticleDetails, getArticlesByCatId, getArticleById, createArticle, updateArticle, insightArticlesListByFilter } from '../../queries/insightArticle';
import { getCategories } from '../../queries/category';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../../../services/stores';
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
    @observable requestState = {
      search: {},
    };

    @action
    initiateSearch = (srchParams) => {
      this.requestState.search = srchParams;
      this.sortArticlesByFilter();
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
    requestArticlesByCategoryId = (id) => {
      this.data = graphql({ client: clientPublic, query: getArticlesByCatId, variables: { id } });
    }

    @action
    getArticleAdminListing = (id, isPublic = true) => {
      const query = isPublic ? getArticleDetails : getArticleById;
      const apiClient = isPublic ? clientPublic : client;
      this.article = graphql({
        client: apiClient,
        query,
        variables: { id },
        onFetch: (res) => {
          if (!isPublic && res) {
            Object.keys(this.ARTICLE_FRM.fields).map((key) => {
              this.ARTICLE_FRM.fields[key].value = res.insightsArticle[key];
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
          mutation: id === 'new' ? createArticle : updateArticle,
          variables: id === 'new' ? { payload: data } :
            { ...{ payload: data }, id },
          refetchQueries: [{
            query: insightArticlesListByFilter,
          }],
        }).then(() => {
          Helper.toast('Category Saved successfully.', 'success');
        }).catch(() => {
          Helper.toast('Error while Saving Category', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }

    @action
    sortArticlesByFilter = () => {
      const {
        articleStatus, categoryId, tags,
      } = this.requestState.search;
      this.allInsightsList = graphql({
        client,
        query: insightArticlesListByFilter,
        variables: { articleStatus, categoryId, tags },
      });
    }

    @computed get getInsightArticleListing() {
      return (this.allInsightsList.data && (toJS(this.data.data.insightsArticles)
        || toJS(this.allInsightsList.data.insightArticlesByCategoryId))) || [];
    }

    @computed get articleListingLoader() {
      return this.allInsightsList.loading;
    }

    @action
    deleteArticle = (id) => {
      uiStore.setProgress();
      client
        .mutate({
          mutation: deleteArticle,
          variables: { id },
          refetchQueries: [{
            query: insightArticlesListByFilter,
          }],
        }).then(() => {
          Helper.toast('Category deleted successfully.', 'success');
        }).catch(() => {
          Helper.toast('Error while Deleting Category', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }

    @action
    featuredRequestArticlesByCategoryId = () => {
      const id = this.featuredCategoryId;
      this.featuredData =
        graphql({ client: clientPublic, query: getArticlesByCatId, variables: { id } });
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
      return (this.featuredData.data && (toJS(this.featuredData.data.insightsArticles)
        || toJS(this.featuredData.data.insightArticlesByCategoryId))) || [];
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
      // this.Categories = (this.Categories && sortBy(toJS(this.Categories),
      // ['created.date'])) || [];
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
    // @action
    // reset = () => {
    //   this.ARTICLE_FRM = Validator.prepareFormObject(ARTICLES);
    // }
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
    setFileUploadData = (form, name, files) => {
      let fileField = '';
      fileField = this[form].fields[name];
      fileField.showLoader = true;
      fileUpload.uploadToS3(files[0], 'insights')
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
    setFormData = (id) => {
      this.ARTICLE_FRM =
      Validator.setFormData(this.ARTICLE_FRM, this.InsightArticles.find(obj => obj.id === id));
      // this.CATEGORY_DETAILS_FRM.fields.categoryType.value = this.selectedCategoryState.type;
      Validator.validateForm(this.ARTICLE_FRM);
    }
    @action
    reset = () => {
      // this.ARTICLE_FRM = Validator.prepareFormObject(ARTICLE);
      Validator.resetFormData(this.ARTICLE_FRM);
      // this.ARTICLE_FRM.fields.categoryType.value = this.selectedCategoryState.type;
    }
}


export default new ArticleStore();
