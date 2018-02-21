import { action, observable } from 'mobx';

export class UiStore {
  appLoader = false;
  @observable layoutState = {
    leftPanel: false,
    notificationPanel: false,
  };
  @observable inProgress = false;
  @observable loaderMessage = '';
  @observable errors = undefined;
  @observable success = undefined;
  @observable redirectURL = undefined;

  @action
  setProgress(progress = true) {
    this.inProgress = progress;
  }

  @action
  setLoaderMessage(msg) {
    this.loaderMessage = msg;
  }

  @action
  clearLoaderMessage() {
    this.loaderMessage = '';
  }

  @action
  setErrors(errors) {
    this.errors = errors;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @action
  setSuccess(success) {
    this.success = success;
  }

  @action
  clearSuccess() {
    this.success = undefined;
  }
  @action
  setRedirectURL(url) {
    this.redirectURL = url;
  }

  @action
  clearRedirectURL() {
    this.redirectURL = undefined;
  }

  @action
  setAppLoader(value) {
    this.appLoader = value;
  }

  @action
  updateLayoutState(prop) {
    this.layoutState = { ...{ [prop]: !this.layoutState[prop] } };
    console.log('toggle:', this.layoutState, prop, this.layoutState[prop]);
  }

  @action
  reset() {
    this.inProgress = false;
    this.errors = undefined;
    this.success = undefined;
    this.loaderMessage = '';
  }
}

export default new UiStore();
