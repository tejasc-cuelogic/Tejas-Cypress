import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy, filter } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getCategories } from '../../queries/category';

export class CategoryStore {
    @observable data = [];
    @action
    initRequest = (type) => {
      const query = getCategories;
      this.data = graphql({
        client,
        query,
        variables: { type },
      });
    }

    @computed get getAllCategoriesData() {
      const formattedData = [
        {
          title: 'Investor FAQ',
          questions: filter(this.categories, cat => cat.categoryType === 'INV_FAQ'),
        },
        {
          title: 'Issuer FAQ',
          questions: filter(this.categories, cat => cat.categoryType === 'ISSUER_FAQ'),
        },
        {
          title: 'Issuer Knowledge Base',
          questions: filter(this.categories, cat => cat.categoryType === 'ISSUER_KB'),
        },
        {
          title: 'Investor Knowledge Base',
          questions: filter(this.categories, cat => cat.categoryType === 'INVESTOR_KB'),
        },
        {
          title: 'Offerings',
          questions: filter(this.categories, cat => cat.categoryType === 'OFFERINGS'),
        },
        {
          title: 'Insights',
          questions: filter(this.categories, cat => cat.categoryType === 'INSIGHTS'),
        }];
      return formattedData;
    }

    @computed get categories() {
      return (this.data.data && sortBy(toJS(this.data.data.categories), ['order'])) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new CategoryStore();
