import { action, observable } from 'mobx';


export class UiStore {
  @observable inProgress = false;
  @observable loaderMessage = '';
  @observable errors = undefined;
  @observable success = undefined;

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
  reset() {
    this.inProgress = false;
    this.errors = undefined;
    this.success = undefined;
    this.loaderMessage = '';
  }
}

export default new UiStore();
