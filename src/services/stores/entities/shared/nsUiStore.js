import { decorate, action, observable, computed } from 'mobx';
import { intersection } from 'lodash';
import DataModelStore, { decorateDefault } from './dataModelStore';

export class NsUiStore extends DataModelStore {
  responsiveVars = {};

  errors = undefined;

  editMode = false;

  loadingArray = [];

  loadingStatus = [];

  resetLoader = () => {
    this.loadingArray = [];
  }

  filterLoaderByOperation = (operation) => {
    this.loadingArray = this.loadingArray.filter(el => el !== operation);
  }

  setLoader = (setLoader) => {
    this.setFieldValue('loadingArray', setLoader, false, true);
    this.setFieldValue('loadingStatus', setLoader, false, true);
  }

  get isMobile() {
    return this.responsiveVars.isMobile;
  }

  get isLoading() {
    return intersection(this.loadingStatus, this.loadingArray).length > 0;
  }
}

decorate(NsUiStore, {
  ...decorateDefault,
  responsiveVars: observable,
  loadingArray: observable,
  loadingStatus: observable,
  editMode: observable,
  errors: observable,
  resetLoader: action,
  setLoader: action,
  filterLoaderByOperation: action,
  isLoading: computed,
  isMobile: computed,
});

export default new NsUiStore();
