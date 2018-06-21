import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { GqlClient as client } from '../../services/graphqlCool';
import { allRewards } from '../queries/rewards';

export class RewardStore {
  @observable data = [];
  @observable option = false;

  @action
  initRequest = () => {
    this.data = graphql({ client, query: allRewards });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get rewards() {
    const offerings = (this.allData.data && this.allData.data.allOfferings &&
      toJS(this.allData.data.allOfferings)) || [];
    return (this.option) ? offerings.map((o) => {
      const filtered = o;
      filtered.rewards = o.rewards.filter(r => !r.redeemDate && moment().diff(r.expiry) < 0);
      return filtered;
    }) :
      offerings;
  }

  @action
  activeOnly = () => {
    this.option = !this.option;
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }
}

export default new RewardStore();
