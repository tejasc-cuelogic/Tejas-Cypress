import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allOfferings } from '../../../queries/offerings/creation';

export class CreationStore {
  @observable data = [];
  @action
  initRequest = () => {
    this.data = graphql({ client, query: allOfferings });
  }

  @computed get accounts() {
    return (this.data.data && toJS(this.data.data.allOfferings)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }
}

export default new CreationStore();
