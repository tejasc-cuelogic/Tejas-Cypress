import { action, observable } from 'mobx';
import { REACT_APP_DEPLOY_ENV, NS_SITE_EMAIL_SUPPORT } from '../../../../constants/common';

export class UiStore {
  @observable
  modalStatus = false;
  appLoader = false;
  @observable layoutState = {
    leftPanel: true,
    leftPanelMobile: false,
    notificationPanel: false,
  };
  @observable submitButtonDisabled = false;
  @observable inProgress = false;
  @observable loaderMessage = '';
  @observable errors = undefined;
  @observable success = undefined;
  @observable redirectURL = undefined;
  @observable passwordPreviewURL = null;
  @observable asyncCheckLoader = false;
  @observable devBanner = !['production', 'prod', 'master', 'localhost'].includes(REACT_APP_DEPLOY_ENV);
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
  @observable pwdInputType = 'password';
  @observable isEnterPressed = false;
  @observable showFireworkAnimation = false;
  @observable authRef = '';
  @observable htmlEditorImageLoading = false;
  @observable createAccountMessage = null;

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  setIsEnterPressed = (e) => {
    if (e.charCode === 13 && e.target.name !== 'investmentAmount' && e.target.name !== 'bankName') {
      this.isEnterPressed = true;
    }
  }

  @action
  resetIsEnterPressed = () => {
    this.isEnterPressed = false;
  }

  @action
  setModalStatus(status) {
    this.modalStatus = status;
  }

  @action
  toggleDevBanner() {
    this.devBanner = !this.devBanner;
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

  @action
  toggleSubmitButton() {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }

  @action
  toggleAsyncCheckLoader() {
    this.asyncCheckLoader = !this.asyncCheckLoader;
  }
  @action
  setcreateAccountMessage= () => {
    this.createAccountMessage = 'Please wait...<br /><br /> We are finalizing your account. This can take up to a minute.';
  }

  @action
  resetcreateAccountMessage = () => {
    this.createAccountMessage = null;
  }

  @action
  setConfirmBox = (entity, refId, subRefId, lockedStatus, isAnyFilingXmlLocked) => {
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
    this.createAccountMessage = null;
  }

  @action
  showErrorMessage = (message, override = false) => {
    const setErrorMessage = (
      `<span>
        There was an issue with the information you submitted.
        ${message}
        If you have any questions please contact <a target="_blank" rel="noopener noreferrer" href="mailto:${NS_SITE_EMAIL_SUPPORT}">${NS_SITE_EMAIL_SUPPORT}</a>
      </span>`
    );
    this.setProgress(false);
    this.setErrors(override ? (`<span>${message}<span>`) : setErrorMessage);
  }

  @action
  setAuthRef = (url) => {
    this.authRef = url || '';
  }
}

export default new UiStore();
