import { observable, action, toJS } from 'mobx';
import { set, forEach, isEmpty, get } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as publicClient } from '../../../../api/publicApi';
import { FormValidator, DataFormatter, MobxApollo, Utilities as Utils } from '../../../../helper';
import { nsUiStore, commonStore, uiStore } from '../../index';
import { fileUpload } from '../../../actions';
import Helper from '../../../../helper/utility';

export default class DataModelStore {
  result = [];

  initLoad = []

  gqlRef = {};

  currTime;

  showConfirmModal = false;

  // 0: error, 1: loading, 2: success
  auStatus = null;

  loading = false;

  apiHit = false;

  client = publicClient;

  currentScore = 0;

  stepToBeRendered = 0;

  removeFileIdsList = [];

  removeFileNamesList = [];

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
    this.currTime = +new Date();
  }

  removeUploadedFiles = (fromS3) => {
    if (fromS3) {
      const fileList = toJS(this.removeFileNamesList);
      if (fileList.length) {
        forEach(fileList, (fileName) => {
          commonStore.deleteCdnS3File(`offerings/${this.currentOfferingId}/${fileName}`).then(() => {
          }).catch((error) => {
            uiStore.setErrors(error.message);
          });
        });
        this.setFieldValue('removeFileNamesList', []);
      }
    } else {
      const fileList = toJS(this.removeFileIdsList);
      if (fileList.length) {
        forEach(fileList, (fileId) => {
          fileUpload.removeUploadedData(fileId).then(() => {
          }).catch((error) => {
            uiStore.setErrors(error.message);
          });
        });
        this.setFieldValue('removeFileIdsList', []);
      }
    }
    this.currTime = +new Date();
  }

  executeMutation = async (params) => {
    const payLoad = { ...this.defaultParams, ...params };
    const apolloClient = payLoad.clientType === 'PUBLIC' ? publicClient : client;
    payLoad.removeLoader = get(payLoad, 'setLoader');
    const loader = payLoad.setLoader || payLoad.mutation;
    nsUiStore.setLoader(loader);
    this.loading = true;
    this.auStatus = 1;
    let result = {};
    try {
      result = await apolloClient.mutate({
        mutation: this.gqlRef[payLoad.mutation],
        variables: payLoad.variables,
        refetchQueries: payLoad.refetchQueries || [],
      });
      nsUiStore.filterLoaderByOperation(loader);
      if (get(payLoad, 'message') !== false && get(payLoad, 'message.success')) {
        Utils.toast(payLoad.message && payLoad.message.success, 'success');
      }
      this.auStatus = 2;
      this.loading = false;
      return result || true;
    } catch (err) {
      this.loading = false;
      // remove only loaders who are set exlplicity
      this.resetLoader(payLoad.removeLoader, loader);
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
    const loader = payLoad.setLoader || payLoad.query;
    nsUiStore.setLoader(loader);
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
          nsUiStore.filterLoaderByOperation(loader);
        }
        this.currTime = +new Date();
      },
      onError: (e) => {
        this.auStatus = 0;
        this.loading = false;
        // remove only loaders who are set exlplicity
        this.resetLoader(payLoad.removeLoader, loader);
        rej(e);
      },
    });
  });

  setLoader = (setLoader) => {
    if (setLoader) {
      nsUiStore.setFieldValue('loadingArray', setLoader, false, true);
    }
    this.currTime = +new Date();
  }

  resetLoader = (removeLoader, operation) => {
    if (Array.isArray(removeLoader)) {
      removeLoader.map(item => (nsUiStore.filterLoaderByOperation(item)));
    } else {
      nsUiStore.filterLoaderByOperation(operation);
    }
    this.currTime = +new Date();
  }

  editorChange = (field, value, form, ref, index = undefined) => {
    if (index !== undefined) {
      this[form].fields[ref][index][field].value = value;
    } else {
      this[form].fields[field].value = value;
      this[form] = FormValidator.validateForm(this[form], true, false, false);
    }
    this.currTime = +new Date();
  }

  formChange = (e, result, form, type, checked = undefined) => {
    const formName = Array.isArray(form) ? form[0] : form;
    if (Array.isArray(form)) {
      this[formName] = FormValidator.onArrayFieldChange(
        this[formName],
        FormValidator.pullValues(e, result),
        form[1],
        form[2],
        type,
        checked,
      );
    } else {
      this[formName] = FormValidator.onChange(this[formName], FormValidator.pullValues(e, result), type, true, checked);
    }
    this.currTime = +new Date();
  };

  formChangeForMultilevelArray = (e, res, form, subForm, index, isArrayChange = false) => {
    if (isArrayChange) {
      this[form.parentForm][form.childForm] = FormValidator.onArrayFieldChange(
        this[form.parentForm][form.childForm],
        FormValidator.pullValues(e, res),
        subForm,
        index,
      );
    } else {
      this[form.parentForm][form.childForm] = FormValidator.onChange(this[form.parentForm][form.childForm], FormValidator.pullValues(e, res));
    }
    if (form.parentForm === 'DOCUMENT_UPLOAD_MAPPING_FRM') {
      // this.validateMappingForm();
      this.validateMappingForFormChange(form.childForm);
    }
    this.currTime = +new Date();
    // const dynamicFormFields = { ...this[form.parentForm][form.childForm].fields };
    // const mappedArr = [];
    // Object.keys(dynamicFormFields).forEach((key) => {
    //   const validObj = pickBy(dynamicFormFields[key], identity);
    //   const hasKey = has(validObj, 'defaultValuesMapping');
    //   if (hasKey) {
    //     const mappedOBj = { mappedKey: key, mappedVal: dynamicFormFields[key].defaultValuesMapping };
    //     mappedArr.push(mappedOBj);
    //   }
    // });
  };

  passwordChange = (e, result, form) => {
    FormValidator.onChange(this[form], FormValidator.pullValuesForPassword(e, result));
    if (e.score !== undefined) {
      this.currentScore = e.score;
    }
    this.currTime = +new Date();
  };

  eventFormChange = (e, formName) => {
    this[formName] = FormValidator.onChange(this[formName], { name: e.name, value: e.value });
    this.currTime = +new Date();
  };

  setAddressFields = (place, form) => {
    FormValidator.setAddressFields(place, this[form]);
    this.currTime = +new Date();
  }


  reOrderHandle = (orderedForm, form, arrayName) => {
    const content = toJS(orderedForm).map((d, index) => ({ ...d, order: { ...d.order, value: index + 1 } }));
    this.setFieldValue(form, content, `fields.${arrayName}`);
  }

  setMediaAttribute = (form, attr, value, field, index = -1, arrayName) => {
    const formName = Array.isArray(form) ? form[0] : form;
    if (index > -1) {
      this[formName].fields[arrayName][index][field][attr] = value;
    } else {
      this[formName].fields[field][attr] = value;
    }
    this.currTime = +new Date();
  }

  resetImageCropper = (form, field, index = -1, arrayName) => {
    const formName = Array.isArray(form) ? form[0] : form;
    const attributes = ['src', 'error', 'meta', 'base64String', 'responseUrl', 'value', 'preSignedUrl', 'confirmModal'];
    attributes.forEach((val) => {
      const typeCheck = index > -1 ? this[formName].fields[arrayName][index][field][val] : this[formName].fields[field][val];
      if ((typeof typeCheck === 'object') && (typeCheck !== null)) {
        if (index > -1) {
          this[formName].fields[arrayName][index][field][val] = {};
        } else {
          this[formName].fields[field][val] = {};
        }
      } else if (index > -1) {
        this[formName].fields[arrayName][index][field][val] = val === 'confirmModal' ? false : '';
      } else {
        this[formName].fields[field][val] = val === 'confirmModal' ? false : '';
      }
    });
    this.currTime = +new Date();
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
    this.currTime = +new Date();
  }

  uploadMedia = (name, form, path, files = false) => {
    const formName = Array.isArray(form) ? form[0] : form;
    const arrayName = Array.isArray(form) ? form[1] : false;
    const index = Array.isArray(form) ? form[2] : -1;
    const fileObj = {
      obj: files ? files[0] : index > -1 ? this[formName].fields[arrayName][index][name].base64String : this[formName].fields[name].base64String,
      name: Helper.sanitize(files ? files[0].name : index > -1 ? this[formName].fields[arrayName][index][name].fileName : this[formName].fields[name].fileName),
    };
    this.setMediaAttribute(formName, 'showLoader', true, name, index, arrayName);
    fileUpload.uploadToS3(fileObj, path)
      .then((res) => {
        window.logger(res);
        const url = res.split('/');
        this.setMediaAttribute(formName, 'value', url[url.length - 1], name, index, arrayName);
        this.setMediaAttribute(formName, 'preSignedUrl', res, name, index, arrayName);
        this.setMediaAttribute(formName, 'showLoader', false, name, index, arrayName);
      })
      .catch((err) => {
        this.setMediaAttribute(formName, 'showLoader', false, name, index, arrayName);
        window.logger(err);
      });
    this.currTime = +new Date();
  };

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
    this.currTime = +new Date();
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
      this[formName] = FormValidator.onChange(this[formName], { name: field, value: fieldValue === undefined ? null : fieldValue });
    }
    this.currTime = +new Date();
  };

  validateForm = (formName) => {
    this[formName] = FormValidator.validateForm(this[formName]);
    this.currTime = +new Date();
  }

  resetForm = (form) => {
    this[form] = FormValidator.resetFormData(this[form]);
    this.currTime = +new Date();
  }

  addMore = (form, key, count = 1) => {
    this[form] = FormValidator.addMoreRecordToSubSection(this[form], key, count, true);
    this.currTime = +new Date();
  }

  removeOne = (form, arrayName, index, e = undefined) => {
    if (e) {
      e.preventDefault();
    }
    this[form].fields[arrayName].splice(index, 1);
    this.currTime = +new Date();
  }

  addMoreForNlevelForm = (form, subForm, key, count = 1) => {
    this[form][subForm] = FormValidator.addMoreRecordToSubSection(this[form][subForm], key, count, true);
    this.currTime = +new Date();
    if (form === 'DOCUMENT_UPLOAD_MAPPING_FRM') {
      this[form][subForm] = FormValidator.validateForm(this[form][subForm], true, false, false);
      // this.validateMappingForm();
      this.validateMappingForFormChange(subForm);
    }
  }

  removeOneForNlevelForm = (form, subForm, arrayName, index, e = undefined) => {
    if (e) {
      e.preventDefault();
    }
    this[form][subForm].fields[arrayName].splice(index, 1);
    this.currTime = +new Date();
    if (form === 'DOCUMENT_UPLOAD_MAPPING_FRM') {
      this[form][subForm] = FormValidator.validateForm(this[form][subForm], true, false, false);
      // this.validateMappingForm();
      this.validateMappingForFormChange(subForm);
    }
  }

  resetAll = () => {
    this.client.clearStore();
    this.currTime = +new Date();
  }

  resetAllForms = () => {
    this.formArr.forEach((f) => {
      this[f] = FormValidator.resetFormData(this[f]);
    });
  }

  resetStoreData = () => {
    this.resetAllForms();
    this.stepToBeRendered = 0;
  }

  setFormData = (form, elemRef, elementValue, subForm = false) => {
    if (subForm) {
      this[form][subForm].fields[elemRef].value = elementValue;
    } else {
      this[form].fields[elemRef].value = elementValue;
    }
    this.currTime = +new Date();
  }

  initiateSearch = (srchParams) => {
    this.setFieldValue('requestState', { 'page-1': null }, 'lek');
    this.setFieldValue('requestState', 1, 'page');
    this.setFieldValue('requestState', srchParams, 'search');
    this.initRequest();
    this.currTime = +new Date();
  }

  setInitiateSrch = (name, value, setDefaultFilter = undefined) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value ? name === 'startDate' ? moment(new Date(`${value.formattedValue} 00:00:00`)).toISOString() : moment(new Date(`${value.formattedValue} 23:59:59`)).toISOString() : '';
      // if ((this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '')
      //   || (this.requestState.search.startDate === '' && this.requestState.search.endDate === '')
      // )
      if (this.requestState.search.startDate || this.requestState.search.endDate) {
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
      if (setDefaultFilter && isEmpty(srchParams)) {
        srchParams[setDefaultFilter.defaultFilterType] = setDefaultFilter.defaultValue;
      }
      this.initiateSearch(srchParams);
    }
    this.currTime = +new Date();
  }

  setStepToBeRendered = (step) => {
    this.setFieldValue('stepToBeRendered', step);
    this.currTime = +new Date();
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
    this.currTime = +new Date();
  }

  resetInitLoad = () => {
    this.initLoad = [];
    this.currTime = +new Date();
  }

  handleUploadLoader = (fileId) => {
    const { inProgress } = commonStore;
    return !!(inProgress === fileId);
  }

  moveArray = (form, oldIndex, newIndex) => {
    const array = this[form];
    if (newIndex >= array.length) {
      let k = newIndex - array.length + 1;
      // eslint-disable-next-line no-plusplus
      while (k--) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    if (form === 'DOCUMENT_UPLOAD_MAPPING_FRM') {
      this.validateMappingForm();
    }
    return array;
  }
}

export const decorateDefault = {
  result: observable,
  initLoad: observable,
  showConfirmModal: observable,
  removeFileNamesList: observable,
  removeFileIdsList: observable,
  currTime: observable,
  currentScore: observable,
  stepToBeRendered: observable,
  removeUploadedFiles: action,
  resetInitLoad: action,
  setFieldValue: action,
  uploadMedia: action,
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
  setMediaAttribute: action,
  resetImageCropper: action,
  addMore: action,
  removeOne: action,
  editorChange: action,
  handleUploadLoader: action,
  resetStoreData: action,
  resetAllForms: action,
  resetLoader: action,
  addMoreForNlevelForm: action,
  removeOneForNlevelForm: action,
  formChangeForMultilevelArray: action,
  moveArray: action,
};
