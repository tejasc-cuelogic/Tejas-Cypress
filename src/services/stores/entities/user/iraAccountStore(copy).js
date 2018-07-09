import { action, observable, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createAccount, updateAccount } from '../../queries/account';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import { accountStore, uiStore, userStore, userDetailsStore } from '../../index';
import Helper from '../../../../helper/utility';
import { validationActions } from '../../../actions';
import {
  IRA_FIN_INFO,
  IRA_ACC_TYPES,
  IRA_FUNDING,
  IRA_IDENTITY,
} from '../../../../constants/account';
import { DataFormatter } from '../../../../helper';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';

class IraAccountStore {
  @observable
  formFinInfo = {
    fields: { ...IRA_FIN_INFO }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formAccTypes = {
    fields: { ...IRA_ACC_TYPES }, meta: { isValid: true, error: '', isDirty: true },
  };

  @observable
  formFunding = {
    fields: { ...IRA_FUNDING }, meta: { isValid: true, error: '', isDirty: true },
  };

  @observable
  formIdentity = {
    fields: { ...IRA_IDENTITY }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  stepToBeRendered = 0;

  @observable
  formStatus = 'draft';

  @observable
  accountNotSet = '';

  @observable
  fundingNotSet = '';

  @action
  setAccountNotSet(step) {
    this.accountNotSet = step;
  }

  @action
  setFundingNotSet(step) {
    this.fundingNotSet = step;
  }

  @action
  setFormStatus(formStatus) {
    this.formStatus = formStatus;
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
  onFieldChange = (currentForm, field, value, isDirty = true) => {
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
    this[form].meta.isDirty = isDirty;
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
    const { values, value } = this.formAccTypes.fields.iraAccountType;
    const accountType = AccCreationHelper.getValueFromArray(values, value);
    const fundingOption =
      AccCreationHelper.getValueFromArray(
        this.formFunding.fields.fundingType.values,
        this.formFunding.fields.fundingType.value,
      );
    if (this.formStatus === 'submit') {
      payload.netWorth = this.formFinInfo.fields.netWorth.value;
      payload.annualIncome = this.formFinInfo.fields.annualIncome.value;
      payload.identityDoc = {};
      payload.identityDoc.fileId = this.formIdentity.fields.identityDoc.fileId;
      payload.identityDoc.fileName = this.formIdentity.fields.identityDoc.value;
      payload.iraAccountType = accountType.label.toLowerCase();
      payload.fundingType = AccCreationHelper.getFundingType(fundingOption.label.toLowerCase());
    }
    return payload;
  }

  /* eslint-disable consistent-return */
  @action
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false) => {
    if (formStatus === 'submit') {
      this.setFormStatus('submit');
      this.submitForm(currentStep, formStatus, this.accountAttributes);
    }
    this.validateAndSubmitStep(currentStep, formStatus, removeUploadedData);
  }

  @action
  validateAndSubmitStep = (currentStep, formStatus, removeUploadedData) => {
    let isValidCurrentStep = true;
    const { accountAttributes } = this;
    const { values, value } = this.formAccTypes.fields.iraAccountType;
    const accountType = AccCreationHelper.getValueFromArray(values, value);
    const fundingOption =
      AccCreationHelper.getValueFromArray(
        this.formFunding.fields.fundingType.values,
        this.formFunding.fields.fundingType.value,
      );
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidIraFinancialInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.netWorth = this.formFinInfo.fields.netWorth.value;
          accountAttributes.annualIncome = this.formFinInfo.fields.annualIncome.value;
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'Account type':
        isValidCurrentStep = true;
        accountAttributes.iraAccountType = accountType.label.toLowerCase();
        uiStore.setProgress();
        this.submitForm(currentStep, formStatus, accountAttributes);
        break;
      case 'Funding':
        isValidCurrentStep = true;
        accountAttributes.fundingType = this.getFundingType(fundingOption.label.toLowerCase());
        uiStore.setProgress();
        this.submitForm(currentStep, formStatus, accountAttributes);
        break;
      case 'Identity':
        if (removeUploadedData) {
          accountAttributes.identityDoc = {
            fileId: '',
            fileName: '',
          };
          uiStore.setProgress();
          this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData);
        } else {
          currentStep.validate();
          isValidCurrentStep = this.isValidIraIdentity;
          if (isValidCurrentStep) {
            uiStore.setProgress();
            accountAttributes.identityDoc = {};
            accountAttributes.identityDoc.fileId = this.formIdentity.fields.identityDoc.fileId;
            accountAttributes.identityDoc.fileName = this.formIdentity.fields.identityDoc.value;
            return new Promise((resolve, reject) => {
              Helper.putUploadedFile([this.formIdentity.fields.identityDoc])
                .then(() => {
                  this.submitForm(currentStep, formStatus, accountAttributes);
                })
                .catch((err) => {
                  uiStore.setProgress(false);
                  uiStore.setErrors(DataFormatter.getSimpleErr(err));
                  reject(err);
                });
            });
          }
        }
        break;
      default:
        break;
    }
  }

