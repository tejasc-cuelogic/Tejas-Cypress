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
    fields: { ...IRA_ACC_TYPES }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formFunding = {
    fields: { ...IRA_FUNDING }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formIdentity = {
    fields: { ...IRA_IDENTITY }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  investorAccId = '';

  @observable
  stepToBeRendered = 0;

  @action
  setInvestorAccId(id) {
    this.investorAccId = id;
  }

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
    if (field) {
      if (typeof value !== 'undefined') {
        this[form].fields[field].error = validation.errors.first(field);
      }
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

  @computed
  get accountAttributes() {
    const payload = {};
    if (this.formFinInfo.fields.netWorth.value) {
      payload.netWorth = this.formFinInfo.fields.netWorth.value;
    }
    if (this.formFinInfo.fields.annualIncome.value) {
      payload.annualIncome = this.formFinInfo.fields.annualIncome.value;
    }
    if (this.formIdentity.fields.identityDoc.value) {
      payload.identityDoc = this.formIdentity.fields.identityDoc.value;
    }
    return payload;
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
    const accountType = _.find(
      this.formAccTypes.fields.iraAccountType.values,
      { value: this.formAccTypes.fields.iraAccountType.value },
    );
    const fundingOption = _.find(
      this.formFunding.fields.fundingType.values,
      { value: this.formFunding.fields.fundingType.value },
    );
    let isValidCurrentStep = true;
    const { accountAttributes } = this;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidIraFinancialInfo;
        break;
      case 'Account type':
        isValidCurrentStep = true;
        accountAttributes.iraAccountType = accountType.label.toLowerCase();
        break;
      case 'Funding':
        isValidCurrentStep = true;
        accountAttributes.fundingType = this.getFundingType(fundingOption.label.toLowerCase());
        break;
      case 'Identity':
        currentStep.validate();
        isValidCurrentStep = this.isValidIraIdentity;
        break;
      default:
        break;
    }
    if (isValidCurrentStep) {
      uiStore.setProgress();
      userDetailsStore.getUser(userStore.currentUser.sub);
      let mutation = createAccount;
      let variables = {
        userId: userStore.currentUser.sub,
        accountAttributes,
        status: formStatus,
        accountType: 'ira',
      };
      let actionPerformed = 'submitted';
      if (userDetailsStore.currentUser.data) {
        const accountDetails = _.find(
          userDetailsStore.currentUser.data.user.accounts,
          { accountType: 'ira' },
        );
        if (accountDetails) {
          mutation = updateAccount;
          variables = {
            userId: userStore.currentUser.sub,
            accountId: accountDetails.accountId,
            accountAttributes,
            status: formStatus,
            accountType: 'ira',
          };
          actionPerformed = 'updated';
        }
      }
      if (this.investorAccId) {
        mutation = updateAccount;
        variables = {
          userId: userStore.currentUser.sub,
          accountId: this.investorAccId,
          accountAttributes,
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
            if (result.data.createInvestorAccount) {
              this.setInvestorAccId(result.data.createInvestorAccount.accountId);
            }
            switch (currentStep.name) {
              case 'Financial info':
                this.setIsDirty('formFinInfo', false);
                this.setStepToBeRendered(1);
                break;
              case 'Account type':
                this.setIsDirty('formAccTypes', false);
                this.setStepToBeRendered(2);
                break;
              case 'Funding':
                this.setIsDirty('formFunding', false);
                this.setStepToBeRendered(3);
                break;
              case 'Identity':
                this.setIsDirty('formIdentity', false);
                this.setStepToBeRendered(4);
                break;
              default:
                break;
            }
            if (formStatus === 'submit') {
              Helper.toast('IRA account created successfully.', 'success');
            } else {
              Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
            }
            resolve(result);
          })
          .catch((err) => {
            uiStore.setErrors(this.simpleErr(err));
            reject(err);
          })
          .finally(() => {
            uiStore.setProgress(false);
          });
      });
    }
  }

  @action
  populateData = (userData) => {
    if (!_.isEmpty(userData)) {
      const account = _.find(
        userData.accounts,
        { accountType: 'ira' },
      );
      if (account) {
        Object.keys(this.formFinInfo.fields).map((f) => {
          this.formFinInfo.fields[f].value = account.accountDetails[f];
          return this.formFinInfo.fields[f];
        });
        this.onFieldChange('formFinInfo');
        Object.keys(this.formFunding.fields).map((f) => {
          if (account.accountDetails[f] === 'check') {
            this.formFunding.fields[f].value = 0;
          } else if (account.accountDetails[f] === 'iraTransfer') {
            this.formFunding.fields[f].value = 1;
          } else {
            this.formFunding.fields[f].value = 2;
          }
          return this.formFunding.fields[f];
        });
        this.onFieldChange('formFunding');
        Object.keys(this.formAccTypes.fields).map((f) => {
          if (account.accountDetails[f] === 'traditional') {
            this.formAccTypes.fields[f].value = 0;
          } else {
            this.formAccTypes.fields[f].value = 1;
          }
          return this.formAccTypes.fields[f];
        });
        this.onFieldChange('formAccTypes');
        Object.keys(this.formIdentity.fields).map((f) => {
          this.formIdentity.fields[f].value = account.accountDetails[f];
          return this.formIdentity.fields[f];
        });
        this.onFieldChange('formIdentity');
        if (!this.formFinInfo.meta.isValid) {
          this.setStepToBeRendered(0);
        } else if (!this.formAccTypes.meta.isValid) {
          this.setStepToBeRendered(1);
        } else if (!this.formFunding.meta.isValid) {
          this.setStepToBeRendered(2);
        } else if (!this.formIdentity.meta.isValid) {
          this.setStepToBeRendered(3);
        } else {
          this.setStepToBeRendered(4);
        }
      }
    }
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}

export default new IraAccountStore();
