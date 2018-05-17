import { action, observable } from 'mobx';

export class UiStore {
  @observable
  modalStatus = false;
  appLoader = false;
  @observable layoutState = {
    leftPanel: true,
    notificationPanel: false,
  };
  @observable submitButtonDisabled = false;
  @observable inProgress = false;
  @observable loaderMessage = '';
  @observable errors = undefined;
  @observable success = undefined;
  @observable redirectURL = undefined;
  @observable asyncCheckLoader = false;
  @observable confirmBox = {
    entity: '',
    refId: '',
    subRefId: '',
    metaData: {
      lockedStatus: false,
      isAnyFilingXmlLocked: false,
    },
  };
  @observable openAccordion = [];
  @observable dropdownLoader = false;
  @observable authWizardStep = undefined;
  @observable dashboardStep = undefined;
  @observable editMode = false;

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
  setAuthWizardStep(step) {
    this.authWizardStep = step;
  }

  @action
  setDashboardWizardStep(step) {
    this.dashboardStep = step;
  }

  @action
  updateLayoutState(prop) {
    this.layoutState[prop] = !this.layoutState[prop];
  }

  // setSubmitButtonDisability(status) {
  //   this.submitButtonDisabled = status;
  // }

  @action
  toggleSubmitButton() {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }

  @action
  toggleAsyncCheckLoader() {
    this.asyncCheckLoader = !this.asyncCheckLoader;
  }

  @action
  setConfirmBox(entity, refId, subRefId, lockedStatus, isAnyFilingXmlLocked) {
    this.confirmBox.entity = entity;
    this.confirmBox.refId = refId;
    this.confirmBox.subRefId = subRefId;
    this.confirmBox.metaData.lockedStatus = lockedStatus;
    this.confirmBox.metaData.isAnyFilingXmlLocked = isAnyFilingXmlLocked;
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
  setEditMode = (isEditMode) => {
    this.editMode = isEditMode;
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
