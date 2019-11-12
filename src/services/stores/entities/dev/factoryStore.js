import { observable, action, computed, toJS, decorate } from 'mobx';
import { get, isEmpty, forEach, find, includes, keyBy } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { getPluginList, requestFactoryPluginTrigger, fetchCronLogs, processFactoryPluginTrigger, fetchRequestFactoryLogs, fetchProcessLogs, fileFactoryPluginTrigger } from '../../queries/data';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { REQUESTFACTORY_META, CRONFACTORY_META, PROCESSFACTORY_META, REQUESTFACTORY_LOG__META, PROCESSFACTORY_LOG__META, FILEFACTORY_META } from '../../../constants/admin/data';

export class FactoryStore extends DataModelStore {
  constructor() {
    super({ getPluginList, requestFactoryPluginTrigger, fetchCronLogs, processFactoryPluginTrigger, fetchRequestFactoryLogs, fetchProcessLogs, fileFactoryPluginTrigger });
  }

  REQUESTFACTORY_FRM = Validator.prepareFormObject(REQUESTFACTORY_META);

  CRONFACTORY_FRM = Validator.prepareFormObject(CRONFACTORY_META);

  REQUESTFACTORY_LOG_FRM = Validator.prepareFormObject(REQUESTFACTORY_LOG__META);

  PROCESSFACTORY_FRM = Validator.prepareFormObject(PROCESSFACTORY_META);

  PROCESSFACTORY_LOG_FRM = Validator.prepareFormObject(PROCESSFACTORY_LOG__META);

  FILEFACTORY_FRM = Validator.prepareFormObject(FILEFACTORY_META);

  DYNAMCI_PAYLOAD_FRM = {
    REQUESTFACTORY: {},
    PROCESSFACTORY: {},
    FILEFACTORY: {},
  };

  currentPluginSelected = '';

  inProgress = {
    requestFactory: false,
    cronFactory: false,
    processFactory: false,
    fileFactory: false,
  };

  pluginListArr = null;

  filters = true;

  cronLogList = [];

  requestLogList = [];

  processFactoryResponse = {};

  confirmModal = false;

  confirmModalName = null;

  removeIndex = null;

  selectedFactory = 'CRON';

