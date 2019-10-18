import { observable, action, computed, toJS, decorate } from 'mobx';
import { get, isEmpty, forEach, find, includes, keyBy } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { getPluginList, requestFactoryPluginTrigger, fetchCronLogs, processFactoryPluginTrigger } from '../../queries/data';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { REQUESTFACTORY_META, CRONFACTORY_META, PROCESSFACTORY_META } from '../../../constants/admin/data';

export class FactoryStore extends DataModelStore {
  constructor() {
    super({ getPluginList, requestFactoryPluginTrigger, fetchCronLogs, processFactoryPluginTrigger });
  }

  REQUESTFACTORY_FRM = Validator.prepareFormObject(REQUESTFACTORY_META);

  CRONFACTORY_FRM = Validator.prepareFormObject(CRONFACTORY_META);

  PROCESSFACTORY_FRM = Validator.prepareFormObject(PROCESSFACTORY_META);

  DYNAMCI_PAYLOAD_FRM = {
    REQUESTFACTORY: {},
    PROCESSFACTORY: {},
  };

  currentPluginSelected = '';

  inProgress = {
    requestFactory: false,
    cronFactory: false,
    processFactory: false,
  };

  pluginListArr = null;

  filters = true;

  cronLogList = [];

  processFactoryResponse = {};

  confirmModal = false;

  confirmModalName = null;

  removeIndex = null;

  initRequest = async (reqParams) => {
    try {
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

      const data = await this.executeQuery({
        client: 'PRIVATE',
        query: 'fetchCronLogs',
        variables: params,
        setLoader: 'fetchCronLogs',
        fetchPolicy: 'network-only',
      });
      this.setFieldValue('cronLogList', data);
      const { lek } = data.fetchCronLogs;
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
    } else if (includes(['REQUESTFACTORY_FRM', 'PROCESSFACTORY_FRM'], form) && includes(['plugin', 'method'], res.name)) {
      const currentSelectedPlugin = Validator.pullValues(e, res).value;
      this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
      this.currentPluginSelected = currentSelectedPlugin;
      const plugnArr = this.pullValuesForDynmicInput(e, res);
      const childForm = form === 'REQUESTFACTORY_FRM' ? 'REQUESTFACTORY' : 'PROCESSFACTORY';
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

  get cronLogs() {
    return (this.cronLogList && this.cronLogList.fetchCronLogs
      && toJS(this.cronLogList.fetchCronLogs.cronLog)
    ) || [];
  }

  toggleSearch = () => {
    this.filters = !this.filters;
  }

  get cronLogListLoading() {
    return this.cronLogList.loading;
  }

  get count() {
    return (this.cronLogList && this.cronLogList.fetchCronLogs
      && toJS(this.cronLogList.fetchCronLogs.resultCount)
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
        variables.method = formData.plugin;
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
    this.CRONFACTORY_FRM.fields.cron.values = this.dropDownValuesForPlugin('listCronPlugins');
    this.PROCESSFACTORY_FRM.fields.method.values = this.dropDownValuesForPlugin('listProcessorPlugins');
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
      tempObj.value = includes(['listRequestPlugins', 'listProcessorPlugins'], pluginList) ? value.plugin : value.name;
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
      const formPayloadData = Validator.evaluateFormData(fieldsPayload);
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
        if (result.invokeProcessorDriver) {
          resolve(result.invokeProcessorDriver);
        }
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later1111.', 'error');
      reject();
    } finally {
      this.setFieldValue('inProgress', false, 'processFactory');
    }
  });

  ExtractToJSON = (param) => {
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
  PROCESSFACTORY_FRM: observable,
  DYNAMCI_PAYLOAD_FRM: observable,
  currentPluginSelected: observable,
  inProgress: observable,
  pluginListArr: observable,
  filters: observable,
  cronLogList: observable,
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
  toggleSearch: action,
  cronLogListLoading: computed,
  count: computed,
  requestFactoryPluginTrigger: action,
  setPluginDropDown: action,
  processFactoryPluginTrigger: action,
  createDynamicFormFields: action,
});

export default new FactoryStore();
