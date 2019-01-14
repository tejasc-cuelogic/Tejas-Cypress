import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy } from 'lodash';
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

    @action
    getAllCategoriesData = () => {
      const formattedData = [
        {
          title: 'Investor FAQ',
          questions: this.categories,
        },
        {
          title: 'Issuer FAQ',
          questions: [
            {
              categoryName: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
            },
            {
              categoryName: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
            },
          ],
        },
        {
          title: 'Issuer Knowledge Base',
          questions: [],
        },
        {
          title: 'Investor Knowledge Base',
          questions: [],
        },
        {
          title: 'Offerings',
          questions: [],
        },
        {
          title: 'Insights',
          questions: [],
        }];
      return formattedData;
    };

    @computed get categories() {
      return (this.data.data && sortBy(toJS(this.data.data.categories), ['order'])) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new CategoryStore();
