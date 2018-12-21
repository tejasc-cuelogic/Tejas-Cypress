import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../../../api/publicApi';
import { allInsightArticles, getArticleDetails, getArticlesByCatId } from '../../queries/insightArticle';
import { getCategoryList } from '../../queries/categoryArticle';

export class ArticleStore {
    @observable data = [];
    @observable Categories = [];
    @observable article = null;
    @observable featuredData = [];
    @observable featuredCategoryId = 'a25924d6-8136-4514-aee7-1ad8d78bb609';

    @action
    requestAllArticles = () => {
      this.data = graphql({ client, query: allInsightArticles });
    }

    @action
    requestArticlesByCategoryId = (id) => {
      this.data = graphql({ client, query: getArticlesByCatId, variables: { id } });
    }

    @action
    featuredRequestArticlesByCategoryId = () => {
      const id = this.featuredCategoryId;
      this.featuredData =
        graphql({ client, query: getArticlesByCatId, variables: { id } });
    }

    @action
    getArticle = (id) => {
      this.article = graphql({ client, query: getArticleDetails, variables: { id } });
    }

    @computed get InsightArticles() {
      return (this.data.data && (toJS(this.data.data.insightsArticles)
        || toJS(this.data.data.insightArticlesByCategoryId))) || [];
    }
    @computed get InsightFeaturedArticles() {
      return (this.featuredData.data && (toJS(this.featuredData.data.insightsArticles)
        || toJS(this.featuredData.data.insightArticlesByCategoryId))) || [];
    }

    @computed get ArticlesDetails() {
      return (this.article.data && toJS(this.article.data.insightsArticleById)) || null;
    }

    @computed get articleLoading() {
      return this.article.loading;
    }

    @action
    getCategoryList = () => {
      this.Categories = graphql({ client, query: getCategoryList, variables: { categoryType: 'INSIGHTS' } });
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
}


export default new ArticleStore();
