import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy } from 'lodash';
import { GqlClient as client } from '../../../../api/publicApi';
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

    @computed get categories() {
      return (this.data.data && sortBy(toJS(this.data.data.categories), ['order'])) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new CategoryStore();
