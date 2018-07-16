import { observable, action, computed } from 'mobx';
import { isEmpty, find } from 'lodash';
import {
  IRA_ACC_TYPES,
  IRA_FIN_INFO,
  IRA_IDENTITY,
  IRA_FUNDING,
} from '../../../../constants/account';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { createAccount, updateAccount } from '../../queries/account';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator, DataFormatter } from '../../../../helper';
import { validationActions } from '../../../actions';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import Helper from '../../../../helper/utility';

class IraAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(IRA_FIN_INFO);
  @observable IDENTITY_FRM = FormValidator.prepareFormObject(IRA_IDENTITY);
  @observable ACC_TYPES_FRM = FormValidator.prepareFormObject(IRA_ACC_TYPES, true, true);
  @observable FUNDING_FRM = FormValidator.prepareFormObject(IRA_FUNDING, true, true);

  @observable formStatus = 'draft';
  @observable stepToBeRendered = 0;
  @observable fundingNotSet = '';
  @observable accountNotSet = '';

  @action
  setFormStatus(formStatus) {
    this.formStatus = formStatus;
  }

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  setIsDirty = (form, status) => {
    this[form].meta.isDirty = status;
  }

  @action
  setIraError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @action
  setAccountNotSet(step) {
    this.accountNotSet = step;
  }

  @action
  setFundingNotSet(step) {
    this.fundingNotSet = step;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  finInfoChange = (e, result) => {
    this.formChange(e, result, 'FIN_INFO_FRM');
  }

  /**
   * @todo Do file upload related changes
   */
  @action
  identityInfoChange = (e, result) => {
    this.formChange(e, result, 'IDENTITY_FRM');
  }

  @action
  accTypesChange = (e, result) => {
    this.formChange(e, result, 'ACC_TYPES_FRM');
  }

  @action
  fundingChange = (e, result) => {
    this.formChange(e, result, 'FUNDING_FRM');
  }

  @computed
  get isValidFinancialInfo() {
    const { netWorth, annualIncome } = this.FIN_INFO_FRM.fields;
    return isEmpty(netWorth.error) && isEmpty(annualIncome.error);
  }

  @computed
  get isValidIdentity() {
    const { error } = this.IDENTITY_FRM.fields.identityDoc;
    return isEmpty(error);
  }

  @computed
  get isValidIraForm() {
    return this.FIN_INFO_FRM.meta.isValid && this.ACC_TYPES_FRM.meta.isValid
    && this.FUNDING_FRM.meta.isValid && this.IDENTITY_FRM.meta.isValid;
  }

  @computed
  get accountType() {
    const { values, value } = this.ACC_TYPES_FRM.fields.iraAccountType;
    const accountType = find(values, { value });
    return accountType;
  }

  @computed
  get fundingOption() {
    const { values, value } = this.FUNDING_FRM.fields.fundingType;
    const fundingOption = find(values, { value });
    return fundingOption;
  }

  @computed
  get accountAttributes() {
    const payload = {};
    if (this.formStatus === 'submit') {
      payload.netWorth = this.FIN_INFO_FRM.fields.netWorth.value;
      payload.annualIncome = this.FIN_INFO_FRM.fields.annualIncome.value;
      payload.identityDoc = {};
      payload.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
      payload.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
      payload.iraAccountType = this.accountType.label.toLowerCase();
      payload.fundingType =
        AccCreationHelper.getFundingType(this.fundingOption.label.toLowerCase());
    }
    return payload;
  }

  @action
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false) => {
    if (formStatus === 'submit') {
      this.setFormStatus('submit');
      this.submitForm(currentStep, formStatus, this.accountAttributes);
    } else {
      this.validateAndSubmitStep(currentStep, formStatus, removeUploadedData);
    }
  }

  @action
  validateAndSubmitStep = (currentStep, formStatus, removeUploadedData) => {
    let isValidCurrentStep = true;
    const { accountAttributes } = this;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidFinancialInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.netWorth = this.FIN_INFO_FRM.fields.netWorth.value;
          accountAttributes.annualIncome = this.FIN_INFO_FRM.fields.annualIncome.value;
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'Account type':
        isValidCurrentStep = true;
        accountAttributes.iraAccountType = this.accountType.label.toLowerCase();
        uiStore.setProgress();
        this.submitForm(currentStep, formStatus, accountAttributes);
        break;
      case 'Funding':
        isValidCurrentStep = true;
        accountAttributes.fundingType =
          AccCreationHelper.getFundingType(this.fundingOption.label.toLowerCase());
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
            accountAttributes.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
            accountAttributes.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
            return new Promise((resolve, reject) => {
              Helper.putUploadedFile([this.IDENTITY_FRM.fields.identityDoc])
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
    return true;
  }

  @action
  submitForm = (currentStep, formStatus, accountAttributes, removeUploadedData = false) => {
    uiStore.setProgress();
    let mutation = createAccount;
    const variables = {
      userId: userStore.currentUser.sub,
      accountAttributes: this.accountAttributes,
      status: formStatus,
      accountType: 'ira',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.accounts, { accountType: 'ira' });
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
          switch (currentStep.name) {
            case 'Financial info':
              this.setIsDirty('FIN_INFO_FRM', false);
              this.setStepToBeRendered(1);
              break;
            case 'Account type':
              this.setIsDirty('ACC_TYPES_FRM', false);
              this.setStepToBeRendered(2);
              break;
            case 'Funding':
              this.setIsDirty('FUNDING_FRM', false);
              this.setStepToBeRendered(3);
              break;
            case 'Identity':
              if (removeUploadedData) {
                validationActions.validateIRAIdentityInfo();
              } else {
                this.setIsDirty('IDENTITY_FRM', false);
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
    if (!isEmpty(userData)) {
      const account = find(userData.accounts, { accountType: 'ira' });
      if (account) {
        // Financial Information
        Object.keys(this.FIN_INFO_FRM.fields).map((f) => {
          this.FIN_INFO_FRM.fields[f].value = account.accountDetails[f];
          return this.FIN_INFO_FRM.fields[f];
        });
        FormValidator.onChange(this.FIN_INFO_FRM, '', '', false);

        // Funding Type
        let isDirty = false;
        Object.keys(this.FUNDING_FRM.fields).map((f) => {
          const value = AccCreationHelper.getFundingTypeIndex(account.accountDetails[f]);
          if (value !== '') {
            this.FUNDING_FRM.fields[f].value = value;
          } else {
            this.setFundingNotSet('funding');
            this.FUNDING_FRM.fields[f].value = 0;
            isDirty = true;
          }
          return this.FUNDING_FRM.fields[f];
        });
        FormValidator.onChange(this.FUNDING_FRM, '', '', isDirty);

        // Account Types
        isDirty = false;
        Object.keys(this.ACC_TYPES_FRM.fields).map((f) => {
          const value = AccCreationHelper.getAccountTypeIndex();
          if (value !== '') {
            this.ACC_TYPES_FRM.fields[f].value = value;
          } else {
            this.setAccountNotSet('accType');
            this.ACC_TYPES_FRM.fields[f].value = 0;
            isDirty = true;
          }
          return this.ACC_TYPES_FRM.fields[f];
        });
        FormValidator.onChange(this.ACC_TYPES_FRM, '', '', isDirty);

        // Identity Form
        Object.keys(this.IDENTITY_FRM.fields).map((f) => {
          if (account.accountDetails[f]) {
            this.IDENTITY_FRM.fields[f].value = account.accountDetails[f].fileName;
            this.IDENTITY_FRM.fields[f].fileId = account.accountDetails[f].fileId;
          }
          return this.IDENTITY_FRM.fields[f];
        });
        FormValidator.onChange(this.IDENTITY_FRM, '', '', false);

        // Resume the step on opening the modal
        if (!uiStore.errors) {
          if (!this.FIN_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(0);
          } else if (!this.ACC_TYPES_FRM.meta.isValid || this.accountNotSet === 'accType') {
            this.setStepToBeRendered(1);
          } else if (!this.FUNDING_FRM.meta.isValid || this.fundingNotSet === 'funding') {
            this.setStepToBeRendered(2);
          } else if (!this.IDENTITY_FRM.meta.isValid) {
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
    this.IDENTITY_FRM.fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    this.IDENTITY_FRM = FormValidator.onChange(
      this.IDENTITY_FRM,
      { name: field, value: fileData.fileName },
    );
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
          this.IDENTITY_FRM.fields[field].fileId = fileId;
          this.IDENTITY_FRM.fields[field].preSignedUrl = preSignedUrl;
          resolve();
        }))
        .catch(action((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          this.IDENTITY_FRM = FormValidator.onChange(
            this.IDENTITY_FRM,
            { name: field, value: '' },
          );
          reject(err);
        }))
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
            fileId: this.IDENTITY_FRM.fields[field].fileId,
          },
        })
        .then(() => {
          this.onFieldChange('IDENTITY_FRM', field, '');
          this.IDENTITY_FRM.fields[field].fileId = '';
          this.IDENTITY_FRM.fields[field].preSignedUrl = '';
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
