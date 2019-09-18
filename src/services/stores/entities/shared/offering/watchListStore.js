import { observable, computed, action, decorate, toJS } from 'mobx';
import { get } from 'lodash';
import DataModelStore, { decorateDefault } from '../dataModelStore';
import { offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist, isWatchingOffering } from '../../../queries/campagin';
import { userDetailsStore } from '../../..';
import campaignStore from '../../public/campaignStore';
import Helper from '../../../../../helper/utility';

export class WatchListStore extends DataModelStore {
  constructor() {
    super({ offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist, isWatchingOffering });
  }

  watchList = {};

  isWatching = false;

  get allWatchList() {
    return get(toJS(this.watchList), 'offeringWatchList') || [];
  }

  offeringWatchList = (offeringId) => {
    this.executeQuery({
      client: 'PRIVATE',
      query: 'offeringWatchList',
      variables: { offeringId },
      setLoader: 'offeringWatchList',
    }).then((res) => { this.setFieldValue('watchList', res); });
  };

  @action
  setOfferingWatch = () => {
    if (!campaignStore.getOfferingId || !userDetailsStore.currentUserId) {
      this.isWatching = false;
      return;
    }

    const variables = {
      userId: userDetailsStore.currentUserId,
      offeringId: campaignStore.getOfferingId,
    };

    this.executeQuery({
      client: 'PRIVATE',
      query: 'isWatchingOffering',
      variables: { ...variables },
      setLoader: 'offeringWatchList',
    }).then((res) => { this.setFieldValue('isWatching', get(res, 'isWatchingOffering')); });
  }

  addRemoveWatchList = (params, forceRemove = undefined) => {
    const variables = {
      userId: (params && params.userId) || userDetailsStore.currentUserId,
      offeringId: (params && params.offeringId) || campaignStore.getOfferingId,
      isInvestment: false,
    };
    try {
      this.executeMutation({
        client: 'PRIVATE',
        mutation: (this.isWatching || forceRemove) ? 'removeUserFromOfferingWatchlist' : 'addUserToOfferingWatchlist',
        variables: { ...variables },
      });
      this.setFieldValue('isWatching', !this.isWatching);
    } catch (error) {
      Helper.toast('Something went wronasdfsdfg. Please try again in some time.', 'error');
    }
  }
}

decorate(WatchListStore, {
  ...decorateDefault,
  watchList: observable,
  offeringWatchList: action,
  addRemoveWatchList: action,
  allWatchList: computed,
  isWatching: observable,
});


export default new WatchListStore();
