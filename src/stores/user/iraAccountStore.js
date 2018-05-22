import { action, observable, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';

import { GqlClient as client } from '../../services/graphql';
import { createAccount } from '../../stores/queries/account';
import uiStore from '../uiStore';
import userStore from '../userStore';
import {
  IRA_FIN_INFO,
  IRA_ACC_TYPES,
  IRA_FUNDING,
  IRA_IDENTITY,
} from '../../constants/account';

class IraAccountStore {
  @observable
  formFinInfo = {
    fields: { ...IRA_FIN_INFO }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formAccTypes = {
    fields: { ...IRA_ACC_TYPES }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formFunding = {
    fields: { ...IRA_FUNDING }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formIdentity = {
    fields: { ...IRA_IDENTITY }, meta: { isValid: true, error: '', isDirty: false },
  }

  @observable
  stepToBeRendered = 0;

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  fundingChange = (e, { name, value }) => {
    this.onFieldChange('formFunding', name, value);
  };

  @action
  finInfoChange = (e, { name, value }) => {
    this.onFieldChange('formFinInfo', name, value);
  };

  @action
  AccTypesChange = (e, { name, value }) => {
    this.onFieldChange('formAccTypes', name, value);
  };

  @action
  identityChange = (name, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
    }
    this.onFieldChange('formIdentity', name, uploadedFile);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    this[form].fields[field].error = validation.errors.first(field);
  };

  @action
  setFinancialInfoError = (key, error) => {
    this.formFinInfo.fields[key].error = error;
  }

  @computed
  get isValidIraFinancialInfo() {
    return _.isEmpty(this.formFinInfo.fields.networth.error) &&
    _.isEmpty(this.formFinInfo.fields.annualIncome.error);
  }

  @computed
  get isValidIraForm() {
    return this.formFinInfo.meta.isValid && this.formAccTypes.meta.isValid
    && this.formFunding.meta.isValid && this.formIdentity.meta.isValid;
  }

  @computed
  get formStatus() {
    return this.isValidIraForm ? 'submit' : 'draft';
  }

  @computed
  get accountAttributes() {
    const accountType = _.find(
      this.formAccTypes.fields.accountType.values,
      { value: this.formAccTypes.fields.accountType.value },
    );
    const fundingOption = _.find(
      this.formFunding.fields.fundingOption.values,
      { value: this.formFunding.fields.fundingOption.value },
    );
    return {
      netWorth: this.formFinInfo.fields.networth.value,
      annualIncome: this.formFinInfo.fields.annualIncome.value,
      iraAccountType: accountType.label,
      fundingType: fundingOption.label,
      identityDoc: this.formIdentity.fields.driversLicence.value,
    };
  }

  @action
  createAccount = (currentStep) => {
    console.log(this.formStatus);
    currentStep.validate();
    console.log(currentStep.isValid);
    if (currentStep.isValid !== 'error') {
      uiStore.setProgress();
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation: createAccount,
            variables: {
              userId: userStore.currentUser.sub,
              accountAttributes: this.accountAttributes,
              status: 'draft',
              accountType: 'ira',
            },
          })
          .then((result) => {
            switch (currentStep.name) {
              case 'Financial info':
                this.formFinInfo.meta.isDirty = false;
                break;
              default:
                break;
            }
            resolve(result);
          })
          .catch((err) => {
            uiStore.setErrors((err));
            reject();
          })
          .finally(() => {
            uiStore.setProgress(false);
          });
      });
    }
    return true;
  }
}

export default new IraAccountStore();
