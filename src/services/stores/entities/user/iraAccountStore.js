import { observable, action, computed } from 'mobx';
import { isEmpty, find } from 'lodash';
import { DataFormatter, FormValidator } from '../../../../helper';
import {
  IRA_ACC_TYPES,
  IRA_FIN_INFO,
  IRA_IDENTITY,
  IRA_FUNDING,
} from '../../../../constants/account';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { createAccount, updateAccount } from '../../queries/account';
import { validationActions, accountActions } from '../../../actions';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';

class IraAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(IRA_FIN_INFO);
  @observable IDENTITY_FRM = FormValidator.prepareFormObject(IRA_IDENTITY);
  @observable ACC_TYPES_FRM = FormValidator.prepareFormObject(IRA_ACC_TYPES, true, true);
  @observable FUNDING_FRM = FormValidator.prepareFormObject(IRA_FUNDING, true, true);

  @observable stepToBeRendered = 0;
  @observable fundingNotSet = '';
  @observable accountNotSet = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
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
  finInfoChange = (values, field) => {
    this.FIN_INFO_FRM = FormValidator.onChange(
      this.FIN_INFO_FRM,
      { name: field, value: values.floatValue },
    );
  }

  @action
  finCurrencyValueChange = (values) => {
    const { value } = values;
    console.log(value);
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
  get isValidIraForm() {
    return this.FIN_INFO_FRM.meta.isValid && this.ACC_TYPES_FRM.meta.isValid
    && this.FUNDING_FRM.meta.isValid && this.IDENTITY_FRM.meta.isValid;
  }

  @computed
  get accountType() {
    const { values, value } = this.ACC_TYPES_FRM.fields.iraAccountType;
    return find(values, { value });
  }

  @computed
  get fundingOption() {
    const { values, value } = this.FUNDING_FRM.fields.fundingType;
    return find(values, { value });
  }

  @computed
  get accountAttributes() {
    let payload = {};
    payload = FormValidator.ExtractValues(this.FIN_INFO_FRM.fields);
    payload.identityDoc = {};
    payload.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
    payload.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
    payload.iraAccountType = this.accountType.rawValue;
    payload.fundingType = this.fundingOption.rawValue;
    return payload;
  }

  @action
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false) => {
    if (formStatus === 'submit') {
      this.submitForm(currentStep, formStatus, this.accountAttributes);
    } else {
      this.validateAndSubmitStep(currentStep, formStatus, removeUploadedData);
    }
  }

  @action
  validateAndSubmitStep = (currentStep, formStatus, removeUploadedData) => {
    let isValidCurrentStep = true;
    let accountAttributes = {};
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.FIN_INFO_FRM.meta.isValid;
        if (isValidCurrentStep) {
          accountAttributes = FormValidator.ExtractValues(this.FIN_INFO_FRM.fields);
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'Account type':
        isValidCurrentStep = true;
        accountAttributes.iraAccountType = this.accountType ? this.accountType.rawValue : '';
        this.submitForm(currentStep, formStatus, accountAttributes);
        break;
      case 'Funding':
        isValidCurrentStep = true;
        accountAttributes.fundingType = this.fundingOption ? this.fundingOption.rawValue : '';
        this.submitForm(currentStep, formStatus, accountAttributes);
        break;
      case 'Identity':
        if (removeUploadedData) {
          accountAttributes.identityDoc = {
            fileId: '',
            fileName: '',
          };
          this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData);
        } else {
          currentStep.validate();
          isValidCurrentStep = this.IDENTITY_FRM.meta.isValid;
          if (isValidCurrentStep) {
            uiStore.setProgress();
            accountAttributes.identityDoc = {};
            accountAttributes.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
            accountAttributes.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
            this.submitForm(currentStep, formStatus, accountAttributes);
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
      accountAttributes,
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
        .then(action((result) => {
          if (result.data.createInvestorAccount || formStatus === 'submit') {
            userDetailsStore.getUser(userStore.currentUser.sub);
          }
          if (currentStep.name === 'Identity') {
            if (removeUploadedData) {
              validationActions.validateIRAIdentityInfo();
            } else {
              FormValidator.setIsDirty(this[currentStep.form], false);
              this.setStepToBeRendered(currentStep.stepToBeRendered);
            }
          } else if (formStatus !== 'submit') {
            FormValidator.setIsDirty(this[currentStep.form], false);
            this.setStepToBeRendered(currentStep.stepToBeRendered);
          }
          if (formStatus === 'submit') {
            Helper.toast('IRA account created successfully.', 'success');
          } else {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
          }
          resolve(result);
        }))
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
        this.setFormData('FIN_INFO_FRM', account.accountDetails);
        this.setFormData('FUNDING_FRM', account.accountDetails);
        this.setFormData('ACC_TYPES_FRM', account.accountDetails);
        this.setFormData('IDENTITY_FRM', account.accountDetails);
        if (!this.FIN_INFO_FRM.meta.isValid) {
          this.setStepToBeRendered(0);
        } else if (!this.ACC_TYPES_FRM.meta.isValid || this.accountNotSet) {
          this.setStepToBeRendered(1);
        } else if (!this.FUNDING_FRM.meta.isValid || this.fundingNotSet) {
          this.setStepToBeRendered(2);
        } else if (!this.IDENTITY_FRM.meta.isValid) {
          this.setStepToBeRendered(3);
        } else {
          this.setStepToBeRendered(4);
        }
      }
    }
  }

  @action
  setFormData = (form, accountDetails) => {
    let isDirty = false;
    Object.keys(this[form].fields).map((f) => {
      if (form === 'FIN_INFO_FRM') {
        this[form].fields[f].value = accountDetails[f];
      } else if (form === 'IDENTITY_FRM') {
        if (accountDetails[f]) {
          this.IDENTITY_FRM.fields[f].value = accountDetails[f].fileName;
          this.IDENTITY_FRM.fields[f].fileId = accountDetails[f].fileId;
        }
      } else if (form === 'FUNDING_FRM' || form === 'ACC_TYPES_FRM') {
        let value = '';
        if (form === 'FUNDING_FRM') {
          value = AccCreationHelper.getFundingTypeIndex(accountDetails[f]);
        } else {
          value = AccCreationHelper.getAccountTypeIndex(accountDetails[f]);
        }
        if (value !== '') {
          this[form].fields[f].value = value;
        } else {
          if (form === 'FUNDING_FRM') {
            this.setFundingNotSet(true);
          } else {
            this.setAccountNotSet(true);
          }
          this[form].fields[f].value = 0;
          isDirty = true;
        }
      }
      return this[form].fields[f];
    });
    FormValidator.onChange(this[form], '', '', isDirty);
  }

  @action
  setFileUploadData = (field, files) => {
    accountActions.setFileUploadData(this.IDENTITY_FRM, field, files, 'ACCOUNT_IRA_CREATION_CIP').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this.IDENTITY_FRM.fields[field].fileId = fileId;
      this.IDENTITY_FRM.fields[field].preSignedUrl = preSignedUrl;
      const fileData = Helper.getFormattedFileData(files);
      this.IDENTITY_FRM = FormValidator.onChange(
        this.IDENTITY_FRM,
        { name: field, value: fileData.fileName },
      );
      uiStore.setProgress();
      Helper.putUploadedFile([this.IDENTITY_FRM.fields.identityDoc])
        .then(() => {
        })
        .catch((err) => {
          uiStore.setProgress(false);
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
        });
    }));
  }

  @action
  removeUploadedData = (field) => {
    const currentStep = { name: 'Identity' };
    accountActions.removeUploadedData(this.IDENTITY_FRM, field, 'ACCOUNT_IRA_CREATION_CIP').then(action(() => {
      this.IDENTITY_FRM.fields[field].value = '';
      this.IDENTITY_FRM.fields[field].fileId = '';
      this.IDENTITY_FRM.fields[field].preSignedUrl = '';
      this.createAccount(currentStep, 'draft', true);
    }))
      .catch(() => { });
  }
}
export default new IraAccountStore();
