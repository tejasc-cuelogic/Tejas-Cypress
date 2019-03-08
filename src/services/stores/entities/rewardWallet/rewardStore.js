import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { GqlClient as coolClient } from '../../../../api/gcoolApi';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allRewards, getUserRewardBalance } from '../../queries/rewards';
import { userDetailsStore } from '../../index';
import Helper from '../../../../helper/utility';

export class RewardStore {
  @observable data = [];
  @observable option = false;
  @observable creditAvailable = 0;
  @action
  initRequest = () => {
    this.data = graphql({ client: coolClient, query: allRewards });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get getCurrCreditAvailable() {
    return (this.creditAvailable && this.creditAvailable.data.getUserRewardBalance)
    || 0;
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
  getUserRewardBalance = () => new Promise((resolve) => {
    this.creditAvailable = graphql({
      client,
      query: getUserRewardBalance,
      variables: {
        userId: userDetailsStore.currentUserId,
      },
      onFetch: (data) => {
        if (data && !this.creditAvailable.loading) {
          resolve(data);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
      fetchPolicy: 'network-only',
    });
  });

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
