import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allInsightArticles, getArticlesByCatId } from '../../queries/insightArticle';
import { getCategoryList } from '../../queries/categoryArticle';

export class ArticleStore {
    @observable data = [];
    @observable Categories = [];
    @action
    requestAllArticles = () => {
      const query = allInsightArticles;
      this.data = graphql({
        client,
        query,
      });
    }

    @computed get InsightArticles() {
      return (this.data.data && toJS(this.data.data.insightsArticles)) || [];
    }

    @action
    getCategoryList = () => {
      const query = getCategoryList;
      this.Categories = graphql({
        client,
        query,
      });
    }

    @computed get InsightCategories() {
      return (this.Categories.data && toJS(this.Categories.data.categories)) || [];
    }

    @action
    getArticlesById = (Category) => { // work remaining
      if (Category === 'all') {
        this.requestAllArticles();
      } else {
        const query = getArticlesByCatId;
        this.data = graphql({
          client,
          query,
        });
      }
    }

    @action
    getcategoryNamebyId = (id) => {
      const catName = this.Categories.data.categories.find(obj => obj.id === id).categoryName;
      return catName;
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new ArticleStore();
