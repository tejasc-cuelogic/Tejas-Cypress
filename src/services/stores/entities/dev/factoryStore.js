import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { get } from 'lodash';
import { getPluginList, requestFactoryPluginTrigger } from '../../queries/data';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { REQUESTFACTORY_META } from '../../../constants/admin/data';

export class FactoryStore {
  @observable REQUESTFACTORY_FRM = Validator.prepareFormObject(REQUESTFACTORY_META);

  @observable inProgress = {
    requestFactory: false,
  };

  @observable pluginListArr = null;

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
  formChange = (e, res, form) => {
    this[form] = Validator.onChange(this[form], Validator.pullValues(e, res));
  };

  @action
  fetchPlugins = () => {
    this.pluginListArr = graphql({
      client,
      query: getPluginList,
      onFetch: (res) => {
        if (get(res, 'requestWorkerPlugins.plugins') && !this.pluginListArr.loading) {
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
  requestFactoryPluginTrigger = () => new Promise((resolve, reject) => {
    const { fields } = this.REQUESTFACTORY_FRM;
    const formData = Validator.evaluateFormData(fields);
    if (!this.isValidJson(formData.payload)) {
      this.REQUESTFACTORY_FRM.fields.payload.error = 'Invalid JSON object. Please enter valid JSON object.';
      this.REQUESTFACTORY_FRM.meta.isValid = false;
    } else {
      this.setFieldValue('inProgress', true, 'requestFactory');
      const variables = {};
      variables.method = formData.plugin;
      variables.payload = formData.payload;
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

  @computed get dropDownValuesFromArray() {
    const pluginArr = [];
    const pluginList = get(this.pluginListArr, 'data.requestWorkerPlugins.plugins');
    pluginList.forEach((value) => {
      const tempObj = {};
      tempObj.key = value.name;
      tempObj.text = value.name;
      tempObj.value = value.name;
      pluginArr.push(tempObj);
    });
    return pluginArr;
  }

  @action
  setPluginDropDown = () => {
    this.REQUESTFACTORY_FRM.fields.plugin.values = this.dropDownValuesFromArray;
  }

  isValidJson = (json) => {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default new FactoryStore();
