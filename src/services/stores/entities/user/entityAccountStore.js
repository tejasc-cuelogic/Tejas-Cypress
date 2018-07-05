import { action, observable, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
} from '../../../../constants/account';
import { GqlClient as client } from '../../../../api/gqlApi';
import { createAccount, updateAccount } from '../../queries/account';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import { accountStore, bankAccountStore, uiStore, userStore, userDetailsStore } from '../../index';
import Helper from '../../../../helper/utility';
import { validationActions } from '../../../actions';

class EntityAccountStore {
  @observable
  formFinInfo = {
    fields: { ...ENTITY_FIN_INFO }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formGeneralInfo = {
    fields: { ...ENTITY_GEN_INFO }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formEntityInfo = {
    fields: { ...ENTITY_TRUST_INFO }, meta: { isValid: true, error: '', isDirty: true },
  };

  @observable
  formPersonalInfo = {
    fields: { ...ENTITY_PERSONAL_INFO }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formFormationDocuments = {
    fields: { ...ENTITY_FORMATION_DOCS }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  investorAccId = '';

  @observable
  stepToBeRendered = 0;

  @observable
  formStatus = 'draft';

  @observable
  entityData = {};

  @action
  setFormStatus(formStatus) {
    this.formStatus = formStatus;
  }

  @action
  setInvestorAccId(id) {
    this.investorAccId = id;
  }

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  finInfoChange = (e, { name, value }) => {
    this.onFieldChange('formFinInfo', name, value);
  };

  @action
  personalInfoChange = (e, { name, value }) => {
    this.onFieldChange('formPersonalInfo', name, value);
  };

  @action
  personalInfoFileUpload = (field, files) => {
    if (files.length) {
      const uploadFile = files[0];
      this.onFieldChange('formPersonalInfo', field, uploadFile.name);
    }
  };

  @action
  personalInfoResetField = (field) => {
    this.onFieldChange('formPersonalInfo', field, '');
  };

  @action
  formationDocFileUpload = (field, files) => {
    if (files.length) {
      const uploadFile = files[0];
      this.onFieldChange('formFormationDocuments', field, uploadFile.name);
    }
  };

  @action
  formationDocResetField = (field) => {
    this.onFieldChange('formFormationDocuments', field, '');
  };

  @action
  genInfoChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('formGeneralInfo', fieldName, fieldValue);
  };

  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.onFieldChange('formGeneralInfo', 'street', data.residentalStreet);
    this.onFieldChange('formGeneralInfo', 'city', data.city);
    this.onFieldChange('formGeneralInfo', 'state', data.state);
    this.onFieldChange('formGeneralInfo', 'zipCode', data.zipCode);
  }

  @action
  entityInfoChange = (e, { name, value }) => {
    this.onFieldChange('formEntityInfo', name, value);
  };

  @action
  entityInfoDateChange = (date) => {
    this.onFieldChange('formEntityInfo', 'trustDate', date);
  }

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
  setIsDirty = (form, status) => {
    this[form].meta.isDirty = status;
  }

  @action
  setEntityError = (form, key, error) => {
    this[form].fields[key].error = error;
  }

  @computed
  get isValidEntityFinancialInfo() {
    return _.isEmpty(this.formFinInfo.fields.netAssets.error) &&
    _.isEmpty(this.formFinInfo.fields.cfInvestment.error);
  }

  @computed
  get isValidEntityGeneralInfo() {
    return _.isEmpty(this.formGeneralInfo.fields.name.error) &&
    _.isEmpty(this.formGeneralInfo.fields.taxId.error) &&
    _.isEmpty(this.formGeneralInfo.fields.street.error) &&
    _.isEmpty(this.formGeneralInfo.fields.city.error) &&
    _.isEmpty(this.formGeneralInfo.fields.state.error) &&
    _.isEmpty(this.formGeneralInfo.fields.zipCode.error);
  }

  @computed
  get isValidEntityInfo() {
    return _.isEmpty(this.formEntityInfo.fields.isTrust.error) &&
    _.isEmpty(this.formEntityInfo.fields.trustDate.error);
  }

  @computed
  get isValidPersonalInfo() {
    return _.isEmpty(this.formPersonalInfo.fields.title.error) &&
    _.isEmpty(this.formPersonalInfo.fields.legalDocUrl.error);
  }

  @computed
  get isValidFormationDoc() {
    return _.isEmpty(this.formFormationDocuments.fields.formationDoc.error) &&
    _.isEmpty(this.formFormationDocuments.fields.operatingAgreementDoc.error) &&
    _.isEmpty(this.formFormationDocuments.fields.einVerificationDoc.error);
  }

  /* eslint-disable class-methods-use-this */
  isValidLinkBank() {
    return ((_.isEmpty(bankAccountStore.formLinkBankManually.fields.routingNumber.error) &&
   _.isEmpty(bankAccountStore.formLinkBankManually.fields.accountNumber.error)) ||
   !_.isEmpty(bankAccountStore.plaidBankDetails));
  }

  @computed
  get isValidEntityForm() {
    return this.formFinInfo.meta.isValid && this.formGeneralInfo.meta.isValid
      && this.formEntityInfo.meta.isValid &&
      this.formPersonalInfo.meta.isValid && this.formFormationDocuments.meta.isValid &&
      (bankAccountStore.formLinkBankManually.meta.isValid || bankAccountStore.isValidLinkBank);
  }

  @computed
  get accountAttributes() {
    let payload = {};
    if (this.formStatus === 'submit') {
      payload = {
        netAssets: this.formFinInfo.fields.netAssets.value,
        cfInvestment: {
          dateOfInvestment: '02281975',
          amount: this.formFinInfo.fields.cfInvestment.value,
        },
        entity: {
          name: this.formGeneralInfo.fields.name.value,
          taxId: this.formGeneralInfo.fields.taxId.value,
          isTrust: this.formEntityInfo.fields.isTrust.value,
          trustDate: this.formEntityInfo.fields.trustDate.value,
          address: {
            street: this.formGeneralInfo.fields.street.value,
            city: this.formGeneralInfo.fields.city.value,
            state: this.formGeneralInfo.fields.state.value,
            zipCode: this.formGeneralInfo.fields.zipCode.value,
          },
          legalInfo: {
            legalFirstName: userStore.currentUser.givenName,
            legalLastName: userStore.currentUser.familyName,
            title: this.formPersonalInfo.fields.title.value,
            legalDocUrl: {
              fileId: this.formPersonalInfo.fields.legalDocUrl.fileId,
              fileName: this.formPersonalInfo.fields.legalDocUrl.value,
            },
          },
          legalDocs: {
            formationDoc: {
              fileName: this.formFormationDocuments.fields.formationDoc.value,
              fileId: this.formFormationDocuments.fields.formationDoc.fileId,
            },
            operatingAgreementDoc: {
              fileName: this.formFormationDocuments.fields.operatingAgreementDoc.value,
              fileId: this.formFormationDocuments.fields.operatingAgreementDoc.fileId,
            },
            einVerificationDoc: {
              fileName: this.formFormationDocuments.fields.einVerificationDoc.value,
              fileId: this.formFormationDocuments.fields.einVerificationDoc.fileId,
            },
          },
        },
      };
      if (!_.isEmpty(bankAccountStore.plaidBankDetails)) {
        const plaidBankDetails = _.omit(bankAccountStore.plaidBankDetails, '__typename');
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
  setEntityAttributes = (step, removeUploadedData, field) => {
    switch (step) {
      /* eslint-disable no-unused-expressions */
      case 'General':
        this.entityData.name = this.formGeneralInfo.fields.name.value;
        this.entityData.taxId = this.formGeneralInfo.fields.taxId.value;
        this.entityData.address = {
          street: this.formGeneralInfo.fields.street.value,
          city: this.formGeneralInfo.fields.city.value,
          state: this.formGeneralInfo.fields.state.value,
          zipCode: this.formGeneralInfo.fields.zipCode.value,
        };
        break;

      case 'Entity info':
        this.entityData.isTrust = this.formEntityInfo.fields.isTrust.value;
        this.entityData.trustDate = this.formEntityInfo.fields.trustDate.value;
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
            title: this.formPersonalInfo.fields.title.value,
            legalDocUrl: {
              fileId: this.formPersonalInfo.fields.legalDocUrl.fileId,
              fileName: this.formPersonalInfo.fields.legalDocUrl.value,
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
              fileName: this.formFormationDocuments.fields.formationDoc.value,
              fileId: this.formFormationDocuments.fields.formationDoc.fileId,
            },
            operatingAgreementDoc: {
              fileName: this.formFormationDocuments.fields.operatingAgreementDoc.value,
              fileId: this.formFormationDocuments.fields.operatingAgreementDoc.fileId,
            },
            einVerificationDoc: {
              fileName: this.formFormationDocuments.fields.einVerificationDoc.value,
              fileId: this.formFormationDocuments.fields.einVerificationDoc.fileId,
            },
          };
        }
        break;

      default:
        break;
    }
    return this.entityData;
  }

  /* eslint-disable consistent-return */
  /* eslint-disable arrow-body-style */
  @action
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false, field = null) => {
    if (formStatus === 'submit') {
      this.setFormStatus('submit');
      this.submitForm(currentStep, formStatus, this.accountAttributes);
    }
    let isValidCurrentStep = true;
    const { accountAttributes } = this;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityFinancialInfo;
        if (isValidCurrentStep) {
          uiStore.setProgress();
          accountAttributes.netAssets = this.formFinInfo.fields.netAssets.value;
          accountAttributes.cfInvestment = {
            dateOfInvestment: '02281975',
            amount: this.formFinInfo.fields.cfInvestment.value,
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
              Helper.putUploadedFile([this.formPersonalInfo.fields.legalDocUrl])
                .then(() => {
                  this.submitForm(currentStep, formStatus, accountAttributes);
                })
                .catch((err) => {
                  uiStore.setProgress(false);
                  uiStore.setErrors(this.simpleErr(err));
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
                  this.formFormationDocuments.fields.formationDoc,
                  this.formFormationDocuments.fields.operatingAgreementDoc,
                  this.formFormationDocuments.fields.einVerificationDoc,
                ])
                  .then(() => {
                    this.submitForm(currentStep, formStatus, accountAttributes);
                  })
                  .catch((err) => {
                    uiStore.setProgress(false);
                    uiStore.setErrors(this.simpleErr(err));
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
          if (!_.isEmpty(bankAccountStore.plaidBankDetails)) {
            const plaidBankDetails = _.omit(bankAccountStore.plaidBankDetails, '__typename');
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
      const accountDetails = _.find(
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
            this.setInvestorAccId(result.data.createInvestorAccount.accountId);
            accountStore.setAccountTypeCreated(result.data.createInvestorAccount.accountType);
          } else {
            accountStore.setAccountTypeCreated(result.data.updateInvestorAccount.accountType);
          }
          switch (currentStep.name) {
            case 'Financial info':
              this.setIsDirty('formFinInfo', false);
              this.setStepToBeRendered(1);
              break;
            case 'General':
              this.setIsDirty('formGeneralInfo', false);
              this.setStepToBeRendered(2);
              break;
            case 'Entity info':
              this.setIsDirty('formEntityInfo', false);
              this.setStepToBeRendered(3);
              break;
            case 'Personal info':
              if (removeUploadedData) {
                validationActions.validateEntityPersonalInfo();
              } else {
                this.setIsDirty('formPersonalInfo', false);
                this.setStepToBeRendered(4);
              }
              break;
            case 'Formation doc':
              if (removeUploadedData) {
                validationActions.validateEntityFormationDoc();
              } else {
                this.setIsDirty('formFormationDocuments', false);
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
            uiStore.setDashboardWizardStep();
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

  @action
  populateData = (userData) => {
    if (!_.isEmpty(userData)) {
      const account = _.find(
        userData.accounts,
        { accountType: 'entity' },
      );
      if (account) {
        Object.keys(this.formFinInfo.fields).map((f) => {
          if (f === 'cfInvestment' && account.accountDetails[f]) {
            this.formFinInfo.fields[f].value = account.accountDetails[f].amount;
          } else {
            this.formFinInfo.fields[f].value = account.accountDetails[f];
          }
          return this.formFinInfo.fields[f];
        });
        this.onFieldChange('formFinInfo', undefined, undefined, false);
        Object.keys(this.formGeneralInfo.fields).map((f) => {
          if ((f === 'taxId' || f === 'name') && account.accountDetails.entity) {
            this.formGeneralInfo.fields[f].value = account.accountDetails.entity[f];
          } else if (account.accountDetails.entity && account.accountDetails.entity.address) {
            this.formGeneralInfo.fields[f].value = account.accountDetails.entity.address[f];
          }
          return this.formGeneralInfo.fields[f];
        });
        this.onFieldChange('formGeneralInfo', undefined, undefined, false);
        if (account.accountDetails.entity && account.accountDetails.entity.address) {
          this.setEntityAttributes('General');
        }
        let isDirty = false;
        Object.keys(this.formEntityInfo.fields).map((f) => {
          if (f === 'isTrust') {
            if (account.accountDetails.entity && account.accountDetails.entity[f]) {
              this.formEntityInfo.fields[f].value = account.accountDetails.entity[f];
            } else {
              this.formEntityInfo.fields[f].value = true;
              isDirty = true;
            }
          } else if (f === 'trustDate' && account.accountDetails.entity && account.accountDetails.entity[f]) {
            this.formEntityInfo.fields[f].value = account.accountDetails.entity[f];
          }
          return this.formEntityInfo.fields[f];
        });
        this.onFieldChange('formEntityInfo', undefined, undefined, isDirty);
        if (account.accountDetails.entity && account.accountDetails.entity.isTrust) {
          this.setEntityAttributes('Entity info');
        }
        Object.keys(this.formPersonalInfo.fields).map((f) => {
          if (account.accountDetails.entity && account.accountDetails.entity.legalInfo && f === 'legalDocUrl') {
            const fileName = account.accountDetails.entity.legalInfo[f].fileName === null ? '' : account.accountDetails.entity.legalInfo[f].fileName;
            const fileId = account.accountDetails.entity.legalInfo[f].fileId === null ? '' : account.accountDetails.entity.legalInfo[f].fileId;
            this.formPersonalInfo.fields[f].value = fileName;
            this.formPersonalInfo.fields[f].fileId = fileId;
          } else if (account.accountDetails.entity && account.accountDetails.entity.legalInfo) {
            this.formPersonalInfo.fields[f].value = account.accountDetails.entity.legalInfo[f];
          }
          return this.formPersonalInfo.fields[f];
        });
        this.onFieldChange('formPersonalInfo', undefined, undefined, false);
        if (account.accountDetails.entity && account.accountDetails.entity.legalInfo) {
          this.setEntityAttributes('Personal info');
        }
        Object.keys(this.formFormationDocuments.fields).map((f) => {
          if (account.accountDetails.entity && account.accountDetails.entity.legalDocs) {
            const { entity } = account.accountDetails;
            if (entity.legalDocs[f]) {
              const fileName = entity.legalDocs[f].fileName === null ? '' : entity.legalDocs[f].fileName;
              const fileId = entity.legalDocs[f].fileId === null ? '' : entity.legalDocs[f].fileId;
              this.formFormationDocuments.fields[f].value = fileName;
              this.formFormationDocuments.fields[f].fileId = fileId;
            }
          }
          return this.formFormationDocuments.fields[f];
        });
        this.onFieldChange('formFormationDocuments', undefined, undefined, false);
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
            bankAccountStore.onFieldChange('formLinkBankManually');
          }
        }
        if (!uiStore.errors) {
          if (!this.formFinInfo.meta.isValid) {
            this.setStepToBeRendered(0);
          } else if (!this.formGeneralInfo.meta.isValid) {
            this.setStepToBeRendered(1);
          } else if (!this.formEntityInfo.meta.isValid) {
            this.setStepToBeRendered(2);
          } else if (!this.formPersonalInfo.meta.isValid) {
            this.setStepToBeRendered(3);
          } else if (!this.formFormationDocuments.meta.isValid) {
            this.setStepToBeRendered(4);
          } else if (!bankAccountStore.formLinkBankManually.meta.isValid &&
            _.isEmpty(bankAccountStore.plaidBankDetails)) {
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
    this.onFieldChange(form, field, fileData.fileName);
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
          uiStore.setErrors(this.simpleErr(err));
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
          this.onFieldChange(form, field, '');
          this[form].fields[field].fileId = '';
          this[form].fields[field].preSignedUrl = '';
          this.createAccount(currentStep, 'draft', true, field);
          resolve();
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

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}

export default new EntityAccountStore();