  initRequest = async (reqParams) => {
    try {
      const {
        keyword, cron, cronMetaType, status, plugin, startDate, endDate, jobId,
      } = this.requestState.search;
      const filters = toJS({ ...this.requestState.search });
      delete filters.keyword;
      this.requestState.page = (reqParams && reqParams.page) || this.requestState.page;
      this.requestState.perPage = (reqParams && reqParams.first) || this.requestState.perPage;
      let params = this.selectedFactory === 'CRON' ? {
        search: keyword,
        cron: cron || 'GOLDSTAR_HEALTHCHECK',
        cronMetaType,
        limit: this.requestState.perPage,
        jobId: jobId || '',
      } : this.selectedFactory === 'REQUEST' ? {
        search: keyword,
        plugin: plugin || 'PROCESSOR_JOB_PROCESSOR',
        limit: this.requestState.perPage,
        jobId: jobId || '',
      } : {
        search: keyword,
        plugin: plugin || 'BOX_AUDIT',
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

      const data = await this.executeQuery({
        client: 'PRIVATE',
        query: this.selectedFactory === 'CRON' ? 'fetchCronLogs' : this.selectedFactory === 'REQUEST' ? 'fetchRequestFactoryLogs' : 'fetchProcessLogs',
        variables: params,
        setLoader: this.selectedFactory === 'CRON' ? 'fetchCronLogs' : this.selectedFactory === 'REQUEST' ? 'fetchRequestFactoryLogs' : 'fetchProcessLogs',
        fetchPolicy: 'network-only',
      });
      const dataList = this.selectedFactory === 'CRON' ? 'cronLogList' : 'requestLogList';
      this.setFieldValue(dataList, data);
      const { lek } = this.selectedFactory === 'CRON' ? data.fetchCronLogs : this.selectedFactory === 'REQUEST' ? data.fetchRequestFactoryLogs : data.fetchProcessLogs;
      const requestStateObj = {
        ...this.requestState,
        lek: {
          ...this.requestState.lek,
          [`page-${this.requestState.page + 1}`]: lek,
        },
      };
      this.setFieldValue('requestState', requestStateObj);
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  formChangeForPlugin = (e, res, form, subForm = false) => {
    if (subForm) {
      this[form.parentForm][form.childForm] = Validator.onChange(this[form.parentForm][form.childForm], Validator.pullValues(e, res));
    } else if (includes(['REQUESTFACTORY_FRM', 'PROCESSFACTORY_FRM', 'FILEFACTORY_FRM'], form) && includes(['plugin', 'method'], res.name)) {
      const currentSelectedPlugin = Validator.pullValues(e, res).value;
      this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
      this.currentPluginSelected = currentSelectedPlugin;
      const plugnArr = this.pullValuesForDynmicInput(e, res);
      const childForm = form === 'REQUESTFACTORY_FRM' ? 'REQUESTFACTORY' : form === 'PROCESSFACTORY_FRM' ? 'PROCESSFACTORY' : 'FILEFACTORY';
      this.createDynamicFormFields(plugnArr, childForm);
    } else {
      this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
    }
  };

  formChangeForPayload = (e, res, form) => {
    this[form.parentForm][form.childForm] = Validator.onChange(this[form.parentForm][form.childForm], Validator.pullValues(e, res));
  }

  fetchPlugins = async () => {
    try {
      const res = await this.executeQuery({
        client: 'PRIVATE',
        query: 'getPluginList',
        setLoader: 'getPluginList',
        fetchPolicy: 'cache-first',
      });
      if ((get(res, 'listRequestPlugins.plugins') || get(res, 'listCronPlugins.plugins') || get(res, 'listProcessorPlugins.plugins'))) {
        this.setFieldValue('pluginListArr', res);
        this.setPluginDropDown();
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later1111.', 'error');
    }
  }

  fetchPluginsForFileFactory = () => {
    const fileData = {
      listFilePlugins: {
        plugins: [
          {
            name: 'Investor Profile',
            plugin: 'INVESTOR_PROFILE',
            pluginInputs: [
              {
                defaultValue: 'PDF.Investor.Compliance.Profile',
                key: 'identifier',
                label: 'Identifier',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'USER UUID',
                key: 'resourceId',
                label: 'Resource Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'USER UUID',
                key: 'ownerId',
                label: 'Owner Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
            ],
          },
          {
            name: 'Investor Account',
            plugin: 'INVESTOR_ACCOUNT',
            pluginInputs: [
              {
                defaultValue: 'PDF.Investor.Compliance.Account',
                key: 'identifier',
                label: 'Identifier',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'ACCOUNT UUID',
                key: 'resourceId',
                label: 'Resource Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'USER UUID',
                key: 'ownerId',
                label: 'Owner Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
            ],
          },
          {
            name: 'Investment',
            plugin: 'INVESTMENT',
            pluginInputs: [
              {
                defaultValue: 'PDF.Investor.Compliance.Investment',
                key: 'identifier',
                label: 'Identifier',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'Investor Account UUID',
                key: 'resourceId',
                label: 'Resource Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'USER UUID',
                key: 'ownerId',
                label: 'Owner Id',
                rule: 'required',
                type: 'input',
                value: '',
              },
              {
                defaultValue: 'RDS Agreement Number',
                key: 'payload',
                label: 'Payload',
                rule: 'optional',
                type: 'textarea',
                value: '',
              },
            ],
          },
        ],
      },
    };
    this.setFieldValue('pluginListArr', fileData);
    this.FILEFACTORY_FRM.fields.method.values = this.dropDownValuesForPlugin('listFilePlugins');
  }

  get cronLogs() {
    return (this.cronLogList && this.cronLogList.fetchCronLogs
      && toJS(this.cronLogList.fetchCronLogs.cronLog)
    ) || [];
  }

  get requestLogs() {
    const currentFactory = this.selectedFactory === 'REQUEST' ? 'fetchRequestFactoryLogs' : 'fetchProcessLogs';
    const currentFactoryLog = this.selectedFactory === 'REQUEST' ? 'requestLogs' : 'processLogs';
    return (this.requestLogList && this.requestLogList[currentFactory]
      && toJS(this.requestLogList[currentFactory][currentFactoryLog])
    ) || [];
  }

  toggleSearch = () => {
    this.filters = !this.filters;
  }

  get cronLogListLoading() {
    return this.cronLogList.loading;
  }

  get requestLogListLoading() {
    return this.requestLogList.loading;
  }

  get count() {
    return (this.cronLogList && this.cronLogList.fetchCronLogs
      && toJS(this.cronLogList.fetchCronLogs.resultCount)
    ) || 0;
  }

  get requestCount() {
    const currentFactory = this.selectedFactory === 'REQUEST' ? 'fetchRequestFactoryLogs' : 'fetchProcessLogs';
    return (this.requestLogList && this.requestLogList[currentFactory]
      && toJS(this.requestLogList[currentFactory].resultCount)
    ) || 0;
  }

  requestFactoryPluginTrigger = () => new Promise(async (resolve, reject) => {
    try {
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
        variables.plugin = formData.plugin;
        variables.payload = TestformData;
        variables.invocationType = formData.invocationType;

        const result = await this.executeMutation({
          mutation: 'requestFactoryPluginTrigger',
          variables: { ...variables },
          setLoader: requestFactoryPluginTrigger,
        });
        Helper.toast('Your request is processed.', 'success');
        if (result.imageProcessing) {
          resolve(result.imageProcessing);
        }
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later1111.', 'error');
      reject();
    } finally {
      this.setFieldValue('inProgress', false, 'requestFactory');
    }
  });

  setPluginDropDown = () => {
    this.REQUESTFACTORY_FRM.fields.plugin.values = this.dropDownValuesForPlugin('listRequestPlugins');
    this.REQUESTFACTORY_LOG_FRM.fields.plugin.values = this.dropDownValuesForPlugin('listRequestPlugins');
    this.CRONFACTORY_FRM.fields.cron.values = this.dropDownValuesForPlugin('listCronPlugins');
    this.PROCESSFACTORY_FRM.fields.method.values = this.dropDownValuesForPlugin('listProcessorPlugins');
    this.PROCESSFACTORY_LOG_FRM.fields.plugin.values = this.dropDownValuesForPlugin('listProcessorPlugins');
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
    const plugingListStr = `${pluginList}.plugins`;
    const plugins = get(this.pluginListArr, plugingListStr);
    plugins.forEach((value) => {
      const tempObj = {};
      tempObj.key = value.name;
      tempObj.text = value.name;
      tempObj.value = value.plugin;
      tempObj.pluginInput = [...value.pluginInputs];
      pluginArr.push(tempObj);
    });
    return pluginArr;
  }

  processFactoryPluginTrigger = () => new Promise(async (resolve, reject) => {
    try {
      const { fields } = this.PROCESSFACTORY_FRM;
      const fieldsPayload = this.DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY.fields;
      const formData = Validator.evaluateFormData(fields);
      const formPayloadData = Validator.evaluateFormData(fieldsPayload, true);
      const TestformData = this.ExtractToJSON(formPayloadData);
      if (!this.isValidJson(TestformData)) {
        this.PROCESSFACTORY_FRM.fields.payload.error = 'Invalid JSON object. Please enter valid JSON object.';
        this.PROCESSFACTORY_FRM.meta.isValid = false;
      } else {
        this.setFieldValue('inProgress', true, 'processFactory');
        const variables = {};
        variables.method = formData.method;
        variables.payload = TestformData;
        const result = await this.executeMutation({
          mutation: 'processFactoryPluginTrigger',
          variables: { ...variables },
          setLoader: processFactoryPluginTrigger,
        });
        Helper.toast('Your request is processed.', 'success');
        if (result.data.invokeProcessorDriver) {
          this.setFieldValue('processFactoryResponse', result.data.invokeProcessorDriver);
          resolve(result.data.invokeProcessorDriver);
        }
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later1111.', 'error');
      reject();
    } finally {
      this.setFieldValue('inProgress', false, 'processFactory');
    }
  });

  fileFactoryPluginTrigger = () => new Promise(async (resolve, reject) => {
    const fieldsPayload = this.DYNAMCI_PAYLOAD_FRM.FILEFACTORY.fields;
    const formPayloadData = Validator.evaluateFormData(fieldsPayload, true);
    const TestformData = this.ExtractToJSON(formPayloadData, true);
    if (TestformData.payload && !this.isValidJson(TestformData.payload)) {
      this.DYNAMCI_PAYLOAD_FRM.FILEFACTORY.fields.payload.error = 'Invalid JSON object. Please enter valid JSON object.';
      this.DYNAMCI_PAYLOAD_FRM.FILEFACTORY.meta.isValid = false;
      reject();
    } else {
      try {
        this.setFieldValue('inProgress', true, 'fileFactory');
        const result = await this.executeMutation({
          mutation: 'fileFactoryPluginTrigger',
          variables: { ...TestformData },
          setLoader: fileFactoryPluginTrigger,
        });
        Helper.toast('Your request is processed.', 'success');
        if (result.data.generateFile) {
          resolve(result.data.generateFile);
        }
      } catch (error) {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      } finally {
        this.setFieldValue('inProgress', false, 'fileFactory');
      }
    }
  });

  ExtractToJSON = (param, isDisableStringify = false) => {
    let revampObj = {};
    if (typeof (param) === 'object') {
      revampObj = param;
    } else {
      forEach(param, (val) => {
        revampObj[val.key] = val.value;
      });
    }
    return !isDisableStringify ? JSON.stringify(revampObj) : revampObj;
  }

  createDynamicFormFields = (formFields, form) => {
    this.DYNAMCI_PAYLOAD_FRM[form] = Validator.prepareFormObject(formFields, false, true, true);
  }

  pullValuesForDynmicInput = (e, data) => {
    const pluginInputData = find(data.fielddata.values, o => o.value === data.value && o.pluginInput);
    const pluginInputObj = keyBy(pluginInputData.pluginInput, 'key');
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
      case 'select':
        formElement = 'FormDropDown';
        this.setFormData(formObj.parentForm, fieldKey, formProps.defaultValue, formObj.childForm);
        break;
      default:
        formElement = 'FormInput';
        this.setFormData(formObj.parentForm, fieldKey, formProps.defaultValue, formObj.childForm);
        break;
    }
    return formElement;
  }
}

decorate(FactoryStore, {
  ...decorateDefault,
  REQUESTFACTORY_FRM: observable,
  CRONFACTORY_FRM: observable,
  REQUESTFACTORY_LOG_FRM: observable,
  PROCESSFACTORY_LOG_FRM: observable,
  PROCESSFACTORY_FRM: observable,
  FILEFACTORY_FRM: observable,
  DYNAMCI_PAYLOAD_FRM: observable,
  currentPluginSelected: observable,
  inProgress: observable,
  pluginListArr: observable,
  filters: observable,
  cronLogList: observable,
  requestLogList: observable,
  selectedFactory: observable,
  processFactoryResponse: observable,
  confirmModal: observable,
  confirmModalName: observable,
  removeIndex: observable,
  initRequest: action,
  formChangeForPlugin: action,
  formChangeForPayload: action,
  fetchPlugins: action,
  initiateSearch: action,
  setInitiateSrch: action,
  cronLogs: computed,
  requestLogs: computed,
  toggleSearch: action,
  cronLogListLoading: computed,
  requestLogListLoading: computed,
  count: computed,
  requestCount: computed,
  requestFactoryPluginTrigger: action,
  setPluginDropDown: action,
  processFactoryPluginTrigger: action,
  createDynamicFormFields: action,
  fileFactoryPluginTrigger: action,
});

export default new FactoryStore();
