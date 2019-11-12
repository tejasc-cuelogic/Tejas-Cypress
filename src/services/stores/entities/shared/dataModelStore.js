import { observable, action } from 'mobx';
import { set, get } from 'lodash';
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

  stepToBeRendered = 0;

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
    const payLoad = { ...this.defaultParams, ...params };
    const apolloClient = payLoad.clientType === 'PUBLIC' ? publicClient : client;
    payLoad.removeLoader = get(payLoad, 'setLoader');
    nsUiStore.setLoader(payLoad.setLoader || payLoad.mutation);
    this.loading = true;
    this.auStatus = 1;
    let result = {};
    try {
      result = await apolloClient.mutate({
        mutation: this.gqlRef[payLoad.mutation],
        variables: payLoad.variables,
      });
      nsUiStore.filterLoaderByOperation(payLoad.mutation);
      if (get(payLoad, 'message') !== false && get(payLoad, 'message.success')) {
        Utils.toast(payLoad.message && payLoad.message.success, 'success');
      }
      this.auStatus = 2;
      this.loading = false;
      return result || true;
    } catch (err) {
      this.loading = false;
      // remove only loaders who are set exlplicity
      this.resetLoader(payLoad.removeLoader, payLoad.mutation);
      this.auStatus = 0;
      const errorMessage = { message: get(payLoad, 'message.error') || err.message };
      if (get(payLoad, 'message') && payLoad.showToastError) {
        Utils.toast(get(payLoad, 'message.error') || 'Error while performing operation.', 'error');
      } else if (!payLoad.showToastError && get(errorMessage, 'message')) {
        nsUiStore.setFieldValue('errors', DataFormatter.getSimpleErr(errorMessage));
      }
      return Promise.reject(errorMessage);
    }
  }

  executeQuery = params => new Promise((res, rej) => {
    const payLoad = { clientType: false, setLoader: undefined, removeLoader: undefined, ...params };
    payLoad.removeLoader = payLoad.setLoader;
    const apolloClient = payLoad.clientType === 'PUBLIC' ? publicClient : client;
    payLoad.removeLoader = get(payLoad, 'setLoader');
    nsUiStore.setLoader(payLoad.setLoader || payLoad.query);
    this.loading = true;
    this.auStatus = 1;
    // need to accept fetch policy from parameter
    MobxApollo.graphql({
      client: apolloClient,
      query: this.gqlRef[payLoad.query],
      fetchPolicy: 'network-only',
      variables: payLoad.variables,
      onFetch: (data) => {
        if (data) {
          this.auStatus = 2;
          this.loading = false;
          res(data);
          nsUiStore.filterLoaderByOperation(payLoad.query);
        }
        this.currTime = +new Date();
      },
      onError: (e) => {
        this.auStatus = 0;
        this.loading = false;
        // remove only loaders who are set exlplicity
        this.resetLoader(payLoad.removeLoader, payLoad.query);
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

  setFileUploadData = (form, field, steps, files, userRole) => {
    const file = files[0];
    const stepName = steps[field];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, stepName, userRole).then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this[form].fields[field].fileId = fileId;
      this[form].fields[field].preSignedUrl = preSignedUrl;
      this[form].fields[field].fileData = file;
      this[form] = FormValidator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
        .then(() => { })
        .catch(() => {
          Helper.toast('Something went wrong, please try again later.', 'error');
        })
        .finally(() => {
        });
    }));
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

  setStepToBeRendered = (step) => {
    this.setFieldValue('stepToBeRendered', step);
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
  currTime: observable,
  currentScore: observable,
  stepToBeRendered: observable,
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
  setLoader: action,
  auStatus: observable.ref,
  loading: observable.ref,
  requestState: observable,
  initiateSearch: action,
  setInitiateSrch: action,
  setFormData: action,
  resetFilters: action,
};
