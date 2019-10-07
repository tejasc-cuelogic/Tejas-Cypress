import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { get, isEmpty, isArray, forEach, find, includes, keyBy } from 'lodash';
import moment from 'moment';
import { getPluginList, requestFactoryPluginTrigger, fetchCronLogs, processFactoryPluginTrigger } from '../../queries/data';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { REQUESTFACTORY_META, CRONFACTORY_META, PROCESSFACTORY_META } from '../../../constants/admin/data';

export class FactoryStore {
  @observable REQUESTFACTORY_FRM = Validator.prepareFormObject(REQUESTFACTORY_META);

  @observable CRONFACTORY_FRM = Validator.prepareFormObject(CRONFACTORY_META);

  @observable PROCESSACTORY_FRM = Validator.prepareFormObject(PROCESSFACTORY_META);

  @observable DYNAMCI_PAYLOAD_FRM = {
    REQUESTFACTORY: {},
    PROCESSACTORY: {},
  };

  @observable currentPluginSelected = '';

  @observable inProgress = {
    requestFactory: false,
    cronFactory: false,
    processFactory: false,
  };

  @observable pluginListArr = null;

  @observable filters = true;

  @observable cronLogList = [];

  @observable processFactoryResponse = {};

  @observable confirmModal = false;

  @observable confirmModalName = null;

  @observable removeIndex = null;

  @observable requestState = {
    lek: { 'page-1': null },
    skip: 0,
    page: 1,
    perPage: 25,
    filters: false,
    search: {
    },
  };

