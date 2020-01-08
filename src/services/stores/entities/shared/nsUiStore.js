import { decorate, action, observable } from 'mobx';

import DataModelStore, * as dataModelStore from './dataModelStore';


export class NsUiStore extends DataModelStore {
  responsiveVars = {};

  errors = undefined;

  loadingArray = [];

  resetLoader = () => {
    this.loadingArray = [];
  }

  filterLoaderByOperation = (operation) => {
    this.loadingArray = this.loadingArray.filter(el => el !== operation);
  }
}

decorate(NsUiStore, {
  ...dataModelStore.decorateDefault,
  responsiveVars: observable,
  loadingArray: observable,
  errors: observable,
  resetLoader: action,
  filterLoaderByOperation: action,
});

export default new NsUiStore();
