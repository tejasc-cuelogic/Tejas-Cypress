import { observable, action } from 'mobx';
import { set } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as publicClient } from '../../../../api/publicApi';
import { FormValidator, DataFormatter, MobxApollo, Utilities as Utils } from '../../../../helper';
import { nsUiStore } from '../../index';
import { fileUpload } from '../../../actions';
import Helper from '../../../../helper/utility';

export default class DataModelStore {
  result = [];

  gqlRef = {};

  currTime;

  // 0: error, 1: loading, 2: success
  auStatus = null;

  loading = false;

  client = publicClient;

  currentScore = 0;

  removeFileIdsList = [];

  requestState = {
    lek: { 'page-1': null },
    skip: 0,
    page: 1,
    perPage: 25,
    filters: false,
    search: {
    },
  };

  constructor(queryMutations) {
    this.auStatus = null;
    this.gqlRef = queryMutations;
  }

  setFieldValue = (field, value, objRef = false, isArray = false) => {
    if (isArray) {
      this[field] = this[field].concat(value);
    } else if (objRef) {
      const tempRef = this[field];
      this[field] = set(tempRef, objRef, value);
      this[field] = tempRef;
    } else {
      this[field] = value;
    }
  }

  executeMutation = async (params) => {
    const payLoad = { message: false, clientType: false, setLoader: undefined, respBack: false, ...params };
    const apolloClient = payLoad.clientType === 'PUBLIC' ? publicClient : client;
    this.setLoader(payLoad.setLoader);
    this.loading = true;
    this.auStatus = 1;
    let result = {};
    try {
      result = await apolloClient.mutate({
        mutation: this.gqlRef[payLoad.mutation],
        variables: payLoad.variables,
        refetchQueries: payLoad.refetchQueries || [],
      });
      nsUiStore.filterLoaderByOperation(payLoad.setLoader);
      if (payLoad.message && payLoad.message !== false && payLoad.message && payLoad.message.success) {
        Utils.toast(payLoad.message && payLoad.message.success, 'success');
      }
      this.auStatus = 2;
      this.loading = false;
      return result || true;
    } catch (err) {
      this.loading = false;
      nsUiStore.filterLoaderByOperation(payLoad.setLoader);
      this.auStatus = 0;
      if (payLoad.message !== false) {
        Utils.toast(payLoad.message && (payLoad.message.error || 'Error while performing operation.'), 'error');
      }
      nsUiStore.setFieldValue('errors', DataFormatter.getSimpleErr(err));
      return payLoad.respBack ? ({ error: Utils.cleanMsg(err.toString()) }) : false;
    }
  }

  executeQuery = params => new Promise((res, rej) => {
    const payLoad = { clientType: false, setLoader: undefined, ...params };
    const apolloClient = payLoad.clientType === 'PUBLIC' ? publicClient : client;
    this.setLoader(payLoad.setLoader);
    this.auStatus = 1;
    this.loading = true;
    MobxApollo.graphql({
      client: apolloClient,
      query: this.gqlRef[payLoad.query],
      fetchPolicy: payLoad.fetchPolicy || 'network-only',
      variables: { ...params.variables },
      onFetch: (data) => {
        if (data) {
          this.auStatus = 2;
          this.loading = false;
          res(data);
          nsUiStore.filterLoaderByOperation(payLoad.setLoader);
        }
        this.currTime = +new Date();
      },
      onError: (e) => {
        this.auStatus = 0;
        this.loading = false;
        nsUiStore.filterLoaderByOperation(payLoad.setLoader);
        rej(e);
      },
    });
  });

  setLoader = (setLoader) => {
    if (setLoader) {
      nsUiStore.setFieldValue('loadingArray', setLoader, false, true);
    }
  }

  formChange = (e, result, form, type) => {
    const formName = Array.isArray(form) ? form[0] : form;
    if (Array.isArray(form)) {
      this[formName] = FormValidator.onArrayFieldChange(
        this[formName],
        FormValidator.pullValues(e, result),
        form[1],
        form[2],
        type,
      );
    } else {
      this[formName] = FormValidator.onChange(this[formName], FormValidator.pullValues(e, result), type);
    }
    this.currTime = +new Date();
  };

  passwordChange = (e, result, form) => {
    FormValidator.onChange(this[form], FormValidator.pullValuesForPassword(e, result));
    if (e.score !== undefined) {
      this.currentScore = e.score;
    }
  };

  eventFormChange = (e, formName) => {
    this[formName] = FormValidator.onChange(this[formName], { name: e.name, value: e.value });
  };

  setAddressFields = (place, form) => {
    FormValidator.setAddressFields(place, this[form]);
  }