  @action
  initRequest = (reqParams) => {
    const {
      keyword, cron, cronMetaType, status, startDate, endDate, jobId,
    } = this.requestState.search;
    const filters = toJS({ ...this.requestState.search });
    delete filters.keyword;
    this.requestState.page = (reqParams && reqParams.page) || this.requestState.page;
    this.requestState.perPage = (reqParams && reqParams.first) || this.requestState.perPage;
    let params = {
      search: keyword,
      cron: cron || 'GOLDSTAR_HEALTHCHECK',
      // cronMetaType: cronMetaType || 'LOG',
      cronMetaType,
      // page: reqParams ? reqParams.page : 1,
      limit: this.requestState.perPage,
      jobId: jobId || '',
    };
    params = this.requestState.lek[`page-${this.requestState.page}`]
      ? { ...params, lek: this.requestState.lek[`page-${this.requestState.page}`] } : { ...params };

    if (status && status !== '') {
      params = {
        ...params,
        status,
      };
    }
    if (startDate && endDate) {
      params = {
        ...params,
        ...{ fromDate: startDate, toDate: endDate },
      };
    }
    this.cronLogList = graphql({
      client,
      query: fetchCronLogs,
      variables: params,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && !this.cronLogList.loading) {
          const { lek } = data.fetchCronLogs;
          this.requestState = {
            ...this.requestState,
            lek: {
              ...this.requestState.lek,
              [`page-${this.requestState.page + 1}`]: lek,
            },
          };
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  setFieldValue = (field, value, field2 = false) => {
    if (field2) {
      this[field][field2] = value;
    } else {
      this[field] = value;
    }
  }

  @action
  resetForm = (form) => {
    this[form] = Validator.resetFormData(this[form]);
  }

  @action
  formChange = (e, res, form, subForm = false) => {
    if (subForm) {
      this[form.parentForm][form.childForm] = Validator.onChange(this[form.parentForm][form.childForm], Validator.pullValues(e, res));
    } else if (includes(['REQUESTFACTORY_FRM', 'PROCESSACTORY_FRM'], form) && includes(['plugin', 'method'], res.name)) {
      const currentSelectedPlugin = Validator.pullValues(e, res).value;
      this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
      this.currentPluginSelected = currentSelectedPlugin;
      const plugnArr = this.pullValuesForDynmicInput(e, res);
      const childForm = form === 'REQUESTFACTORY_FRM' ? 'REQUESTFACTORY' : 'PROCESSACTORY';
      this.createDynamicFormFields(plugnArr, childForm);
    } else {
      this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
    }
  };

  @action
  formChangeForPayload = (e, res, form) => {
    this[form.parentForm][form.childForm] = Validator.onChange(this[form.parentForm][form.childForm], Validator.pullValues(e, res));
  }

  @action
  fetchPlugins = () => {
    this.pluginListArr = graphql({
      client,
      query: getPluginList,
      onFetch: (res) => {
        if ((get(res, 'listRequestPlugins.plugins') || get(res, 'listCronPlugins.plugins')) && !this.pluginListArr.loading) {
          this.setPluginDropDown();
        }
      },
      onError: (error) => {
        console.log(error);
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.lek = { 'page-1': null };
    this.requestState.page = 1;
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @action
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
      this.requestState = temp;
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }

  @computed get cronLogs() {
    return (this.cronLogList.data
      && this.cronLogList.data.fetchCronLogs
      && toJS(this.cronLogList.data.fetchCronLogs.cronLog)
    ) || [];
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @computed get loading() {
    return this.cronLogList.loading;
  }

  @computed get count() {
    return (this.cronLogList.data
      && this.cronLogList.data.fetchCronLogs
      && toJS(this.cronLogList.data.fetchCronLogs.resultCount)
    ) || 0;
  }

  @action
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
    this.setFieldValue('cronLogList', []);
  }

  @action
  requestFactoryPluginTrigger = () => new Promise((resolve, reject) => {
    const { fields } = this.REQUESTFACTORY_FRM;
    const fieldsPayload = this.DYNAMCI_PAYLOAD_FRM.REQUESTFACTORY.fields;
    const formData = Validator.evaluateFormData(fields);
    const formPayloadData = Validator.evaluateFormData(fieldsPayload);
    const TestformData = this.ExtractToJSON(formPayloadData);
    if (!this.isValidJson(TestformData)) {
      this.REQUESTFACTORY_FRM.fields.payload.error = 'Invalid JSON object. Please enter valid JSON object.';
      this.REQUESTFACTORY_FRM.meta.isValid = false;
    } else {
      this.setFieldValue('inProgress', true, 'requestFactory');
      const variables = {};
      variables.method = formData.plugin;
      variables.payload = TestformData;
      variables.invocationType = formData.invocationType;
      client
        .mutate({
          mutation: requestFactoryPluginTrigger,
          variables,
        })
        .then((result) => {
          Helper.toast('Your request is processed.', 'success');
          if (result.data.imageProcessing) {
            resolve(result.data.imageProcessing);
          }
        })
        .catch(() => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject();
        })
        .finally(() => {
          this.setFieldValue('inProgress', false, 'requestFactory');
        });
    }
  });

  @computed get pluginListOutputLoading() {
    return this.pluginListArr.loading;
  }

  @action
  setPluginDropDown = () => {
    this.REQUESTFACTORY_FRM.fields.plugin.values = this.dropDownValuesForPlugin('listRequestPlugins');
    this.CRONFACTORY_FRM.fields.cron.values = this.dropDownValuesForPlugin('listCronPlugins');
    this.PROCESSACTORY_FRM.fields.method.values = this.dropDownValuesForPlugin('listProcessorPlugins');
  }

  isValidJson = (json) => {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    const jsonObj = JSON.parse(json);
    return !!(jsonObj && !isEmpty(jsonObj));
  }

  dropDownValuesForPlugin = (pluginList) => {
    const pluginArr = [];
    const plugingListStr = `data.${pluginList}.plugins`;
    const plugins = get(this.pluginListArr, plugingListStr);
    plugins.forEach((value) => {
      const tempObj = {};
      tempObj.key = value.name;
      tempObj.text = value.name;
      tempObj.value = includes(['listRequestPlugins', 'listProcessorPlugins'], pluginList) ? value.plugin : value.name;
      tempObj.pluginInput = [...value.pluginInputs];
      pluginArr.push(tempObj);
    });
    return pluginArr;
  }

  @action
  processFactoryPluginTrigger = () => new Promise((resolve, reject) => {
    const { fields } = this.PROCESSACTORY_FRM;
    const fieldsPayload = this.DYNAMCI_PAYLOAD_FRM.PROCESSACTORY.fields;
    const formData = Validator.evaluateFormData(fields);
    const formPayloadData = Validator.evaluateFormData(fieldsPayload);
    const TestformData = this.ExtractToJSON(formPayloadData);
    if (!this.isValidJson(TestformData)) {
      this.PROCESSACTORY_FRM.fields.payload.error = 'Invalid JSON object. Please enter valid JSON object.';
      this.PROCESSACTORY_FRM.meta.isValid = false;
    } else {
      this.setFieldValue('inProgress', true, 'processFactory');
      const variables = {};
      variables.method = formData.method;
      variables.payload = TestformData;
      client
        .mutate({
          mutation: processFactoryPluginTrigger,
          variables,
        })
        .then((result) => {
          Helper.toast('Your request is processed.', 'success');
          if (result.data.invokeProcessorDriver) {
            this.setFieldValue('processFactoryResponse', result.data.invokeProcessorDriver);
            resolve(result.data.invokeProcessorDriver);
          }
        })
        .catch(() => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject();
        })
        .finally(() => {
          this.setFieldValue('inProgress', false, 'processFactory');
        });
    }
  });

  @action
  formArrayChange = (e, result, form, subForm = '', index) => {
    if (result && (result.type === 'checkbox')) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
        subForm,
        index,
        '',
        { value: result.checked },
      );
    } else {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
        subForm,
        index,
      );
    }
  }

  ExtractToJSON = (param) => {
    console.log('param==>', param);
    let revampObj = {};
    if (typeof (param) === 'object') {
      revampObj = param;
    } else {
      forEach(param, (val) => {
        revampObj[val.key] = val.value;
      });
    }
    return JSON.stringify(revampObj);
  }

  @action
  createDynamicFormFields = (formFields, form) => {
    this.DYNAMCI_PAYLOAD_FRM[form] = Validator.prepareFormObject(formFields, false, true, true);
  }

  pullValuesForDynmicInput = (e, data) => {
    const pluginInputData = find(data.fielddata.values, o => o.value === data.value && o.pluginInput);
    const pluginInputObj = keyBy(pluginInputData.pluginInput, 'value');
    return pluginInputObj;
  };

  getFormElement = (fieldKey, formProps, formObj) => {
    let formElement = '';
    const elementType = formProps.type;
    switch (elementType) {
      case 'textarea':
        formElement = 'FormTextarea';
        this.setFormData(formObj.parentForm, fieldKey, formProps.defaultValue, formObj.childForm);
        break;
      case 'input':
        formElement = 'FormInput';
        this.setFormData(formObj.parentForm, fieldKey, formProps.defaultValue, formObj.childForm);
        break;

      default:
        formElement = 'FormInput';
        this.setFormData(formObj.parentForm, fieldKey, formProps.defaultValue, formObj.childForm);
        break;
    }
    return formElement;
  }

  @action
  setFormData = (form, elemRef, elementValue, subForm = false) => {
    if (subForm) {
      this[form][subForm].fields[elemRef].value = elementValue;
    } else {
      this[form].fields[elemRef].value = elementValue;
    }
  }
}

export default new FactoryStore();
