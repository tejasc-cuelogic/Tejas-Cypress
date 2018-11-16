import { observable, action, computed, toJS } from 'mobx';
import isArray from 'lodash/isArray';
import { INCOME_EVIDENCE, ACCREDITATION_METHODS, VERIFICATION_REQUEST, INCOME_UPLOAD_DOCUMENTS, ASSETS_UPLOAD_DOCUMENTS, NET_WORTH, ENTITY_ACCREDITATION_METHODS } from '../../../../constants/investmentLimit';
import { FormValidator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { FILTER_META, CONFIRM_ACCREDITATION } from '../../../../constants/accreditationRequests';

export class AccreditationStore {
  @observable ACCREDITATION_FORM = FormValidator.prepareFormObject(ACCREDITATION_METHODS);
  @observable ENTITY_ACCREDITATION_FORM =
    FormValidator.prepareFormObject(ENTITY_ACCREDITATION_METHODS);
  @observable INCOME_EVIDENCE_FORM = FormValidator.prepareFormObject(INCOME_EVIDENCE);
  @observable VERIFICATION_REQUEST_FORM = FormValidator.prepareFormObject(VERIFICATION_REQUEST);
  @observable INCOME_UPLOAD_DOC_FORM = FormValidator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
  @observable ASSETS_UPLOAD_DOC_FORM = FormValidator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
  @observable NET_WORTH_FORM = FormValidator.prepareFormObject(NET_WORTH);
  @observable FILTER_FRM = FormValidator.prepareFormObject(FILTER_META);
  @observable CONFIRM_ACCREDITATION_FRM = FormValidator.prepareFormObject(CONFIRM_ACCREDITATION);
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

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  accreditationMethodChange = (e, form, result) => {
    this[form] =
      FormValidator.onChange(this[form], FormValidator.pullValues(e, result));
  }

  @action
  incomeEvidenceChange = (e, result) => {
    this.INCOME_EVIDENCE_FORM =
      FormValidator.onChange(this.INCOME_EVIDENCE_FORM, FormValidator.pullValues(e, result));
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
  setFileUploadData = (form, field, files) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: fileData.fileName },
    );
  }

  @action
  removeUploadedData = (form, field) => {
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: '' },
    );
  }

  @action
  resetAccreditation = (form) => {
    FormValidator.resetFormData(form);
    this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value = 'verificationrequest';
  }

  @action
  setAccreditationMethod = (value) => {
    this.ACCREDITATION_FORM =
      FormValidator.onChange(this.ACCREDITATION_FORM, { name: 'accreditationMethods', value });
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
}
export default new AccreditationStore();