  setFileUploadData = (form, field, multiple = false, index = null, arrayName = null, stepName, files, { userRole, investorId, applicationId, offeringId, applicationIssuerId, tags }) => {
    const path = (arrayName && index !== null) ? `fields.${arrayName}[${index}].${field}` : `fields.${field}`;
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    this[form].fields[field].showLoader = true;
    fileUpload.setFileUploadData(applicationId, fileData, stepName, userRole, applicationIssuerId, offeringId, tags, { investorId }).then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
        .then(() => {
          this.setFieldValue(form, multiple ? [...this[form].fields[field].fileId, fileId] : fileId, `${path}.fileId`);
          this.setFieldValue(form, multiple ? [...this[form].fields[field].preSignedUrl, preSignedUrl] : preSignedUrl, `${path}.preSignedUrl`);
          this.setFieldValue(form, multiple ? [...this[form].fields[field].fileData, file] : file, `${path}.fileData`);
          this.setFieldValue(form, undefined, `${path}.error`);
          this.setFieldValue(form, false, `${path}.showLoader`);
          this.setFieldValue(form, multiple ? [...this[form].fields[field].value, fileData.fileName] : fileData.fileName, `${path}.value`);
        })
        .catch((e) => {
          window.logger(e);
          this.setFieldValue(form, false, `${path}.showLoader`);
          Helper.toast('Something went wrong, please try again later.', 'error');
        });
    })).catch((e) => {
      window.logger(e);
      this.setFieldValue(form, false, `${path}.showLoader`);
      Helper.toast('Something went wrong, please try again later.', 'error');
    });
  }

  removeUploadedData = (form, field, index = null, arrayName = null) => {
    const path = (arrayName && index !== null) ? `fields.${arrayName}[${index}].${field}` : `fields.${field}`;
    let removeFileIds = '';
    if (index !== null && arrayName) {
      const { fileId } = this[form].fields[arrayName][index][field];
      removeFileIds = fileId;
    } else if (index !== null) {
      const filesId = this[form].fields[field].fileId;
      removeFileIds = filesId[index];
    } else {
      const { fileId } = this[form].fields[field];
      removeFileIds = fileId;
    }
    if (index !== null && !arrayName) {
      const sField = JSON.parse(JSON.stringify({ ...this[form].fields[field] }));
      sField.fileId.splice(index, 1);
      sField.fileData.splice(index, 1);
      sField.value.splice(index, 1);
      sField.preSignedUrl.splice(index, 1);
      this.setFieldValue(form, sField, `${path}`);
    } else {
      this.setFieldValue(form, '', `${path}.fileId`);
      this.setFieldValue(form, '', `${path}.fileData`);
      this.setFieldValue(form, '', `${path}.value`);
      this.setFieldValue(form, '', `${path}.preSignedUrl`);
    }
    this.setFieldValue(form, undefined, `${path}.error`);
    this.setFieldValue(form, false, `${path}.showLoader`);
    this.setFieldValue('removeFileIdsList', [...this.removeFileIdsList, removeFileIds]);
  }

  maskChange = (values, field, form, type) => {
    const formName = Array.isArray(form) ? form[0] : form;
    const fieldValue = type ? values[`${type}Value`] : values.value; // floatValue
    if (Array.isArray(form)) {
      this[formName] = FormValidator.onArrayFieldChange(
        this[formName],
        { name: field, value: fieldValue },
        form[1],
        form[2],
      );
    } else {
      this[formName] = FormValidator.onChange(this[formName], { name: field, value: fieldValue });
    }
    this.currTime = +new Date();
  };

  validateForm = (formName) => {
    this[formName] = FormValidator.validateForm(this[formName]);
  }

  resetForm = (form) => {
    this[form] = FormValidator.resetFormData(this[form]);
  }

  resetAll = () => {
    this.client.clearStore();
  }

  setFormData = (form, elemRef, elementValue, subForm = false) => {
    if (subForm) {
      this[form][subForm].fields[elemRef].value = elementValue;
    } else {
      this[form].fields[elemRef].value = elementValue;
    }
  }

  initiateSearch = (srchParams) => {
    this.setFieldValue('requestState', { 'page-1': null }, 'lek');
    this.setFieldValue('requestState', 1, 'page');
    this.setFieldValue('requestState', srchParams, 'search');
    this.initRequest();
  }

  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value ? name === 'startDate' ? moment(new Date(`${value.formattedValue} 00:00:00`)).toISOString() : moment(new Date(`${value.formattedValue} 23:59:59`)).toISOString() : '';
      if ((this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '')
        || (this.requestState.search.startDate === '' && this.requestState.search.endDate === '')
      ) {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      const temp = { ...this.requestState };
      temp.search[name] = { ...this.requestState.search };
      this.setFieldValue('requestState', temp);
      if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }

  resetFilters = () => {
    this.requestState = {
      lek: { 'page-1': null },
      skip: 0,
      page: 1,
      perPage: 25,
      filters: false,
      search: {
      },
    };
  }
}

export const decorateDefault = {
  result: observable,
  removeFileIdsList: observable,
  currTime: observable,
  currentScore: observable,
  setFieldValue: action,
  formChange: action,
  maskChange: action,
  validateForm: action,
  executeQuery: action,
  executeMutation: action,
  resetAll: action,
  resetForm: action,
  passwordChange: action,
  eventFormChange: action,
  setAddressFields: action,
  setFileUploadData: action,
  setLoader: action,
  auStatus: observable.ref,
  loading: observable.ref,
  requestState: observable,
  initiateSearch: action,
  setInitiateSrch: action,
  setFormData: action,
  resetFilters: action,
};
