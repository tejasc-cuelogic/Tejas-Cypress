import { observable, action, computed } from 'mobx';
import { isEmpty, omit, find } from 'lodash';
import { FormValidator, DataFormatter } from '../../../../helper';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
} from '../../../../constants/account';
import { bankAccountStore, userDetailsStore, userStore, accountStore, uiStore } from '../../index';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createAccount, updateAccount } from '../../queries/account';
import { validationActions } from '../../../actions';
import Helper from '../../../../helper/utility';

class EntityAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_FIN_INFO);
  @observable GEN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_GEN_INFO);
  @observable TRUST_INFO_FRM = FormValidator.prepareFormObject(ENTITY_TRUST_INFO);
  @observable PERSONAL_INFO_FRM = FormValidator.prepareFormObject(ENTITY_PERSONAL_INFO);
  @observable FORM_DOCS_FRM = FormValidator.prepareFormObject(ENTITY_FORMATION_DOCS);
  @observable stepToBeRendered = 0;
  @observable entityData = {};
  @observable formStatus = 'draft';

  /**
   * @todo create a generic function for on change.
   */
  @action
  setFormStatus(formStatus) {
    this.formStatus = formStatus;
  }

  @action
  finInfoChange = (e, result) => {
    this.FIN_INFO_FRM = FormValidator.onChange(
      this.FIN_INFO_FRM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  genInfoChange = (e, result) => {
    this.GEN_INFO_FRM = FormValidator.onChange(
      this.GEN_INFO_FRM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  trustInfoChange = (e, result) => {
    this.TRUST_INFO_FRM = FormValidator.onChange(
      this.TRUST_INFO_FRM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  personalInfoChange = (e, result) => {
    this.PERSONAL_INFO_FRM = FormValidator.onChange(
      this.PERSONAL_INFO_FRM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  formDocChange = (e, result) => {
    this.FORM_DOCS_FRM = FormValidator.onChange(
      this.FORM_DOCS_FRM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  entityInfoDateChange = (date) => {
    this.TRUST_INFO_FRM = FormValidator.onChange(
      this.TRUST_INFO_FRM,
      { name: 'trustDate', value: date },
    );
  }

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  setEntityError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @action
  setIsDirty = (form, status) => {
    this[form].meta.isDirty = status;
  }

  /* eslint-disable class-methods-use-this */
  isValidLinkBank() {
    return ((isEmpty(bankAccountStore.formLinkBankManually.fields.routingNumber.error) &&
    isEmpty(bankAccountStore.formLinkBankManually.fields.accountNumber.error)) ||
    !isEmpty(bankAccountStore.plaidBankDetails));
  }

  @computed
  get isValidEntityFinancialInfo() {
    return isEmpty(this.FIN_INFO_FRM.fields.netAssets.error) &&
    isEmpty(this.FIN_INFO_FRM.fields.cfInvestment.error);
  }

  /**
   * @todo create a generic function to check if form is not having any invalid field.
   */
  @computed
  get isValidEntityGeneralInfo() {
    return isEmpty(this.GEN_INFO_FRM.fields.name.error) &&
    isEmpty(this.GEN_INFO_FRM.fields.taxId.error) &&
    isEmpty(this.GEN_INFO_FRM.fields.street.error) &&
    isEmpty(this.GEN_INFO_FRM.fields.city.error) &&
    isEmpty(this.GEN_INFO_FRM.fields.state.error) &&
    isEmpty(this.GEN_INFO_FRM.fields.zipCode.error);
  }

  @computed
  get isValidEntityInfo() {
    return isEmpty(this.TRUST_INFO_FRM.fields.isTrust.error) &&
    isEmpty(this.TRUST_INFO_FRM.fields.trustDate.error);
  }

  @computed
  get isValidPersonalInfo() {
    return isEmpty(this.PERSONAL_INFO_FRM.fields.title.error) &&
    isEmpty(this.PERSONAL_INFO_FRM.fields.legalDocUrl.error);
  }

  @computed
  get isValidFormationDoc() {
    return isEmpty(this.FORM_DOCS_FRM.fields.formationDoc.error) &&
    isEmpty(this.FORM_DOCS_FRM.fields.operatingAgreementDoc.error) &&
    isEmpty(this.FORM_DOCS_FRM.fields.einVerificationDoc.error);
  }

  @computed
  get isValidEntityForm() {
    return this.FIN_INFO_FRM.meta.isValid && this.GEN_INFO_FRM.meta.isValid
      && this.TRUST_INFO_FRM.meta.isValid &&
      this.PERSONAL_INFO_FRM.meta.isValid && this.FORM_DOCS_FRM.meta.isValid &&
      (bankAccountStore.formLinkBankManually.meta.isValid || bankAccountStore.isValidLinkBank);
  }

  @action
  setAddressFields = (place) => {
    FormValidator.setAddressFields(place, this.GEN_INFO_FRM);
  }

  @action
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false, field = null) => {
    if (formStatus === 'submit') {
      this.setFormStatus('submit');
      this.submitForm(currentStep, formStatus, this.accountAttributes);
    }
    this.validateAndSubmitStep(currentStep, formStatus, removeUploadedData, field);
  }

  @action
  setEntityAttributes = (step, removeUploadedData, field) => {
    switch (step) {
      /* eslint-disable no-unused-expressions */
      case 'General':
        this.entityData.name = this.GEN_INFO_FRM.fields.name.value;
        this.entityData.taxId = this.GEN_INFO_FRM.fields.taxId.value;
        this.entityData.address = {
          street: this.GEN_INFO_FRM.fields.street.value,
          city: this.GEN_INFO_FRM.fields.city.value,
          state: this.GEN_INFO_FRM.fields.state.value,
          zipCode: this.GEN_INFO_FRM.fields.zipCode.value,
        };
        break;

      case 'Entity info':
        this.entityData.isTrust = this.TRUST_INFO_FRM.fields.isTrust.value;
        this.entityData.trustDate = this.TRUST_INFO_FRM.fields.trustDate.value;
        break;

      case 'Personal info':
        if (removeUploadedData) {
          if (this.entityData.legalInfo) {
            this.entityData.legalInfo[field] = {
              fileName: '',
              fileId: '',
            };
          }
        } else {
          this.entityData.legalInfo = {
            legalFirstName: userStore.currentUser.givenName,
            legalLastName: userStore.currentUser.familyName,
            title: this.PERSONAL_INFO_FRM.fields.title.value,
            legalDocUrl: {
              fileId: this.PERSONAL_INFO_FRM.fields.legalDocUrl.fileId,
              fileName: this.PERSONAL_INFO_FRM.fields.legalDocUrl.value,
            },
          };
        }
        break;

      case 'Formation doc':
        if (removeUploadedData) {
          if (this.entityData.legalDocs) {
            this.entityData.legalDocs[field] = {
              fileName: '',
              fileId: '',
            };
          }
        } else {
          this.entityData.legalDocs = {
            formationDoc: {
              fileName: this.FORM_DOCS_FRM.fields.formationDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.formationDoc.fileId,
            },
            operatingAgreementDoc: {
              fileName: this.FORM_DOCS_FRM.fields.operatingAgreementDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.operatingAgreementDoc.fileId,
            },
            einVerificationDoc: {
              fileName: this.FORM_DOCS_FRM.fields.einVerificationDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.einVerificationDoc.fileId,
            },
          };
        }
        break;

      default:
        break;
    }
    return this.entityData;
  }

  @computed
  get accountAttributes() {
    let payload = {};
    if (this.formStatus === 'submit') {
      payload = {
        netAssets: this.FIN_INFO_FRM.fields.netAssets.value,
        cfInvestment: {
          dateOfInvestment: '02281975',
          amount: this.FIN_INFO_FRM.fields.cfInvestment.value,
        },
        entity: {
          name: this.GEN_INFO_FRM.fields.name.value,
          taxId: this.GEN_INFO_FRM.fields.taxId.value,
          isTrust: this.TRUST_INFO_FRM.fields.isTrust.value,
          trustDate: this.TRUST_INFO_FRM.fields.trustDate.value,
          address: {
            street: this.GEN_INFO_FRM.fields.street.value,
            city: this.GEN_INFO_FRM.fields.city.value,
            state: this.GEN_INFO_FRM.fields.state.value,
            zipCode: this.GEN_INFO_FRM.fields.zipCode.value,
          },
          legalInfo: {
            legalFirstName: userStore.currentUser.givenName,
            legalLastName: userStore.currentUser.familyName,
            title: this.PERSONAL_INFO_FRM.fields.title.value,
            legalDocUrl: {
              fileId: this.PERSONAL_INFO_FRM.fields.legalDocUrl.fileId,
              fileName: this.PERSONAL_INFO_FRM.fields.legalDocUrl.value,
            },
          },
          legalDocs: {
            formationDoc: {
              fileName: this.FORM_DOCS_FRM.fields.formationDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.formationDoc.fileId,
            },
            operatingAgreementDoc: {
              fileName: this.FORM_DOCS_FRM.fields.operatingAgreementDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.operatingAgreementDoc.fileId,
            },
            einVerificationDoc: {
              fileName: this.FORM_DOCS_FRM.fields.einVerificationDoc.value,
              fileId: this.FORM_DOCS_FRM.fields.einVerificationDoc.fileId,
            },
          },
        },
      };
      if (!isEmpty(bankAccountStore.plaidBankDetails)) {
        const plaidBankDetails = omit(bankAccountStore.plaidBankDetails, '__typename');
        payload.bankDetails = plaidBankDetails;
      } else {
        const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
        if (accountNumber && routingNumber) {
          const plaidBankDetails = {
            accountNumber: accountNumber.value,
            routingNumber: routingNumber.value,
          };
          payload.bankDetails = plaidBankDetails;
        }
      }
    }

    return payload;
  }

  @action
  validateAndSubmitStep = (currentStep, formStatus, removeUploadedData, field) => {
    let isValidCurrentStep = true;
    const { accountAttributes } = this;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityFinancialInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.netAssets = this.FIN_INFO_FRM.fields.netAssets.value;
          accountAttributes.cfInvestment = {
            dateOfInvestment: '02281975',
            amount: this.FIN_INFO_FRM.fields.cfInvestment.value,
          };
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'General':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityGeneralInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.entity = this.setEntityAttributes(currentStep.name);
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'Entity info':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.entity = this.setEntityAttributes(currentStep.name);
          this.submitForm(currentStep, formStatus, accountAttributes);
        }
        break;
      case 'Personal info':
        if (removeUploadedData) {
          accountAttributes.entity =
            this.setEntityAttributes(currentStep.name, removeUploadedData, field);
          this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData);
        } else {
          currentStep.validate();
          isValidCurrentStep = this.isValidPersonalInfo;
          if (isValidCurrentStep) {
            uiStore.setProgress();
            accountAttributes.entity = this.setEntityAttributes(currentStep.name);
            return new Promise((resolve, reject) => {
              Helper.putUploadedFile([this.PERSONAL_INFO_FRM.fields.legalDocUrl])
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
      case 'Formation doc':
        if (removeUploadedData) {
          accountAttributes.entity =
            this.setEntityAttributes(currentStep.name, removeUploadedData, field);
          this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData);
        } else {
          currentStep.validate();
          isValidCurrentStep = this.isValidFormationDoc;
          if (isValidCurrentStep) {
            uiStore.setProgress();
            accountAttributes.entity =
            this.setEntityAttributes(currentStep.name, removeUploadedData);
            if (!removeUploadedData) {
              return new Promise((resolve, reject) => {
                Helper.putUploadedFile([
                  this.FORM_DOCS_FRM.fields.formationDoc,
                  this.FORM_DOCS_FRM.fields.operatingAgreementDoc,
                  this.FORM_DOCS_FRM.fields.einVerificationDoc,
                ])
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
        }
        break;
      case 'Link bank':
        if (bankAccountStore.bankLinkInterface === 'list') {
          currentStep.validate();
        }
        isValidCurrentStep = this.isValidLinkBank();
        if (isValidCurrentStep) {
          uiStore.setProgress();
          if (!isEmpty(bankAccountStore.plaidBankDetails)) {
            const plaidBankDetails = omit(bankAccountStore.plaidBankDetails, '__typename');
            accountAttributes.bankDetails = plaidBankDetails;
          } else {
            const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
            if (accountNumber && routingNumber) {
              const plaidBankDetails = {
                accountNumber: accountNumber.value,
                routingNumber: routingNumber.value,
              };
              accountAttributes.bankDetails = plaidBankDetails;
            }
          }
          this.submitForm(currentStep, formStatus, accountAttributes);
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
    let variables = {
      userId: userStore.currentUser.sub,
      accountAttributes,
      status: formStatus,
      accountType: 'entity',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(
        userDetailsStore.currentUser.data.user.accounts,
        { accountType: 'entity' },
      );
      if (accountDetails) {
        mutation = updateAccount;
        variables = {
          userId: userStore.currentUser.sub,
          accountId: accountDetails.accountId,
          accountAttributes,
          status: formStatus,
          accountType: 'entity',
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
        accountType: 'entity',
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
            accountStore.setAccountTypeCreated(result.data.createInvestorAccount.accountType);
          } else {
            accountStore.setAccountTypeCreated(result.data.updateInvestorAccount.accountType);
          }
          switch (currentStep.name) {
            case 'Financial info':
              this.setIsDirty('FIN_INFO_FRM', false);
              this.setStepToBeRendered(1);
              break;
            case 'General':
              this.setIsDirty('GEN_INFO_FRM', false);
              this.setStepToBeRendered(2);
              break;
            case 'Entity info':
              this.setIsDirty('TRUST_INFO_FRM', false);
              this.setStepToBeRendered(3);
              break;
            case 'Personal info':
              if (removeUploadedData) {
                validationActions.validateEntityPersonalInfo();
              } else {
                this.setIsDirty('PERSONAL_INFO_FRM', false);
                this.setStepToBeRendered(4);
              }
              break;
            case 'Formation doc':
              if (removeUploadedData) {
                validationActions.validateEntityFormationDoc();
              } else {
                this.setIsDirty('FORM_DOCS_FRM', false);
                this.setStepToBeRendered(5);
              }
              break;
            case 'Link bank':
              this.setStepToBeRendered(6);
              break;
            default:
              break;
          }
          if (formStatus === 'submit') {
            userDetailsStore.getUser(userStore.currentUser.sub);
            Helper.toast('Entity account created successfully.', 'success');
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
      const account = find(
        userData.accounts,
        { accountType: 'entity' },
      );
      if (account) {
        Object.keys(this.FIN_INFO_FRM.fields).map((f) => {
          if (f === 'cfInvestment' && account.accountDetails[f]) {
            this.FIN_INFO_FRM.fields[f].value = account.accountDetails[f].amount;
          } else {
            this.FIN_INFO_FRM.fields[f].value = account.accountDetails[f];
          }
          return this.FIN_INFO_FRM.fields[f];
        });
        FormValidator.onChange(this.FIN_INFO_FRM, '', '', false);

        Object.keys(this.GEN_INFO_FRM.fields).map((f) => {
          if ((f === 'taxId' || f === 'name') && account.accountDetails.entity) {
            this.GEN_INFO_FRM.fields[f].value = account.accountDetails.entity[f];
          } else if (account.accountDetails.entity && account.accountDetails.entity.address) {
            this.GEN_INFO_FRM.fields[f].value = account.accountDetails.entity.address[f];
          }
          return this.GEN_INFO_FRM.fields[f];
        });
        FormValidator.onChange(this.GEN_INFO_FRM, '', '', false);

        if (account.accountDetails.entity && account.accountDetails.entity.address) {
          this.setEntityAttributes('General');
        }
        let isDirty = false;
        Object.keys(this.TRUST_INFO_FRM.fields).map((f) => {
          if (f === 'isTrust') {
            if (account.accountDetails.entity && account.accountDetails.entity[f]) {
              this.TRUST_INFO_FRM.fields[f].value = account.accountDetails.entity[f];
            } else {
              this.TRUST_INFO_FRM.fields[f].value = true;
              isDirty = true;
            }
          } else if (f === 'trustDate' && account.accountDetails.entity && account.accountDetails.entity[f]) {
            this.TRUST_INFO_FRM.fields[f].value = account.accountDetails.entity[f];
          }
          return this.TRUST_INFO_FRM.fields[f];
        });
        FormValidator.onChange(this.TRUST_INFO_FRM, '', '', isDirty);

        if (account.accountDetails.entity && account.accountDetails.entity.isTrust) {
          this.setEntityAttributes('Entity info');
        }
        Object.keys(this.PERSONAL_INFO_FRM.fields).map((f) => {
          if (account.accountDetails.entity && account.accountDetails.entity.legalInfo && f === 'legalDocUrl') {
            const fileName = account.accountDetails.entity.legalInfo[f].fileName === null ? '' : account.accountDetails.entity.legalInfo[f].fileName;
            const fileId = account.accountDetails.entity.legalInfo[f].fileId === null ? '' : account.accountDetails.entity.legalInfo[f].fileId;
            this.PERSONAL_INFO_FRM.fields[f].value = fileName;
            this.PERSONAL_INFO_FRM.fields[f].fileId = fileId;
          } else if (account.accountDetails.entity && account.accountDetails.entity.legalInfo) {
            this.PERSONAL_INFO_FRM.fields[f].value = account.accountDetails.entity.legalInfo[f];
          }
          return this.PERSONAL_INFO_FRM.fields[f];
        });
        FormValidator.onChange(this.PERSONAL_INFO_FRM, '', '', false);

        if (account.accountDetails.entity && account.accountDetails.entity.legalInfo) {
          this.setEntityAttributes('Personal info');
        }
        Object.keys(this.FORM_DOCS_FRM.fields).map((f) => {
          if (account.accountDetails.entity && account.accountDetails.entity.legalDocs) {
            const { entity } = account.accountDetails;
            if (entity.legalDocs[f]) {
              const fileName = entity.legalDocs[f].fileName === null ? '' : entity.legalDocs[f].fileName;
              const fileId = entity.legalDocs[f].fileId === null ? '' : entity.legalDocs[f].fileId;
              this.FORM_DOCS_FRM.fields[f].value = fileName;
              this.FORM_DOCS_FRM.fields[f].fileId = fileId;
            }
          }
          return this.FORM_DOCS_FRM.fields[f];
        });
        FormValidator.onChange(this.FORM_DOCS_FRM, '', '', false);

        if (account.accountDetails.entity && account.accountDetails.entity.legalDocs) {
          this.setEntityAttributes('Formation doc');
        }
        if (account.accountDetails.bankDetails && account.accountDetails.bankDetails.plaidItemId) {
          const { accountNumber, routingNumber } = account.accountDetails.bankDetails;
          bankAccountStore.formLinkBankManually.fields.accountNumber.value = accountNumber;
          bankAccountStore.formLinkBankManually.fields.routingNumber.value = routingNumber;
        } else {
          Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
            const { accountDetails } = account;
            if (accountDetails.bankDetails && accountDetails.bankDetails[f] !== '') {
              bankAccountStore.formLinkBankManually.fields[f].value = accountDetails.bankDetails[f];
              return bankAccountStore.formLinkBankManually.fields[f];
            }
            return null;
          });
          if (account.accountDetails.bankDetails && account.accountDetails.bankDetails.routingNumber !== '' &&
          account.accountDetails.bankDetails.accountNumber !== '') {
            bankAccountStore.linkBankFormChange();
          }
        }
        if (!uiStore.errors) {
          if (!this.FIN_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(0);
          } else if (!this.GEN_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(1);
          } else if (!this.TRUST_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(2);
          } else if (!this.PERSONAL_INFO_FRM.meta.isValid) {
            this.setStepToBeRendered(3);
          } else if (!this.FORM_DOCS_FRM.meta.isValid) {
            this.setStepToBeRendered(4);
          } else if (!bankAccountStore.formLinkBankManually.meta.isValid &&
            isEmpty(bankAccountStore.plaidBankDetails)) {
            this.setStepToBeRendered(5);
          } else {
            this.setStepToBeRendered(6);
          }
        }
      }
    }
  }

  @action
  setFileUploadData(form, field, files) {
    this[form].fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: fileData.fileName },
    );
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            userId: userStore.currentUser.sub,
            stepName: 'EntityDocuments',
            fileData,
          },
        })
        .then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          this[form].fields[field].fileId = fileId;
          this[form].fields[field].preSignedUrl = preSignedUrl;
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

  removeUploadedData = (form, field, step) => {
    const currentStep = { name: step };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: this[form].fields[field].fileId,
          },
        })
        .then(() => {
          this[form] = FormValidator.onChange(
            this[form],
            { name: field, value: '' },
          );
          this[form].fields[field].fileId = '';
          this[form].fields[field].preSignedUrl = '';
          this.createAccount(currentStep, 'draft', true, field);
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

export default new EntityAccountStore();
