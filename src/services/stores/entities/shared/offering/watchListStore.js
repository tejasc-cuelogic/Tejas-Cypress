import { observable, computed, action, decorate, toJS } from 'mobx';
import { get, remove } from 'lodash';
import DataModelStore, { decorateDefault } from '../dataModelStore';
import { offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist, isWatchingOffering } from '../../../queries/campagin';
import { userDetailsStore } from '../../..';
import campaignStore from '../../public/campaignStore';
import Helper from '../../../../../helper/utility';

export class WatchListStore extends DataModelStore {
  constructor() {
    super({ offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist, isWatchingOffering });
  }

  watchList = {
    INVESTOR: [],
    WATCHING: [],
    DELETED: [],
  };

  isWatching = 'loading';

  get allWatchList() {
    return toJS(this.watchList);
  }

  offeringWatchList = (offeringId) => {
    this.executeQuery({
      client: 'PRIVATE',
      query: 'offeringWatchList',
      variables: { offeringId },
      setLoader: 'offeringWatchList',
    }).then((res) => {
      this.setWatchListData(res);
    });
  };

  setWatchListData = (res) => {
    const watchList = get(toJS(res), 'offeringWatchList') || [];
    const tempWatchList = this.watchList;
    watchList.forEach((watcher) => {
      if (tempWatchList[watcher.status]) {
        tempWatchList[watcher.status].push(watcher);
      }
    });
    this.setFieldValue('watchList', tempWatchList);
  }

  resetStore = () => {
    this.watchList = {
      INVESTOR: [],
      WATCHING: [],
      DELETED: [],
    };
  }

  setOfferingWatch = () => {
    if (!campaignStore.getOfferingId || !userDetailsStore.currentUserId) {
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

  updateWatchList = (params) => {
    const user = this.watchList[params.status].find(i => i.userId === params.userId);
    remove(this.watchList[params.status], i => i.userId === params.userId);
    user.status = 'DELETED';
    this.watchList.DELETED.unshift(user);
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
        setLoader: 'addRemoveWatchList',
      });
      if (forceRemove) {
        this.updateWatchList(params);
      } else {
        this.setFieldValue('isWatching', !this.isWatching);
      }
    } catch (error) {
      Helper.toast('Something went wronasdfsdfg. Please try again in some time.', 'error');
    }
  }
}

decorate(WatchListStore, {
  ...decorateDefault,
  watchList: observable,
  isApiHit: observable,
  isWatching: observable,
  offeringWatchList: action,
  addRemoveWatchList: action,
  setOfferingWatch: action,
  setWatchListData: action,
  resetStore: action,
  allWatchList: computed,
});


export default new WatchListStore();
