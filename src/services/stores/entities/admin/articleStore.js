import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import { GqlClient as client } from '../../../../api/publicApi';
import { allInsightArticles, getArticleDetails } from '../../queries/insightArticle';
import { getCategoryList } from '../../queries/categoryArticle';

export class ArticleStore {
    @observable data = [];
    @observable Categories = [];
    @observable article = null;

    @action
    requestAllArticles = () => {
      this.data = graphql({ client, query: allInsightArticles });
    }

    @action
    getArticle = (id) => {
      this.article = graphql({ client, query: getArticleDetails, variables: { id } });
    }

    @computed get InsightArticles() {
      return (this.data.data && toJS(this.data.data.insightsArticles)) || [];
    }

    @computed get ArticlesDetails() {
      return (this.article.data && toJS(this.article.data.insightsArticle)) || null;
    }

    @computed get articleLoading() {
      return this.article.loading;
    }

    @action
    getCategoryList = () => {
      this.Categories = graphql({ client, query: getCategoryList });
    }

    @computed get InsightCategories() {
      const iMap = { categoryName: 'title', id: 'to' };
      const categories = (this.Categories.data && toJS(this.Categories.data.categories)) || [];
      const categoryRoutes = map(categories, i => mapKeys(i, (v, k) => iMap[k] || k));
      return categoryRoutes;
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new ArticleStore();
