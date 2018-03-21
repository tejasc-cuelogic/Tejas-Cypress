import { action, observable } from 'mobx';

export class UiStore {
  @observable
  modalStatus = false;
  appLoader = false;
  @observable layoutState = {
    leftPanel: false,
    notificationPanel: false,
  };
  @observable submitButtonDisabled = false;
  @observable inProgress = false;
  @observable loaderMessage = '';
  @observable errors = undefined;
  @observable success = undefined;
  @observable redirectURL = undefined;
  @observable asyncCheckLoader = false;
  @observable confirmBox = false;
  @observable confirmBoxDuplicated = false;
  @observable confirmBoxDuplicatedAgain = false;
  @observable confirmBoxForLock = false;
  @observable openAccordion = [];

  @action
  setModalStatus(status) {
    this.modalStatus = status;
  }

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
    this.layoutState[prop] = !this.layoutState[prop];
  }
  setSubmitButtonDisability(status) {
    this.submitButtonDisabled = status;
  }

  @action
  toggleSubmitButton() {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }

  @action
  toggleAsyncCheckLoader() {
    this.asyncCheckLoader = !this.asyncCheckLoader;
  }

  @action
  toggleConfirmBox(state) {
    this.confirmBox = state;
  }

  @action
  toggleConfirmBoxDuplicated(state) {
    this.confirmBoxDuplicated = state;
  }

  @action
  toggleConfirmBoxDuplicatedAgain(state) {
    this.confirmBoxDuplicatedAgain = state;
  }

  @action
  toggleConfirmBoxForLock(state) {
    this.confirmBoxForLock = state;
  }

  @action
  setOpenAccordion(id) {
    if (this.openAccordion.indexOf(id) !== -1) {
      const index = this.openAccordion.indexOf(id);
      this.openAccordion.splice(index, 1);
    } else {
      this.openAccordion.push(id);
    }
  }

  @action
  setActionLoader(loaderMessage) {
    this.inProgress = true;
    this.loaderMessage = loaderMessage;
  }

  @action
  clearActionLoader() {
    this.inProgress = false;
    this.loaderMessage = '';
  }

  @action
  reset() {
    this.inProgress = false;
    this.errors = undefined;
    this.success = undefined;
    this.loaderMessage = '';
    this.appLoader = false;
    this.submitButtonDisabled = false;
  }
}

export default new UiStore();
