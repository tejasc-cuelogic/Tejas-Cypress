import { observable, computed, action, decorate, toJS } from 'mobx';
import { get, remove, orderBy } from 'lodash';
import DataModelStore, { decorateDefault } from '../dataModelStore';
import { offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist } from '../../../queries/campagin';
import campaignStore from '../../public/campaignStore';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class WatchListStore extends DataModelStore {
  constructor() {
    super({ offeringWatchList, removeUserFromOfferingWatchlist, addUserToOfferingWatchlist });
  }

  watchList = {
    INVESTOR: [],
    WATCHING: [],
    DELETED: [],
  };

  watchListMeta = [
    { headerText: 'Investors Watchers', status: 'INVESTOR' },
    { headerText: 'Public Watchers', status: 'WATCHING' },
    { headerText: 'Deleted Watchers', status: 'DELETED' },
  ];

  watchListDataMappingMeta = [
    { field: 'firstName', key: 'userInfo.info.firstName' }, { field: 'lastName', key: 'userInfo.info.lastName' },
    { field: 'userEmail', key: 'userInfo.email.address' }, { field: 'city', key: 'userInfo.info.mailingAddress.city' },
    { field: 'state', key: 'userInfo.info.mailingAddress.state' },
    { field: 'date', key: 'lastUpdated', getDataValue: obj => (obj ? `${DataFormatter.getDateAsPerTimeZone(obj, true, false, false)}` : '') },
    { field: 'time', key: 'lastUpdated', getDataValue: obj => (obj ? `${DataFormatter.getDateAsPerTimeZone(obj, true, false, false, false, undefined, false, false, true)}` : '') },
    { field: 'investmentCount', key: 'investmentCount' }, { field: 'uuid', key: 'userId' },
  ];

  isWatching = false;

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
    const dateSortedList = orderBy(watchList, ['lastUpdated'], ['desc']);
    const tempWatchList = this.watchList;

    dateSortedList.forEach((watcher) => {
      if (tempWatchList[watcher.status]) {
        tempWatchList[watcher.status].push(watcher);
      }
    });
    this.setFieldValue('watchList', tempWatchList);
  }

  resetWatchList = () => {
    this.watchList = {
      INVESTOR: [],
      WATCHING: [],
      DELETED: [],
    };
  }

  updateWatchList = (params) => {
    const user = this.watchList[params.status].find(i => i.userId === params.userId);
    remove(this.watchList[params.status], i => i.userId === params.userId);
    user.status = 'DELETED';
    this.watchList.DELETED.unshift(user);
  }

  addRemoveWatchList = async (params, forceRemove = undefined) => {
    let variables = {
      offeringId: (params && params.offeringId) || campaignStore.getOfferingId,
    };
    variables = (params && params.userId) ? { ...variables, userId: params.userId } : { ...variables };
    try {
      await this.executeMutation({
        mutation: (this.isWatching || forceRemove) ? 'removeUserFromOfferingWatchlist' : 'addUserToOfferingWatchlist',
        variables: { ...variables },
        setLoader: forceRemove ? `removing-${params.userId}` : 'addRemoveWatchList',
      });
      if (forceRemove) {
        this.updateWatchList(params);
      } else {
        this.setFieldValue('isWatching', !this.isWatching);
      }
    } catch (error) {
      Helper.toast('Something went wrong. Please try again in some time.', 'error');
    }
  }

  get watchListForCsv() {
    const listObj = {};
    this.watchListMeta.forEach((listType) => {
      // eslint-disable-next-line implicit-arrow-linebreak
      const watchListByType = this.allWatchList[listType.status].map((data) => {
        const dataObj = {};
        this.watchListDataMappingMeta.map((watchMeta) => {
          dataObj[watchMeta.field] = watchMeta.getDataValue ? watchMeta.getDataValue(get(data, watchMeta.key)) : get(data, watchMeta.key);
          return false;
        });
        return dataObj;
      });
      listObj[listType.status] = watchListByType;
    });
    return listObj;
  }
}

decorate(WatchListStore, {
  ...decorateDefault,
  watchList: observable,
  isApiHit: observable,
  isWatching: observable,
  offeringWatchList: action,
  addRemoveWatchList: action,
  updateWatchList: action,
  setWatchListData: action,
  resetWatchList: action,
  allWatchList: computed,
  watchListForCsv: computed,
});


export default new WatchListStore();
