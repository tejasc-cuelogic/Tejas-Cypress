import { observable, action, toJS, computed } from 'mobx';
import { forEach, isArray, find, mapValues, forOwn, remove, filter } from 'lodash';

import graphql from 'mobx-apollo';
import cleanDeep from 'clean-deep';
import { INCOME_EVIDENCE, ACCREDITATION_METHODS_ENTITY, ACCREDITATION_METHODS, VERIFICATION_REQUEST, INCOME_UPLOAD_DOCUMENTS, ASSETS_UPLOAD_DOCUMENTS, NET_WORTH, ENTITY_ACCREDITATION_METHODS, TRUST_ENTITY_ACCREDITATION, ACCREDITATION_EXPIRY } from '../../../../constants/investmentLimit';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { uiStore, userDetailsStore, investmentStore } from '../../../index';
import { updateAccreditation, listAccreditation, approveOrDeclineForAccreditationRequest } from '../../../queries/accreditation';
import { userAccreditationQuery } from '../../../queries/users';
import { fileUpload } from '../../../../actions';
import { ACCREDITATION_FILE_UPLOAD_ENUMS } from '../../../../constants/accreditation';
import { FILTER_META, CONFIRM_ACCREDITATION } from '../../../../constants/accreditationRequests';

export class AccreditationStore {
  @observable ACCREDITATION_FORM = Validator.prepareFormObject(ACCREDITATION_METHODS);
  @observable FILTER_FRM = Validator.prepareFormObject(FILTER_META);
  @observable CONFIRM_ACCREDITATION_FRM = Validator.prepareFormObject(CONFIRM_ACCREDITATION);
  @observable ENTITY_ACCREDITATION_FORM =
    Validator.prepareFormObject(ENTITY_ACCREDITATION_METHODS);
  @observable INCOME_EVIDENCE_FORM = Validator.prepareFormObject(INCOME_EVIDENCE);
  @observable TRUST_ENTITY_ACCREDITATION_FRM =
    Validator.prepareFormObject(TRUST_ENTITY_ACCREDITATION);
  @observable VERIFICATION_REQUEST_FORM = Validator.prepareFormObject(VERIFICATION_REQUEST);
  @observable INCOME_UPLOAD_DOC_FORM = Validator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
  @observable ASSETS_UPLOAD_DOC_FORM = Validator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
  @observable NET_WORTH_FORM = Validator.prepareFormObject(NET_WORTH);
  @observable ACCREDITATION_EXPIRY_FORM = Validator.prepareFormObject(ACCREDITATION_EXPIRY);
  @observable removeFileIdsList = [];
  @observable stepToBeRendered = '';
  @observable filters = false;
  @observable firstInit = '';
  @observable userData = null;
  @observable accreditationData = { ira: null, individual: null, entity: null };
  @observable requestState = {
    filters: false,
    search: {
    },
  };
  @observable data = [];
  @observable accreditaionMethod = null;
  @observable accreditationDetails = {};
  @observable userAccredetiationState = undefined;
  @observable selectedAccountStatus = undefined;
  @observable showAccountList = true;
  @action
  initRequest = (reqParams) => {
    const {
      keyword, method, type, status, startDate, endDate,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    let params = {
      search: keyword,
      method: method !== 'ALL' ? method : null,
      type: type !== 'ALL' ? type : null,
      page: reqParams ? reqParams.page : 1,
    };
    if (status && status !== '') {
      params = {
        ...params,
        status,
      };
    }
    this.requestState.page = params.page;
    if (startDate && endDate) {
      params = {
        ...params,
        ...{ accountCreateFromDate: startDate, accountCreateToDate: endDate },
      };
    }
    this.data = graphql({
      client,
      query: listAccreditation,
      variables: params,
      fetchPolicy: 'network-only',
    });
  }

  @action
  resetModalForm = () => {
    this.CONFIRM_ACCREDITATION_FRM = Validator.prepareFormObject(CONFIRM_ACCREDITATION);
  }
  @computed get count() {
    return (this.data.data
      && this.data.data.listAccreditation
      && toJS(this.data.data.listAccreditation.resultCount)
    ) || 0;
  }

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  setFieldVal(field, val) {
    this[field] = val;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  accreditationMethodChange = (e, form, result) => {
    this[form] =
      Validator.onChange(this[form], Validator.pullValues(e, result));
  }

  @action
  incomeEvidenceChange = (e, result) => {
    this.INCOME_EVIDENCE_FORM =
      Validator.onChange(this.INCOME_EVIDENCE_FORM, Validator.pullValues(e, result));
  }

  @action
  verificationFormChange = (e, result) => {
    this.formChange(e, result, 'VERIFICATION_REQUEST_FORM');
  }

  @action
  netWorthChange = (e, result) => {
    this.formChange(e, result, 'NET_WORTH_FORM');
  }

  @action
  checkFormValid = (form, multiForm, showErrors) => {
    this[form] = Validator.validateForm(this[form], multiForm, showErrors, false);
  }

  getFileUploadEnum = accountType => ACCREDITATION_FILE_UPLOAD_ENUMS[accountType];

  @action
  setFileUploadData = (form, field, files, accountType, accreditationMethod) => {
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getFileUploadEnum(accountType);
        const tags = [accreditationMethod];
        if (accreditationMethod === 'Income') {
          tags.push(this.getFileUploadEnum(field));
        }
        this.setFormFileArray(form, field, 'showLoader', true);
        fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR', '', '', tags).then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(form, field, 'fileData', file);
            this.setFormFileArray(form, field, 'preSignedUrl', preSignedUrl);
            this.setFormFileArray(form, field, 'fileId', fileId);
            this.setFormFileArray(form, field, 'value', fileData.fileName);
            this.setFormFileArray(form, field, 'error', undefined);
            this.checkFormValid(form, false, false);
            this.setFormFileArray(form, field, 'showLoader', false);
          }).catch((error) => {
            this.setFormFileArray(form, field, 'showLoader', false);
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
          });
        }).catch((error) => {
          this.setFormFileArray(form, field, 'showLoader', false);
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        });
      });
    }
  }

  @action
  removeUploadedData = (form, field, index = null) => {
    let removeFileIds = '';
    if (index != null) {
      const fileId = this[form].fields[field].fileId.splice(index, 1);
      this[form].fields[field].value.splice(index, 1);
      removeFileIds = fileId;
    } else {
      const { fileId } = this[form].fields[field];
      removeFileIds = fileId;
      this.setFormFileArray(form, field, 'fileId', '');
      this.setFormFileArray(form, field, 'fileData', '');
      this.setFormFileArray(form, field, 'value', '');
      this.setFormFileArray(form, field, 'preSignedUrl', '');
    }
    this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
    this.setFormFileArray(form, field, 'error', undefined);
    this.setFormFileArray(form, field, 'showLoader', false);
    this.checkFormValid(form, false, false);
  }

  @action
  setFormFileArray = (formName, field, getField, value) => {
    if (formName === 'ASSETS_UPLOAD_DOC_FORM' && field === 'statementDoc' && getField !== 'showLoader' && getField !== 'error') {
      this[formName].fields[field][getField].push(value);
    } else {
      this[formName].fields[field][getField] = value;
    }
  }

  @action
  removeUploadedFiles = () => {
    const fileList = toJS(this.removeFileIdsList);
    if (fileList.length) {
      forEach(fileList, (fileId) => {
        fileUpload.removeUploadedData(fileId).then(() => {
        }).catch((error) => {
          uiStore.setErrors(error.message);
        });
      });
      this.removeFileIdsList = [];
    }
  }

  @action
  resetAccreditation = (form) => {
    Validator.resetFormData(form);
  }

  @action
  resetAllForms = () => {
    const forms = ['ACCREDITATION_FORM', 'FILTER_FRM', 'CONFIRM_ACCREDITATION_FRM', 'ENTITY_ACCREDITATION_FORM', 'INCOME_EVIDENCE_FORM', 'TRUST_ENTITY_ACCREDITATION_FRM', 'VERIFICATION_REQUEST_FORM', 'INCOME_UPLOAD_DOC_FORM', 'ASSETS_UPLOAD_DOC_FORM', 'NET_WORTH_FORM'];
    forms.forEach((formName) => {
      Validator.resetFormData(this[formName]);
    });
    this.setStepToBeRendered(0);
    this.firstInit = '';
  }

  @action
  setAccreditationMethod = (form, value) => {
    this[form] =
      Validator.onChange(this[form], { name: 'method', value });
  }
  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }
  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      const date = DataFormatter.getDate(value.formattedValue, true, name);
      this.requestState.search[name] = date;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      const temp = { ...this.requestState };
      temp.search[name] = { ...this.requestState.search };
      this.requestState = temp;
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }
  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get loading() {
    return this.data.loading;
  }
  @computed get accreditations() {
    return (this.data && this.data.data && this.data.data.listAccreditation &&
      this.data.data.listAccreditation.accreditation) || [];
  }

  @action
  changeFormObject = (formObj, formArray) => {
    this[formObj] = Validator.prepareFormObject(formArray);
  }

  @action
  checkFormIsValid = (form) => {
    this[form] = Validator.validateForm(this[form], false, false);
  }

  formValidCheck = (forms) => {
    const notOkForms = forms.filter((form) => {
      this.checkFormIsValid(form);
      if (form === 'ACCREDITATION_FORM' && !this.accreditaionMethod) {
        return true;
      }
      return !this[form].meta.isValid;
    });
    return notOkForms;
  }

  isAllFormValidCheck = (type) => {
    const forms = {
      ACCREDITATION_FORM: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12],
      NET_WORTH_FORM: [3, 4, 7, 8, 11, 12],
      INCOME_EVIDENCE_FORM: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      VERIFICATION_REQUEST_FORM: [1, 3, 5, 7, 9, 11],
      ASSETS_UPLOAD_DOC_FORM: [4, 6, 8, 10],
      INCOME_UPLOAD_DOC_FORM: [2, 12],
      ENTITY_ACCREDITATION_FORM: [],
      TRUST_ENTITY_ACCREDITATION_FRM: [7, 8, 9, 10, 11, 12],
    };
    const formList = [];
    forEach(forms, (form, key) => {
      if (form.includes(type)) {
        formList.push(key);
      }
    });
    const notOkForms = this.formValidCheck(formList);
    return formList.length > 0 && notOkForms.length === 0;
  }

  formType = (accreditationType) => {
    let formType = 0;
    if ((this.ACCREDITATION_FORM.fields.method.value === 'INCOME' || this.ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_INCOME') && this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest') {
      if (accreditationType === 1) {
        formType = 1;
      } else if (accreditationType === 3) {
        formType = 11;
      }
    } else if ((this.ACCREDITATION_FORM.fields.method.value === 'INCOME' || this.ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_INCOME') && this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocument') {
      if (accreditationType === 1) {
        formType = 2;
      } else if (accreditationType === 3) {
        formType = 12;
      }
    } else if ((this.ACCREDITATION_FORM.fields.method.value === 'ASSETS' || this.ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_ASSETS') && this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest') {
      if (accreditationType === 1) {
        formType = 3;
      } else if (accreditationType === 2) {
        formType = 5;
      } else if (accreditationType === 3) {
        if (this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS') {
          formType = 7;
        } else if (this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'REVOCABLE_TRUST_ASSETS') {
          formType = 9;
        }
      }
    } else if ((this.ACCREDITATION_FORM.fields.method.value === 'ASSETS' || this.ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_ASSETS') && this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocument') {
      if (accreditationType === 1) {
        formType = 4;
      } else if (accreditationType === 2) {
        formType = 6;
      } else if (accreditationType === 3) {
        if (this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS') {
          formType = 8;
        } else if (this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'REVOCABLE_TRUST_ASSETS') {
          formType = 10;
        }
      }
    } else if (this.ACCREDITATION_FORM.fields.method.value === 'OWNERS_ACCREDITATED' || this.ACCREDITATION_FORM.fields.method.value === 'OWNERS_QUALIFIED') {
      if (this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest') {
        formType = 5;
      } else if (this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocument') {
        formType = 6;
      }
    }
    return formType;
  }

  @action
  updateAccreditation = (form, accountId, accountType, formType = 0) => {
    uiStore.setProgress();
    let hasVerifier = null;
    let userAccreditationDetails = '';
    if (form === 'ENTITY_ACCREDITATION_FORM') {
      const accreForm = Validator.evaluateFormData(this.ACCREDITATION_FORM.fields);
      const networthForm = Validator.evaluateFormData(this.NET_WORTH_FORM.fields);
      userAccreditationDetails = cleanDeep({ ...accreForm, ...networthForm });
    } else {
      userAccreditationDetails = Validator.evaluateFormData(this[form].fields);
    }
    if (form === 'INCOME_UPLOAD_DOC_FORM' || form === 'ASSETS_UPLOAD_DOC_FORM') {
      const fileUploadData = userAccreditationDetails.assetsUpload;
      userAccreditationDetails.assetsUpload = [];
      forEach(fileUploadData, (file, key) => {
        const fileObj = {};
        fileObj.type = key === 'statementDoc' ? 'ASSETS' : key === 'incomeDocLastYear' ? 'INCOME_2017' : 'INCOME_2016';
        fileObj.fileInfo = file;
        userAccreditationDetails.assetsUpload.push(fileObj);
      });
      this.VERIFICATION_REQUEST_FORM = Validator.prepareFormObject(VERIFICATION_REQUEST);
      hasVerifier = false;
    } else if (form === 'VERIFICATION_REQUEST_FORM') {
      this.INCOME_UPLOAD_DOC_FORM = Validator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
      this.ASSETS_UPLOAD_DOC_FORM = Validator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
      hasVerifier = true;
    }
    if (formType) {
      userAccreditationDetails.isPartialProfile =
        !this.isAllFormValidCheck(this.formType(formType));
    }
    const payLoad = {
      id: userDetailsStore.currentUserId,
      accountId,
      accountType,
      userAccreditationDetails,
    };
    if (hasVerifier !== null) {
      payLoad.hasVerifier = hasVerifier;
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateAccreditation,
          variables: payLoad,
          refetchQueries: [{
            query: userAccreditationQuery,
            variables: {
              userId: userDetailsStore.currentUserId,
            },
          }],
        })
        .then(() => resolve())
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject();
        })
        .finally(() => uiStore.setProgress(false));
    });
  }

  @action
  updateAccreditationAction = (accreditationAction, accountId, userId, accountType) => {
    uiStore.setProgress();
    const comment = Validator.evaluateFormData(this.CONFIRM_ACCREDITATION_FRM.fields);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: approveOrDeclineForAccreditationRequest,
          variables: {
            action: accreditationAction,
            accountId,
            userId,
            accountType,
            comment: comment.justifyDescription,
          },
          refetchQueries: [{ query: listAccreditation, variables: { page: 1 } }],
        })
        .then(() => resolve())
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject();
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setFileFormData = (filesData) => {
    if (filesData && filesData.length) {
      this.INCOME_UPLOAD_DOC_FORM = Validator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
      this.ASSETS_UPLOAD_DOC_FORM = Validator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
      forEach(filesData, (file) => {
        const field = file.type === 'ASSETS' ? 'statementDoc' : file.type === 'INCOME_2017' ? 'incomeDocLastYear' : 'incomeDocSecondLastYear';
        if (file.fileInfo) {
          if (file.type === 'ASSETS') {
            forEach(file.fileInfo, (f) => {
              this.ASSETS_UPLOAD_DOC_FORM.fields[field].fileId.push(f.fileId);
              this.ASSETS_UPLOAD_DOC_FORM.fields[field].value.push(f.fileName);
            });
          } else {
            this.INCOME_UPLOAD_DOC_FORM.fields[field].fileId =
              file.fileInfo && file.fileInfo.length && file.fileInfo[0].fileId;
            this.INCOME_UPLOAD_DOC_FORM.fields[field].value =
              file.fileInfo && file.fileInfo.length && file.fileInfo[0].fileName;
          }
        }
      });
    }
  }

  @action
  setTrustEntityAccreditationData = (data) => {
    if (data) {
      this.ACCREDITATION_FORM = Validator.prepareFormObject(ACCREDITATION_METHODS_ENTITY);
      this.TRUST_ENTITY_ACCREDITATION_FRM = Validator.prepareFormObject(TRUST_ENTITY_ACCREDITATION);
      if (data.method === 'ASSETS') {
        this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value = 'ASSETS';
        this.ACCREDITATION_FORM.fields.method.value = 'ASSETS';
      } else {
        if (data.method === 'REVOCABLE_TRUST_ASSETS' || data.method === 'REVOCABLE_TRUST_INCOME') {
          this.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value = 'REVOCABLE_TRUST_ASSETS';
          this.ACCREDITATION_FORM.fields.method.value = data.method;
        }
        this.ACCREDITATION_FORM.fields.grantorName.value = data.grantorName;
      }
    }
  }

  @action
  setIncomeEvidenceData = (data) => {
    if (data) {
      this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value = (data.assetsUpload && data.assetsUpload.length) ? 'uploaddocument' : (data.verifier && data.verifier.role) ? 'verificationrequest' : '';
    }
  }

  @action
  checkFormValid = (form, multiForm, showErrors) => {
    this[form] = Validator.validateForm(this[form], multiForm, showErrors, false);
  }

  @action
  getUserAccreditation = () => new Promise((res) => {
    if (userDetailsStore.currentUserId) {
      this.userData = graphql({
        client,
        query: userAccreditationQuery,
        fetchPolicy: 'network-only',
        variables: { userId: userDetailsStore.currentUserId },
        onFetch: () => { res(); },
        onError: () => { Helper.toast('Something went wrong, please try again later.', 'error'); },
      });
    }
  })

  @computed get userDetails() {
    const details = (this.userData.data && toJS(this.userData.data.user)) || {};
    return details;
  }

  @action
  setFormData = (form, ref, accountType) => {
    const { userDetails } = this;
    const entityAccreditation = userDetails && userDetails.roles &&
      userDetails.roles.find(role => role.name === accountType);
    const appData = accountType === 'entity' ? entityAccreditation && entityAccreditation.details : userDetails;
    if (!appData) {
      return false;
    }
    if (form === 'TRUST_ENTITY_ACCREDITATION_FRM') {
      this.setTrustEntityAccreditationData(appData.accreditation);
      this.checkFormIsValid('ACCREDITATION_FORM', false, false);
    } else if (form === 'INCOME_EVIDENCE_FORM') {
      this.setIncomeEvidenceData(appData.accreditation);
    } else if (form !== 'INCOME_UPLOAD_DOC_FORM' && form !== 'ASSETS_UPLOAD_DOC_FORM') {
      this[form] = Validator.setFormData(this[form], appData, ref);
      if (form === 'ACCREDITATION_FORM') {
        this.accreditaionMethod = appData.accreditation.method;
      }
    } else {
      this.setFileFormData(appData.accreditation && appData.accreditation.assetsUpload);
      this.checkFormValid('INCOME_UPLOAD_DOC_FORM', false, false);
      this.checkFormValid('ASSETS_UPLOAD_DOC_FORM', false, false);
    }
    this.checkFormValid(form, false, false);
    return false;
  }

  @action
  initiateAccreditation = () => {
    const { userDetails } = this;
    const entityAccreditation = userDetails && userDetails.roles &&
      userDetails.roles.find(role => role.name === 'entity');
    this.accreditationData.individual = userDetails && userDetails.accreditation;
    this.accreditationData.ira = userDetails && userDetails.accreditation;
    this.accreditationData.entity = entityAccreditation && entityAccreditation.details &&
      entityAccreditation.details.accreditation;
  }

  @computed get isUserAccreditated() {
    let entityAccountDetails;
    if (this.userData && this.userData.data && this.userData.data.user) {
      if (this.userData.data.user.roles) {
        entityAccountDetails = find(this.userData.data.user.roles, { name: 'entity' });
      }
      if ((this.userData.data.user.accreditation &&
        this.userData.data.user.accreditation.status === 'APPROVED') ||
        (entityAccountDetails && entityAccountDetails.details &&
          entityAccountDetails.details.accreditation
          && entityAccountDetails.details.accreditation.status === 'APPROVED')
      ) {
        return true;
      }
    }
    return false;
  }

  @action
  accreditatedAccounts = () => {
    const aggreditationDetails = this.accreditationData;
    const inactiveResult =
      this.getKeyResult(mapValues(aggreditationDetails, a => a && a.status === null));
    const pendingResult = this.getKeyResult(mapValues(aggreditationDetails, a => a && a.status === 'REQUESTED'));
    const notEligibalResult = this.getKeyResult(mapValues(aggreditationDetails, a => a && a.status === 'DECLINED'));
    const eligibalResult = this.getKeyResult(mapValues(aggreditationDetails, a => a && a.status === 'APPROVED'));
    const expiredResult = this.getKeyResult(mapValues(aggreditationDetails, a => a && this.checkIsAccreditationExpired(a.expiration) === 'EXPIRED'));
    this.accreditationDetails.inactiveAccreditation = inactiveResult;
    this.accreditationDetails.pendingAccreditation = pendingResult;
    this.accreditationDetails.notEligibleAccreditation = notEligibalResult;
    this.accreditationDetails.eligibleAccreditation = eligibalResult;
    this.accreditationDetails.expiredAccreditation = expiredResult;
  }
  getKeyResult = (dataObj) => {
    const resultArr = [];
    if (dataObj) {
      forOwn(dataObj, (value, key) => {
        if (value === true) {
          resultArr.push(key);
        }
      });
    }
    return resultArr;
  }
  @action
  userAccreditatedStatus = (accountSelected = undefined, regulationCheck = false) => {
    // let userAccredetiationStateValue = '';
    // const {
    //   eligibleAccreditation,
    //   inactiveAccreditation,
    //   notEligibleAccreditation,
    //   pendingAccreditation,
    //   expiredAccreditation,
    // } = this.accreditationDetails;

    // if (eligibleAccreditation) {
    //   if (eligibleAccreditation.length <= 0) {
    //     if (expiredAccreditation.length) {
    //       this.userAccredetiationState = 'EXPIRED';
    //     } else if (pendingAccreditation.length) {
    //       this.userAccredetiationState = 'PENDING';
    //     } else if (notEligibleAccreditation.length) {
    //       this.userAccredetiationState = 'NOT_ELGIBLE';
    //     } else if (inactiveAccreditation.length) {
    //       this.userAccredetiationState = 'INACTIVE';
    //     }
    //   } else {
    //     this.userAccredetiationState = 'ELGIBLE';
    //   }
    // }
    const aggreditationDetails = this.accreditationData;
    const currentSelectedAccount = accountSelected === '' ? '' :
      accountSelected || userDetailsStore.currentActiveAccountDetails.name;
    const intialAccountStatus = this.userSelectedAccountStatus(currentSelectedAccount);
    this.setUserSelectedAccountStatus(intialAccountStatus);
    if (intialAccountStatus === 'FULL' && regulationCheck) {
      let currentAcitveObject = {};
      if (aggreditationDetails) {
        currentAcitveObject =
          find(aggreditationDetails, (value, key) => key === currentSelectedAccount);
      }
      console.log('currentAcitveObject==>', currentAcitveObject);
      const accountStatus = this.checkIsAccreditationExpired(currentAcitveObject.expiration)
        === 'EXPIRED' ? 'EXPIRED' : currentAcitveObject.status;
      switch (accountStatus) {
        case 'REQUESTED':
          this.userAccredetiationState = 'PENDING';
          break;
        case 'DECLINED':
          this.userAccredetiationState = 'NOT_ELGIBLE';
          break;
        case 'APPROVED':
          this.userAccredetiationState = 'ELGIBLE';
          break;
        case 'EXPIRED':
          this.userAccredetiationState = 'EXPIRED';
          break;
        default:
          this.userAccredetiationState = 'INACTIVE';
          break;
      }
    } else if (intialAccountStatus === 'FULL') {
      this.userAccredetiationState = 'ELGIBLE';
    }
    // this.selectedAccountStatus = intialAccountStatus;
  }
  @action
  setUserSelectedAccountStatus = (intialAccountStatus) => {
    this.selectedAccountStatus = intialAccountStatus;
  }
  @computed get accountAccreditatedStatus() {
    let userAccredetiationStateValue = '';
    const aggreditationDetails = this.accreditationData;
    const currentSelectedAccount = userDetailsStore.currentActiveAccountDetails.name;
    let currentAcitveObject = {};
    if (aggreditationDetails) {
      currentAcitveObject =
        find(aggreditationDetails, (value, key) => key === currentSelectedAccount);
    }
    console.log('currentAcitveObject==>', currentAcitveObject);
    const accountStatus = this.checkIsAccreditationExpired(currentAcitveObject.expiration) === 'EXPIRED' ? 'EXPIRED' : currentAcitveObject.status;
    switch (accountStatus) {
      case 'REQUESTED':
        userAccredetiationStateValue = 'PENDING';
        break;
      case 'DECLINED':
        userAccredetiationStateValue = 'NOT_ELGIBLE';
        break;
      case 'APPROVED':
        userAccredetiationStateValue = 'ELGIBLE';
        break;
      case 'EXPIRED':
        userAccredetiationStateValue = 'EXPIRED';
        break;
      default:
        userAccredetiationStateValue = 'INACTIVE';
        break;
    }
    return userAccredetiationStateValue;
  }
  userSelectedAccountStatus = (selectedAccount) => {
    const {
      activeAccounts,
      frozenAccounts,
      partialAccounts,
      processingAccounts,
    } = userDetailsStore.signupStatus;
    let accountStatusFound = '';
    if (selectedAccount) {
      const activeArr = activeAccounts.length ?
        filter(activeAccounts, o => o === selectedAccount) : activeAccounts;
      const frozenArr = frozenAccounts.length ?
        filter(frozenAccounts, o => o === selectedAccount) : frozenAccounts;
      const PartialArr = partialAccounts.length ?
        filter(partialAccounts, o => o === selectedAccount) : partialAccounts;
      const ProcessingArr = processingAccounts.length ?
        filter(processingAccounts, o => o === selectedAccount) : processingAccounts;
      if (activeArr.length) {
        accountStatusFound = 'FULL';
      } else if (ProcessingArr.length) {
        accountStatusFound = 'PROCESSING';
      } else if (frozenArr.length) {
        accountStatusFound = 'FROZEN';
      } else if (PartialArr.length) {
        accountStatusFound = 'PARTIAL';
      } else {
        accountStatusFound = 'PARTIAL';
      }
    } else {
      accountStatusFound = 'PARTIAL';
    }
    return accountStatusFound;
  }
  @action
  validInvestmentAccounts = () => {
    const { eligibleAccreditation, pendingAccreditation } = this.accreditationDetails;
    let validAccreditedArr = [];
    const investAccountArr = investmentStore.investAccTypes.values;
    let resultArr = [];
    if (this.userAccredetiationState === 'ELGIBLE' && eligibleAccreditation.length) {
      validAccreditedArr = [...eligibleAccreditation];
    } else if (this.userAccredetiationState === 'PENDING' && pendingAccreditation.length) {
      validAccreditedArr = [...pendingAccreditation];
    }
    if (validAccreditedArr &&
      validAccreditedArr.length &&
      investmentStore.investAccTypes.values.length) {
      forEach(validAccreditedArr, (account) => {
        const tempArr = remove(investAccountArr, { value: account });
        resultArr = [...resultArr, ...tempArr];
      });
      investmentStore.investAccTypes.values = resultArr;
    }
  }
  @action
  resetUserAccreditatedStatus = () => {
    this.userAccredetiationState = undefined;
    this.selectedAccountStatus = undefined;
    this.showAccountList = true;
    investmentStore.resetAccTypeChanged();
  }
  checkIsAccreditationExpired = (expirationDate) => {
    let dateDiff = '';
    if (expirationDate) {
      const validDate = new Date(expirationDate);
      dateDiff = DataFormatter.diffDays(validDate);
      return dateDiff === 0 ? 'EXPIRED' : 'ACTIVE';
    }
    return dateDiff;
  }
  @action
  updateAccreditationExpiray = () => {

  }
  @action
  expirationChange = (e, result) => {
    this.formChange(e, result, 'ACCREDITATION_EXPIRY_FORM');
  }
  @action
  resetAccreditationExpirayForm = (form) => {
    Validator.resetFormData(this[form]);
  }
  @action
  changeShowAccountListFlag = (statusValue) => {
    this.showAccountList = statusValue;
  }
}
export default new AccreditationStore();
