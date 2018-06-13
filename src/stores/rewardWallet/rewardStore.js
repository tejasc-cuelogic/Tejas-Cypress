import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allRewards } from '../queries/rewards';

export class RewardStore {
  @observable data = [];

  @action
  initRequest = () => {
    this.data = graphql({
      client,
      query: allRewards,
    });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get rewards() {
    return (this.allData.data && this.allData.data.allOfferings &&
      toJS(this.allData.data.allOfferings)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }
}

export default new RewardStore();
