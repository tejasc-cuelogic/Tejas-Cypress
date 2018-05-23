import { action, observable, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';

import { GqlClient as client } from '../../services/graphql';
import { createAccount, updateAccount } from '../../stores/queries/account';
import uiStore from '../uiStore';
import userStore from '../userStore';
import userDetailsStore from '../user/userDetailsStore';
import Helper from '../../helper/utility';
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
    fields: { ...IRA_IDENTITY }, meta: { isValid: false, error: '', isDirty: false },
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
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    if (field && value) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };

  @action
  setIraError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @action
  setIsDirty = (form, status) => {
    this[form].meta.isDirty = status;
  }

  @computed
  get isValidIraFinancialInfo() {
    return _.isEmpty(this.formFinInfo.fields.netWorth.error) &&
    _.isEmpty(this.formFinInfo.fields.annualIncome.error);
  }

  @computed
  get isValidIraIdentity() {
    return _.isEmpty(this.formIdentity.fields.identityDoc.error);
  }

  @computed
  get isValidIraForm() {
    return this.formFinInfo.meta.isValid && this.formAccTypes.meta.isValid
    && this.formFunding.meta.isValid && this.formIdentity.meta.isValid;
  }

  // @computed
  // get formStatus() {
  //   return this.isValidIraForm ? 'submit' : 'draft';
  // }

  @computed
  get accountAttributes() {
    const accountType = _.find(
      this.formAccTypes.fields.iraAccountType.values,
      { value: this.formAccTypes.fields.iraAccountType.value },
    );
    const fundingOption = _.find(
      this.formFunding.fields.fundingType.values,
      { value: this.formFunding.fields.fundingType.value },
    );
    return {
      netWorth: this.formFinInfo.fields.netWorth.value ? this.formFinInfo.fields.netWorth.value : 0,
      annualIncome:
      this.formFinInfo.fields.annualIncome.value ? this.formFinInfo.fields.annualIncome.value : 0,
      iraAccountType: accountType.label.toLowerCase(),
      fundingType: this.getFundingType(fundingOption.label.toLowerCase()),
      identityDoc: this.formIdentity.fields.identityDoc.value,
    };
  }

  /* eslint-disable class-methods-use-this */
  getFundingType(label) {
    if (label === 'check') {
      return 'check';
    } else if (label === 'ira transfer') {
      return 'iraTransfer';
    }
    return 'directRollOver';
  }

  /* eslint-disable consistent-return */
  @action
  createAccount = (currentStep, formStatus = 'draft') => {
    let isValidCurrentStep = true;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidIraFinancialInfo;
        break;
      case 'Account type':
        isValidCurrentStep = true;
        break;
      case 'Funding':
        isValidCurrentStep = true;
        break;
      case 'Identity':
        currentStep.validate();
        isValidCurrentStep = this.isValidIraIdentity;
        break;
      default:
        break;
    }
    if (isValidCurrentStep) {
      uiStore.setProgress(userStore.currentUser.sub);
      let mutation = createAccount;
      let variables = {
        userId: userStore.currentUser.sub,
        accountAttributes: this.accountAttributes,
        status: formStatus,
        accountType: 'ira',
      };
      let actionPerformed = 'submitted';
      if (typeof userDetailsStore.currentUser.data !== 'undefined') {
        const accountDetails = _.find(
          userDetailsStore.currentUser.data.user.accounts,
          { accountType: 'ira' },
        );
        mutation = updateAccount;
        variables = {
          userId: userStore.currentUser.sub,
          accountId: accountDetails.accountId,
          accountAttributes: this.accountAttributes,
          status: formStatus,
          accountType: 'ira',
        };
        actionPerformed = 'updated';
      }
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation,
            variables,
          })
          .then((result) => {
            switch (currentStep.name) {
              case 'Financial info':
                this.setIsDirty('formFinInfo', false);
                break;
              case 'Account type':
                this.setIsDirty('formAccTypes', false);
                break;
              case 'Funding':
                this.setIsDirty('formFunding', false);
                break;
              case 'Identity':
                this.setIsDirty('formIdentity', false);
                break;
              default:
                break;
            }
            userDetailsStore.getUser(userStore.currentUser.sub);
            if (formStatus === 'submit') {
              Helper.toast('IRA account created successfully.', 'success');
            } else {
              Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
            }
            resolve(result);
          })
          .catch((err) => {
            uiStore.setErrors(err);
            reject(err);
          })
          .finally(() => {
            uiStore.setProgress(false);
          });
      });
    }
  }
}

export default new IraAccountStore();
