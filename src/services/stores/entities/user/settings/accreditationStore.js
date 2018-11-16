import { observable, action, toJS, computed } from 'mobx';
import { forEach, isArray } from 'lodash';
import { INCOME_EVIDENCE, ACCREDITATION_METHODS, VERIFICATION_REQUEST, INCOME_UPLOAD_DOCUMENTS, ASSETS_UPLOAD_DOCUMENTS, NET_WORTH, ENTITY_ACCREDITATION_METHODS, TRUST_ENTITY_ACCREDITATION } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { uiStore, userDetailsStore } from '../../../index';
import { updateAccreditation } from '../../../queries/accreditation';
import { userDetailsQuery } from '../../../queries/users';
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
  @observable removeFileIdsList = [];
  @observable stepToBeRendered = '';
  @observable filters = false;
  @observable requestState = {
    filters: false,
    search: {
    },
  };
  @observable data = [];
  @action
  initRequest = (reqParams) => {
    const {
      keyword, method, type, startDate, endDate,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    let params = {
      search: keyword,
      method,
      type,
      page: reqParams ? reqParams.page : 1,
    };
    this.requestState.page = params.page;
    if (startDate && endDate) {
      params = {
        ...params,
        ...{ accountCreateFromDate: startDate, accountCreateToDate: endDate },
      };
    }
    this.data = [
      {
        id: 1,
        name: 'Alexandra Smith',
        createdAt: '7/12/2018',
        type: 'Asset',
        method: 'Verifier',
        boxLink: 'https://www.nextseed.com/',
      },
      {
        id: 2,
        name: 'Alexandra Smith',
        createdAt: '7/12/2018',
        type: 'Asset',
        method: 'Verifier',
        boxLink: 'https://www.nextseed.com/',
      },
    ];
  }
  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  isAllFormValidCheck = (type) => {
    const forms = {
      ACCREDITATION_FORM: [1, 2, 3],
      NET_WORTH_FORM: [1, 2, 3],
      INCOME_EVIDENCE_FORM: [1, 2, 3, 4, 5, 6],
      VERIFICATION_REQUEST_FORM: [1, 4],
      ASSETS_UPLOAD_DOC_FORM: [2, 5],
      INCOME_UPLOAD_DOC_FORM: [3, 6],
      ENTITY_ACCREDITATION_FORM: [4, 5, 6],
      TRUST_ENTITY_ACCREDITATION_FRM: [7],
    };
    const formList = [];
    forEach(forms, (form, key) => {
      if (form.includes(type)) {
        formList.push(key);
      }
    });
    const notOkForms = formList.filter(form => !this[form].meta.isValid);
    return notOkForms.length === 0;
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

  getFileUploadEnum = field => ACCREDITATION_FILE_UPLOAD_ENUMS[field];

  @action
  setFileUploadData = (form, field, files) => {
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getFileUploadEnum(field);
        this.setFormFileArray(form, field, 'showLoader', true);
        fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR').then((result) => {
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
    this[formName].fields[field][getField] = value;
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
    this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value = 'verificationrequest';
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
      this.requestState.search[name] = value;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
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
    return (this.data) || [];
  }

  @action
  updateAccreditation = (form, accountId, accountType) => {
    uiStore.setProgress();
    const userAccreditationDetails = Validator.evaluateFormData(this[form].fields);
    if (form === 'INCOME_UPLOAD_DOC_FORM' || form === 'ASSETS_UPLOAD_DOC_FORM') {
      const fileUploadData = userAccreditationDetails.assetsUpload;
      userAccreditationDetails.assetsUpload = [];
      forEach(fileUploadData, (file, key) => {
        const fileObj = {};
        fileObj.type = key === 'statementDoc' ? 'ASSETS' : key === 'incomeDocLastYear' ? 'INCOME_2017' : 'INCOME_2016';
        fileObj.fileInfo = file;
        userAccreditationDetails.assetsUpload.push(fileObj);
      });
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateAccreditation,
          variables: {
            id: userDetailsStore.currentUserId,
            accountId,
            accountType,
            userAccreditationDetails,
          },
          refetchQueries: [{
            query: userDetailsQuery,
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
  setFormData = (form, ref, accountType) => {
    const { userDetails } = userDetailsStore;
    const entityAccreditation = userDetails && userDetails.roles &&
    userDetails.roles.find(role => role.name === accountType);
    const appData = accountType === 'entity' ? entityAccreditation && entityAccreditation.details : userDetails;
    if (!appData) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], appData, ref);
    return false;
  }
}
export default new AccreditationStore();
