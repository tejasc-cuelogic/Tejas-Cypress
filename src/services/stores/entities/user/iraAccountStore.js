import { observable, action, computed } from 'mobx';
import { isEmpty, find, omit, get } from 'lodash';
import { DataFormatter, FormValidator } from '../../../../helper';
import {
  IRA_ACC_TYPES,
  IRA_FIN_INFO,
  IRA_IDENTITY,
  IRA_FUNDING,
  FILE_UPLOAD_STEPS,
} from '../../../../constants/account';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { uiStore, bankAccountStore, userDetailsStore, investmentLimitStore, userStore, accountStore } from '../../index';
import { upsertInvestorAccount, submitinvestorAccount } from '../../queries/account';
import { validationActions, fileUpload } from '../../../actions';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';

class IraAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(IRA_FIN_INFO);
  @observable IDENTITY_FRM = FormValidator.prepareFormObject(IRA_IDENTITY);
  @observable ACC_TYPES_FRM = FormValidator.prepareFormObject(IRA_ACC_TYPES);
  @observable FUNDING_FRM = FormValidator.prepareFormObject(IRA_FUNDING);
  @observable iraAccountId = null;
  @observable showProcessingModal = false;
  @observable isFormSubmitted = false;


  @observable stepToBeRendered = 0;
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
    const investmentLimit =
    investmentLimitStore.getInvestmentLimit({
      annualIncome: typeof this.FIN_INFO_FRM.fields.income.value === 'string' ? parseFloat(this.FIN_INFO_FRM.fields.income.value) : this.FIN_INFO_FRM.fields.income.value,
      netWorth: typeof this.FIN_INFO_FRM.fields.netWorth.value === 'string' ? parseFloat(this.FIN_INFO_FRM.fields.netWorth.value) : this.FIN_INFO_FRM.fields.netWorth.value,
    });
    this.FIN_INFO_FRM = FormValidator.onChange(
      this.FIN_INFO_FRM,
      { name: 'investmentLimit', value: investmentLimit },
    );
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
    if (this.FUNDING_FRM.fields.fundingType.value === 0) {
      return this.FIN_INFO_FRM.meta.isValid && this.ACC_TYPES_FRM.meta.isValid
      && this.FUNDING_FRM.meta.isValid && this.IDENTITY_FRM.meta.isValid &&
      bankAccountStore.formAddFunds.meta.isValid &&
      (bankAccountStore.formLinkBankManually.meta.isValid || bankAccountStore.isAccountPresent);
    }
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
    /* eslint-disable camelcase */
    const payload = {};
    payload.limits = {};
    const limitValues = FormValidator.ExtractValues(this.FIN_INFO_FRM.fields);
    payload.limits = omit(limitValues, ['investmentLimit']);
    payload.identityDoc = {};
    payload.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
    payload.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
    payload.iraAccountType = this.accountType.rawValue;
    payload.fundingType = this.fundingOption.rawValue;
    if (this.fundingOption.rawValue === 'check' && !isEmpty(bankAccountStore.plaidAccDetails)) {
      payload.linkedBank = {};
      const {
        account_id,
        public_token,
        accountNumber,
        routingNumber,
      } = bankAccountStore.plaidAccDetails;
      if (account_id && public_token) {
        payload.linkedBank.plaidPublicToken = public_token;
        payload.linkedBank.plaidAccountId = account_id;
      } else {
        payload.linkedBank.accountNumber = accountNumber;
        payload.linkedBank.routingNumber = routingNumber;
      }
      const isValidAddFunds = bankAccountStore.formAddFunds.meta.isFieldValid;
      if (isValidAddFunds) {
        payload.initialDepositAmount = bankAccountStore.formAddFunds.fields.value.value;
      }
    } else if (this.fundingOption.rawValue === 'check') {
      payload.linkedBank = {};
      const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
      if (accountNumber && routingNumber) {
        payload.linkedBank.accountNumber = accountNumber.value;
        payload.linkedBank.routingNumber = routingNumber.value;
        const isValidAddFunds = bankAccountStore.formAddFunds.meta.isFieldValid;
        if (isValidAddFunds) {
          payload.initialDepositAmount = bankAccountStore.formAddFunds.fields.value.value;
        }
      }
    }
    return payload;
  }
  @action
  submitAccount = () => new Promise((resolve) => {
    if (this.FUNDING_FRM.fields.fundingType.value === 0) {
      this.submitMutation().then(() => {
        resolve();
      }).catch((e) => {
        console.log(e);
      });
    } else {
      this.submitMutation().then(() => {
        resolve();
      }).catch((e) => {
        console.log(e);
      });
    }
  });

  @action
  submitMutation = () => new Promise((resolve, reject) => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'ira' });
    uiStore.setProgress();
    const payLoad = {
      accountId: get(accountDetails, 'details.accountId') || this.iraAccountId,
      accountType: 'IRA',
    };
    client
      .mutate({
        mutation: submitinvestorAccount,
        variables: payLoad,
      })
      .then(() => {
        this.setFieldValue('showProcessingModal', true);
        bankAccountStore.resetStoreData();
        this.isFormSubmitted = true;
        uiStore.setProgress(false);
        Helper.toast('IRA account submitted successfully.', 'success');
        resolve();
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        uiStore.resetcreateAccountMessage();
        uiStore.setProgress(false);
        reject();
      });
  });

  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  @action
  createAccount = (currentStep, removeUploadedData = false) => new Promise((resolve) => {
    this.validateAndSubmitStep(currentStep, removeUploadedData).then(() => {
      resolve();
    }).catch((e) => {
      console.log(e);
    });
  })

  @action
  validateAndSubmitStep =
  (currentStep, removeUploadedData) => new Promise((res, rej) => {
    let isValidCurrentStep = true;
    const accountAttributes = {};
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.FIN_INFO_FRM.meta.isValid;
        if (isValidCurrentStep) {
          let limitValues = FormValidator.ExtractValues(this.FIN_INFO_FRM.fields);
          limitValues = omit(limitValues, ['investmentLimit']);
          accountAttributes.limits = limitValues;
          this.submitForm(currentStep, accountAttributes).then(() => {
            res();
          })
            .catch(() => {
              rej();
            });
        } else {
          rej();
        }
        break;
      case 'Account type':
        isValidCurrentStep = this.ACC_TYPES_FRM.meta.isValid;
        accountAttributes.iraAccountType = this.accountType ? this.accountType.rawValue : '';
        if (isValidCurrentStep) {
          this.submitForm(currentStep, accountAttributes).then(() => {
            res();
          })
            .catch(() => {
              rej();
            });
        } else {
          rej();
        }
        break;
      case 'Funding':
        isValidCurrentStep = this.FUNDING_FRM.meta.isValid;
        accountAttributes.fundingType = this.fundingOption ? this.fundingOption.rawValue : '';
        if (accountAttributes.fundingType !== 'check') {
          bankAccountStore.setPlaidAccDetails({});
          bankAccountStore.resetRoutingNum();
          bankAccountStore.setLinkBankSummary(false);
        }
        if (isValidCurrentStep) {
          this.submitForm(currentStep, accountAttributes).then(() => {
            res();
          })
            .catch((err) => {
              uiStore.setErrors(DataFormatter.getSimpleErr(err));
              uiStore.setProgress(false);
              rej();
            });
        } else {
          rej();
        }
        break;
      case 'Link bank':
        if (parseFloat(bankAccountStore.formAddFunds.fields.value.value, 0) !== 0) {
          bankAccountStore.validateAddFunds();
        }
        if (bankAccountStore.manualLinkBankSubmitted) {
          currentStep.validate();
        }
        isValidCurrentStep = bankAccountStore.isAccountPresent ||
          bankAccountStore.formLinkBankManually.meta.isValid ||
          bankAccountStore.formAddFunds.meta.isValid;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          // if (!isEmpty(bankAccountStore.plaidAccDetails) &&
          // !bankAccountStore.manualLinkBankSubmitted) {
          //   const { public_token, account_id } = bankAccountStore.plaidAccDetails;
          //   accountAttributes.linkedBank = {};
          //   accountAttributes.linkedBank.plaidPublicToken = public_token;
          //   accountAttributes.linkedBank.plaidAccountId = account_id;
          // } else {
          //   const { accountNumber, routingNumber } =
          // bankAccountStore.formLinkBankManually.fields;
          //   if (accountNumber && routingNumber) {
          //     const plaidBankDetails = {
          //       accountNumber: accountNumber.value,
          //       routingNumber: routingNumber.value,
          //       accountType: accountType.value,
          //     };
          //     accountAttributes.linkedBank = plaidBankDetails;
          //   }
          // }
          accountAttributes.linkedBank = bankAccountStore.accountAttributes.linkedBank;
          accountAttributes.initialDepositAmount =
            bankAccountStore.accountAttributes.initialDepositAmount;
          bankAccountStore.isValidOpeningDepositAmount().then(() => {
            this.submitForm(currentStep, accountAttributes).then(() => {
              res();
            })
              .catch(() => {
                uiStore.setProgress(false);
                rej();
              });
          })
            .catch(() => {
              rej();
            });
        } else {
          rej();
        }
        break;
      case 'Identity':
        if (removeUploadedData) {
          accountAttributes.identityDoc = {
            fileId: '',
            fileName: '',
          };
          this.submitForm(currentStep, accountAttributes, removeUploadedData)
            .then(() => {
              res();
            })
            .catch(() => {
              rej();
            });
        } else {
          currentStep.validate();
          isValidCurrentStep = this.IDENTITY_FRM.meta.isValid;
          if (isValidCurrentStep) {
            uiStore.setProgress();
            accountAttributes.identityDoc = {};
            accountAttributes.identityDoc.fileId = this.IDENTITY_FRM.fields.identityDoc.fileId;
            accountAttributes.identityDoc.fileName = this.IDENTITY_FRM.fields.identityDoc.value;
            this.submitForm(currentStep, accountAttributes).then(() => {
              res();
            })
              .catch((err) => {
                uiStore.setErrors(DataFormatter.getSimpleErr(err));
                uiStore.setProgress(false);
                rej();
              });
          } else {
            rej();
          }
        }
        break;
      default:
        break;
    }
    return true;
  })

  @action
  submitForm = (currentStep, accountAttributes, removeUploadedData = false) => {
    uiStore.setProgress();
    let mutation = upsertInvestorAccount;
    const variables = {
      accountAttributes,
      accountType: 'IRA',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'ira' });
      if (accountDetails || this.iraAccountId) {
        mutation = upsertInvestorAccount;
        variables.accountId = get(accountDetails, 'details.accountId')
          || this.iraAccountId;
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
          this.iraAccountId = result.data.upsertInvestorAccount.accountId;
          accountStore.accountToastMessage(currentStep, actionPerformed);
          if (result.data.upsertInvestorAccount && currentStep.name === 'Link bank') {
            userDetailsStore.getUser(userStore.currentUser.sub);
            const { linkedBank } = result.data.upsertInvestorAccount;
            bankAccountStore.setPlaidAccDetails(linkedBank);
            FormValidator.setIsDirty(bankAccountStore.formAddFunds, false);
            FormValidator.setIsDirty(bankAccountStore.formLinkBankManually, false);
          }
          if (currentStep.name === 'Identity') {
            if (removeUploadedData) {
              validationActions.validateIRAIdentityInfo();
            } else {
              FormValidator.setIsDirty(this[currentStep.form], false);
            }
          } else if (currentStep.name !== 'Link bank') {
            FormValidator.setIsDirty(this[currentStep.form], false);
          }
          this.setStepToBeRendered(currentStep.stepToBeRendered);
          uiStore.setErrors(null);
          uiStore.setProgress(false);
          resolve(result);
        }))
        .catch((err) => {
          if (currentStep.name === 'Link bank') {
            bankAccountStore.resetShowAddFunds();
          }
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          uiStore.setProgress(false);
          reject(err);
        });
      // .finally(() => {
      //   uiStore.setProgress(false);
      // });
    });
  }

  @action
  populateData = (userData) => {
    if (Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/])) {
      if (!isEmpty(userData)) {
        const account = find(userData.roles, { name: 'ira' });
        if (account) {
          this.setFormData('FIN_INFO_FRM', account.details, userData);
          this.setFormData('FUNDING_FRM', account.details);
          this.setFormData('ACC_TYPES_FRM', account.details);
          this.setFormData('IDENTITY_FRM', account.details);
          bankAccountStore.validateAddFunds();
          const { isValid } = bankAccountStore.formEntityAddFunds.meta;
          if (get(account.details, 'linkedBank.routingNumber')) {
            bankAccountStore.setPlaidAccDetails(account.details.linkedBank);
            if (isValid) {
              bankAccountStore.formEntityAddFunds.fields.value.value =
              account.details.initialDepositAmount;
            }
          } else {
            Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
              const { details } = account;
              if (details.linkedBank && details.linkedBank[f] !== '') {
                bankAccountStore.formLinkBankManually.fields[f].value =
                details.linkedBank[f];
                return bankAccountStore.formLinkBankManually.fields[f];
              }
              return null;
            });
            if (account.details.linkedBank && account.details.linkedBank.routingNumber !== '' &&
            account.details.linkedBank.accountNumber !== '') {
              bankAccountStore.linkBankFormChange();
            }
            if (isValid) {
              bankAccountStore.formEntityAddFunds.fields.value.value =
              account.details.initialDepositAmount;
            }
          }
          bankAccountStore.validateAddFunds();
          // bankAccountStore.validateAddfundsAmount();
          const getIraStep = AccCreationHelper.iraSteps();
          if (!this.FIN_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(getIraStep.FIN_INFO_FRM);
          } else if (!this.ACC_TYPES_FRM.meta.isValid) {
            this.setStepToBeRendered(getIraStep.ACC_TYPES_FRM);
          } else if (!this.FUNDING_FRM.meta.isValid) {
            this.setStepToBeRendered(getIraStep.FUNDING_FRM);
          } else if (this.FUNDING_FRM.fields.fundingType.value === 0 &&
            (bankAccountStore.isLinkbankInComplete)) {
            this.setStepToBeRendered(getIraStep.LINK_BANK);
          } else if (!this.IDENTITY_FRM.meta.isValid || this.stepToBeRendered === 4) {
            if (this.FUNDING_FRM.fields.fundingType.value === 0) {
              this.setStepToBeRendered(4);
            } else {
              this.setStepToBeRendered(getIraStep.IDENTITY_FRM);
            }
          } else if (this.FUNDING_FRM.fields.fundingType.value === 0) {
            this.setStepToBeRendered(5);
          } else {
            this.setStepToBeRendered(getIraStep.summary);
          }
        }
      }
    }
    uiStore.setProgress(false);
  }

  @action
  setFormData = (form, accountDetails, userData) => {
    Object.keys(this[form].fields).map((f) => {
      if (form === 'FIN_INFO_FRM' && f !== 'investmentLimit' && userData && userData.limits) {
        this[form].fields[f].value = userData.limits[f];
      } else if (form === 'IDENTITY_FRM') {
        if (accountDetails[f]) {
          this.IDENTITY_FRM.fields[f].value = accountDetails[f].fileName;
          this.IDENTITY_FRM.fields[f].fileId = accountDetails[f].fileId;
        }
      } else if ((form === 'FUNDING_FRM' || form === 'ACC_TYPES_FRM') && accountDetails && accountDetails[f]) {
        let value = '';
        if (form === 'FUNDING_FRM') {
          value = AccCreationHelper.getFundingTypeIndex(accountDetails[f]);
        } else {
          value = AccCreationHelper.getAccountTypeIndex(accountDetails[f]);
        }
        if (value !== '') {
          this[form].fields[f].value = value;
        } else {
          this[form].fields[f].value = '';
        }
      }
      return this[form].fields[f];
    });
    FormValidator.onChange(this[form], '', '', false);
  }

  @action
  setFileUploadData = (field, files) => {
    uiStore.setProgress();
    const file = files[0];
    const stepName = FILE_UPLOAD_STEPS[field];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this.IDENTITY_FRM.fields[field].fileId = fileId;
      this.IDENTITY_FRM.fields[field].preSignedUrl = preSignedUrl;
      this.IDENTITY_FRM.fields[field].fileData = file;
      this.IDENTITY_FRM = FormValidator.onChange(
        this.IDENTITY_FRM,
        { name: field, value: fileData.fileName },
      );
      uiStore.setProgress();
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
        .then(() => {
          const currentStep = {
            name: 'Identity',
            validate: validationActions.validateIRAIdentityInfo,
            form: 'IDENTITY_FRM',
            stepToBeRendered: this.FUNDING_FRM.fields.fundingType.value === 0 ? 5 : 4,
          };
          this.createAccount(currentStep, false);
        })
        .catch((err) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setProgress(false);
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
        });
    }));
  }

  @action
  removeUploadedData = (field) => {
    const currentStep = { name: 'Identity' };
    const { fileId } = this.IDENTITY_FRM.fields[field];
    fileUpload.removeUploadedData(fileId).then(action(() => {
      this.IDENTITY_FRM.fields[field].value = '';
      this.IDENTITY_FRM.fields[field].fileId = '';
      this.IDENTITY_FRM.fields[field].preSignedUrl = '';
      this.createAccount(currentStep, true);
    }))
      .catch(() => { });
  }

  @action
  resetFormData(form) {
    const resettedForm = FormValidator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @action
  resetStoreData = () => {
    this.resetFormData('FIN_INFO_FRM');
    this.resetFormData('IDENTITY_FRM');
    this.resetFormData('ACC_TYPES_FRM');
    this.resetFormData('FUNDING_FRM');
    this.stepToBeRendered = 0;
    this.accountNotSet = '';
    this.iraAccountId = null;
  }
}
export default new IraAccountStore();