  @action
  submitForm = (currentStep, formStatus, accountAttributes, removeUploadedData = false) => {
    uiStore.setProgress();
    let mutation = createAccount;
    const variables = {
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
        variables.accountId = accountDetails.accountId;
        actionPerformed = 'updated';
      }
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation,
          variables,
        })
        .then((result) => {
          if (result.data.createInvestorAccount) {
            accountStore.setAccountTypeCreated(result.data.createInvestorAccount.accountType);
          } else {
            accountStore.setAccountTypeCreated(result.data.updateInvestorAccount.accountType);
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
              if (removeUploadedData) {
                validationActions.validateIRAIdentityInfo();
              } else {
                this.setIsDirty('formIdentity', false);
                this.setStepToBeRendered(4);
              }
              break;
            default:
              break;
          }
          if (formStatus === 'submit') {
            Helper.toast('IRA account created successfully.', 'success');
            userDetailsStore.getUser(userStore.currentUser.sub);
          } else {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
          }
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
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
        this.onFieldChange('formFinInfo', undefined, undefined, false);
        let isDirty = false;
        Object.keys(this.formFunding.fields).map((f) => {
          if (account.accountDetails[f] === 'check') {
            this.formFunding.fields[f].value = 0;
          } else if (account.accountDetails[f] === 'iraTransfer') {
            this.formFunding.fields[f].value = 1;
          } else if (account.accountDetails[f] === 'directRollOver') {
            this.formFunding.fields[f].value = 2;
          } else {
            this.setFundingNotSet('funding');
            this.formFunding.fields[f].value = 0;
            isDirty = true;
          }
          return this.formFunding.fields[f];
        });
        this.onFieldChange('formFunding', undefined, undefined, isDirty);
        isDirty = false;
        Object.keys(this.formAccTypes.fields).map((f) => {
          if (account.accountDetails[f] === 'traditional') {
            this.formAccTypes.fields[f].value = 0;
          } else if (account.accountDetails[f] === 'roth') {
            this.formAccTypes.fields[f].value = 1;
          } else {
            this.setAccountNotSet('accType');
            this.formAccTypes.fields[f].value = 0;
            isDirty = true;
          }
          return this.formAccTypes.fields[f];
        });
        this.onFieldChange('formAccTypes', undefined, undefined, isDirty);
        Object.keys(this.formIdentity.fields).map((f) => {
          if (account.accountDetails[f]) {
            this.formIdentity.fields[f].value = account.accountDetails[f].fileName;
            this.formIdentity.fields[f].fileId = account.accountDetails[f].fileId;
          }
          return this.formIdentity.fields[f];
        });
        this.onFieldChange('formIdentity', undefined, undefined, false);
        if (!uiStore.errors) {
          if (!this.formFinInfo.meta.isValid) {
            this.setStepToBeRendered(0);
          } else if (!this.formAccTypes.meta.isValid || this.accountNotSet === 'accType') {
            this.setStepToBeRendered(1);
          } else if (!this.formFunding.meta.isValid || this.fundingNotSet === 'funding') {
            this.setStepToBeRendered(2);
          } else if (!this.formIdentity.meta.isValid) {
            this.setStepToBeRendered(3);
          } else {
            this.setStepToBeRendered(4);
          }
        }
      }
    }
  }

  @action
  setFileUploadData(field, files) {
    this.formIdentity.fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    this.onFieldChange('formIdentity', field, fileData.fileName);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            userId: userStore.currentUser.sub,
            stepName: 'IRAAccountDocuments',
            fileData,
          },
        })
        .then(action((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          this.formIdentity.fields[field].fileId = fileId;
          this.formIdentity.fields[field].preSignedUrl = preSignedUrl;
          resolve();
        }))
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          this.onFieldChange('formIdentity', field, '');
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  removeUploadedData(field) {
    const currentStep = { name: 'Identity' };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: this.formIdentity.fields[field].fileId,
          },
        })
        .then(() => {
          this.onFieldChange('formIdentity', field, '');
          this.formIdentity.fields[field].fileId = '';
          this.formIdentity.fields[field].preSignedUrl = '';
          this.createAccount(currentStep, 'draft', true);
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new IraAccountStore();
