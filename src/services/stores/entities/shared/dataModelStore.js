import { observable, action } from 'mobx';
import { set } from 'lodash';
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

  auStatus;

  // 0: error, 1: loading, 2: success
  loading = false;

  client = publicClient;

  currentScore = 0;

  constructor(queryMutations) {
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
    let result = {};
    try {
      result = await apolloClient.mutate({
        mutation: this.gqlRef[payLoad.mutation],
        variables: payLoad.variables,
      });
      nsUiStore.filterLoaderByOperation(payLoad.mutation);
      if (payLoad.message && payLoad.message !== false && payLoad.message && payLoad.message.success) {
        Utils.toast(payLoad.message && payLoad.message.success, 'success');
      }
      return result || true;
    } catch (err) {
      nsUiStore.filterLoaderByOperation(payLoad.mutation);
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
    MobxApollo.graphql({
      client: apolloClient,
      query: this.gqlRef[payLoad.query],
      fetchPolicy: 'network-only',
      variables: { ...params.variables },
      onFetch: (data) => {
        if (data) {
          res(data);
          nsUiStore.filterLoaderByOperation(payLoad.query);
        }
        this.currTime = +new Date();
      },
      onError: (e) => {
        nsUiStore.filterLoaderByOperation(payLoad.query);
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
}

export const decorateDefault = {
  result: observable,
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
  setLoader: action,
  auStatus: observable.ref,
  loading: observable.ref,
};
