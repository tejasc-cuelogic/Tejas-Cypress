import { observable, computed, action, decorate, toJS } from 'mobx';
import { get } from 'lodash';
import DataModelStore, { decorateDefault } from '../dataModelStore';
import { offeringWatchList } from '../../../queries/campagin';


export class WatchListStore extends DataModelStore {
  constructor() {
    super({ offeringWatchList });
  }

  watchList = {};

  get allWatchList() {
    return get(toJS(this.watchList), 'offeringWatchList') || [];
  }

  get watchListLoading() {
    return this.watchList.loading;
  }

  offeringWatchList = (offeringId) => {
    this.executeQuery({
      client: 'PRIVATE',
      query: 'offeringWatchList',
      variables: { offeringId },
    }).then((res) => { this.setFieldValue('watchList', res); });
  };
}

decorate(WatchListStore, {
  ...decorateDefault,
  watchList: observable,
  offeringWatchList: action,
  watchListLoading: computed,
  allWatchList: computed,
});


export default new WatchListStore();
