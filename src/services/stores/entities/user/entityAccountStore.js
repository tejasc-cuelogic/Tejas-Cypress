import { observable, action, computed } from 'mobx';
import { isEmpty, find } from 'lodash';
import graphql from 'mobx-apollo';
import React from 'react';
import moment from 'moment';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
} from '../../../../constants/account';
import { bankAccountStore, userDetailsStore, userStore, uiStore, investmentLimitStore } from '../../index';
import { createIndividual, updateAccount, checkEntityTaxIdCollision } from '../../queries/account';
import { FormValidator, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { validationActions, fileUpload } from '../../../actions';
import Helper from '../../../../helper/utility';
import { NS_SITE_EMAIL_SUPPORT } from '../../../../constants/common';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';

class EntityAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_FIN_INFO);
  @observable GEN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_GEN_INFO);
  @observable TRUST_INFO_FRM = FormValidator.prepareFormObject(ENTITY_TRUST_INFO);
  @observable PERSONAL_INFO_FRM = FormValidator.prepareFormObject(ENTITY_PERSONAL_INFO);
  @observable FORM_DOCS_FRM = FormValidator.prepareFormObject(ENTITY_FORMATION_DOCS);
  @observable entityData = {};
  @observable stepToBeRendered = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  maskedFinInfoChange = (values, field) => {
    this.FIN_INFO_FRM.fields.investmentLimit.value =
    investmentLimitStore.getInvestmentLimit({
      annualIncome: this.FIN_INFO_FRM.fields.cfInvestment.value,
      netWorth: this.FIN_INFO_FRM.fields.netAssets.value,
    });
    this.FIN_INFO_FRM = FormValidator.onChange(
      this.FIN_INFO_FRM,
      { name: field, value: values.floatValue },
    );
  }

  @action
  maskedGenInfoChange = (values, field) => {
    this.GEN_INFO_FRM = FormValidator.onChange(
      this.GEN_INFO_FRM,
      { name: field, value: values.floatValue },
    );
  }

  @action
  genInfoChange = (e, result) => {
    this.formChange(e, result, 'GEN_INFO_FRM');
  }

  @action
  trustInfoChange = (e, result) => {
    this.formChange(e, result, 'TRUST_INFO_FRM');
  }

  @action
  personalInfoChange = (e, result) => {
    this.formChange(e, result, 'PERSONAL_INFO_FRM');
  }

  @action
  formDocChange = (e, result) => {
    this.formChange(e, result, 'FORM_DOCS_FRM');
  }

  @action
  entityInfoDateChange = (date) => {
    this.TRUST_INFO_FRM = FormValidator.onChange(
      this.TRUST_INFO_FRM,
      { name: 'trustDate', value: date },
    );
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
  createAccount = (currentStep, formStatus = 'draft', removeUploadedData = false, field = null) => new Promise((resolve) => {
    if (formStatus === 'submit') {
      this.submitForm(currentStep, formStatus, this.accountAttributes).then(() => {
        resolve();
      });
    } else {
      this.validateAndSubmitStep(currentStep, formStatus, removeUploadedData, field).then(() => {
        resolve();
      });
    }
  })

  @action
  setEntityAttributes = (step, removeUploadedData, field) => {
    switch (step) {
      case 'General':
        this.entityData.name = this.GEN_INFO_FRM.fields.name.value;
        this.entityData.taxId = this.GEN_INFO_FRM.fields.taxId.value;
        this.entityData.address = {
          street: this.GEN_INFO_FRM.fields.street.value,
          city: this.GEN_INFO_FRM.fields.city.value,
          state: this.GEN_INFO_FRM.fields.state.value,
          zipCode: this.GEN_INFO_FRM.fields.zipCode.value,
        };
        this.entityData.entityType = this.GEN_INFO_FRM.fields.entityType.value;
        break;

      case 'Trust Status':
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
    /* eslint-disable camelcase */
    let payload = {};
    payload = {
      limits: {
        netWorth: this.FIN_INFO_FRM.fields.netAssets.value,
        otherContributions: this.FIN_INFO_FRM.fields.cfInvestment.value,
      },
      name: this.GEN_INFO_FRM.fields.name.value,
      taxId: this.GEN_INFO_FRM.fields.taxId.value,
      isTrust: this.TRUST_INFO_FRM.fields.isTrust.value,
      trustDate: this.TRUST_INFO_FRM.fields.trustDate.value,
      entityType: this.GEN_INFO_FRM.fields.entityType.value,
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
    };
    if (!isEmpty(bankAccountStore.plaidAccDetails)) {
      const plaidBankDetails = {};
      const {
        account_id,
        public_token,
        accountNumber,
        routingNumber,
      } = bankAccountStore.plaidAccDetails;
      if (account_id && public_token) {
        plaidBankDetails.plaidPublicToken = public_token;
        plaidBankDetails.plaidAccountId = account_id;
      } else {
        plaidBankDetails.accountNumber = accountNumber;
        plaidBankDetails.routingNumber = routingNumber;
      }
      payload.linkedBank = plaidBankDetails;
    } else {
      const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
      if (accountNumber && routingNumber) {
        const plaidBankDetails = {
          accountNumber: accountNumber.value,
          routingNumber: routingNumber.value,
        };
        payload.linkedBank = plaidBankDetails;
      }
    }

    const isValidAddFunds = bankAccountStore.formAddFunds.meta.isFieldValid;
    if (isValidAddFunds) {
      payload.initialDepositAmount = bankAccountStore.formAddFunds.fields.value.value;
    }

    return payload;
  }

  @action
  checkTaxIdCollision = () => new Promise(async (resolve) => {
    graphql({
      client,
      query: checkEntityTaxIdCollision,
      variables: {
        taxId: this.GEN_INFO_FRM.fields.taxId.value,
      },
      fetchPolicy: 'network-only',
      onFetch: (fData) => {
        if (fData) {
          if (fData.checkEntityTaxIdCollision.alreadyExists) {
            const setErrorMessage = (
              <span>
                There was an issue with the information you submitted.
                Please double-check and try again. If you have any questions please contact <a target="_blank" rel="noopener noreferrer" href={`mailto:${NS_SITE_EMAIL_SUPPORT}`}>{ NS_SITE_EMAIL_SUPPORT }</a>
              </span>
            );
            uiStore.setErrors(setErrorMessage);
          }
          resolve(fData.checkEntityTaxIdCollision.alreadyExists);
        }
      },
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

  @action
  validateAndSubmitStep =
  (currentStep, formStatus, removeUploadedData, field) => new Promise((res, rej) => {
    let isValidCurrentStep = true;
    let accountAttributes = {};
    const array1 = ['Financial info', 'General', 'Trust Status'];
    const array2 = ['Personal info', 'Formation doc'];
    if (array1.includes(currentStep.name)) {
      currentStep.validate();
      isValidCurrentStep = this[currentStep.form].meta.isValid;
      if (isValidCurrentStep) {
        if (currentStep.name === 'Financial info') {
          const limitsValues = {
            netWorth: this.FIN_INFO_FRM.fields.netAssets.value,
            otherContributions: this.FIN_INFO_FRM.fields.cfInvestment.value,
          };
          accountAttributes.limits = limitsValues;
        } else if (currentStep.name === 'General' || currentStep.name === 'Trust Status') {
          accountAttributes = this.setEntityAttributes(currentStep.name);
        }
        if (currentStep.name === 'General') {
          this.checkTaxIdCollision().then((alreadyExists) => {
            if (alreadyExists) {
              rej();
            } else {
              uiStore.setErrors(null);
              this.submitForm(currentStep, formStatus, accountAttributes)
                .then(() => res()).catch(() => rej());
            }
          });
        } else {
          this.submitForm(currentStep, formStatus, accountAttributes)
            .then(() => res()).catch(() => rej());
        }
      } else {
        rej();
      }
    } else if (array2.includes(currentStep.name)) {
      if (removeUploadedData) {
        accountAttributes =
        this.setEntityAttributes(currentStep.name, removeUploadedData, field);
        this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData)
          .then(() => res()).catch(() => rej());
      } else {
        currentStep.validate();
        isValidCurrentStep = this[currentStep.form].meta.isValid;
        if (isValidCurrentStep) {
          accountAttributes = this.setEntityAttributes(currentStep.name);
          this.submitForm(currentStep, formStatus, accountAttributes)
            .then(() => res()).catch(() => rej());
        } else {
          rej();
        }
      }
    } else if (currentStep.name === 'Link bank') {
      bankAccountStore.validateAddFunds();
      if (bankAccountStore.bankLinkInterface === 'list') {
        currentStep.validate();
      }
      const isValidAddFunds = bankAccountStore.formAddFunds.meta.isFieldValid;
      isValidCurrentStep = bankAccountStore.formLinkBankManually.meta.isValid ||
        bankAccountStore.isValidLinkBank;
      if (isValidCurrentStep && isValidAddFunds) {
        uiStore.setProgress();
        if (bankAccountStore.plaidAccDetails && !isEmpty(bankAccountStore.plaidAccDetails)) {
          const plaidBankDetails = {};
          plaidBankDetails.plaidPublicToken = bankAccountStore.plaidAccDetails.public_token;
          plaidBankDetails.plaidAccountId = bankAccountStore.plaidAccDetails.account_id;
          accountAttributes.linkedBank = plaidBankDetails;
        } else {
          const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
          if (accountNumber && routingNumber) {
            const plaidBankDetails = {
              accountNumber: accountNumber.value,
              routingNumber: routingNumber.value,
            };
            accountAttributes.linkedBank = plaidBankDetails;
          }
        }
        accountAttributes.initialDepositAmount = bankAccountStore.formAddFunds.fields.value.value;
        this.submitForm(currentStep, formStatus, accountAttributes)
          .then(() => res()).catch(() => rej());
      } else {
        rej();
      }
    }
    return true;
  })

  @action
  submitForm = (currentStep, formStatus, accountAttributes, removeUploadedData = false) => {
    uiStore.setProgress();
    let mutation = createIndividual;
    const variables = {
      userId: userStore.currentUser.sub,
      accountAttributes,
      status: formStatus,
      accountType: 'ENTITY',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'entity' });
      if (accountDetails) {
        mutation = updateAccount;
        variables.accountId = accountDetails.details.accountId;
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
          if (result.data.updateInvestorAccount && currentStep.name === 'Link bank') {
            const { linkedBank } = result.data.updateInvestorAccount;
            bankAccountStore.setPlaidAccDetails(linkedBank);
          }
          if (formStatus !== 'submit') {
            if (currentStep.name === 'Personal info' || currentStep.name === 'Formation doc') {
              if (removeUploadedData) {
                if (currentStep.name === 'Personal info') {
                  validationActions.validateEntityPersonalInfo();
                } else {
                  validationActions.validateEntityFormationDoc();
                }
              } else {
                FormValidator.setIsDirty(this[currentStep.form], false);
                this.setStepToBeRendered(currentStep.stepToBeRendered);
              }
            } else {
              if (currentStep.name !== 'Link bank') {
                FormValidator.setIsDirty(this[currentStep.form], false);
              }
              this.setStepToBeRendered(currentStep.stepToBeRendered);
            }
          }
          if (formStatus === 'submit') {
            Helper.toast('Entity account created successfully.', 'success');
          } else {
            Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
          }
          uiStore.setErrors(null);
          resolve(result);
        }))
        .catch((err) => {
          if (currentStep.name === 'Link bank') {
            bankAccountStore.resetShowAddFunds();
          }
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setFormData = (form, accountDetails) => {
    let isDirty = false;
    Object.keys(this[form].fields).map((f) => {
      if (form === 'FIN_INFO_FRM') {
        if (f === 'cfInvestment' && accountDetails.limits && accountDetails.limits.otherContributions) {
          this.FIN_INFO_FRM.fields[f].value = accountDetails.limits.otherContributions;
        } else if (accountDetails.limits && accountDetails.limits.netWorth && f !== 'investmentLimit') {
          this.FIN_INFO_FRM.fields[f].value = accountDetails.limits.netWorth;
        }
      } else if (form === 'GEN_INFO_FRM') {
        if ((f === 'taxId' || f === 'name' || f === 'entityType') && accountDetails && accountDetails[f]) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails[f];
        } else if (accountDetails && accountDetails.address) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails.address[f];
        }
      } else if (form === 'TRUST_INFO_FRM') {
        if (f === 'isTrust') {
          if (accountDetails && accountDetails[f]) {
            this.TRUST_INFO_FRM.fields[f].value = accountDetails[f];
          } else {
            this.TRUST_INFO_FRM.fields[f].value = false;
            if (accountDetails && typeof accountDetails[f] === 'undefined') {
              isDirty = true;
            }
          }
        } else if (f === 'trustDate' && accountDetails && accountDetails[f]) {
          this.TRUST_INFO_FRM.fields[f].value = accountDetails[f];
        }
      } else if (form === 'PERSONAL_INFO_FRM') {
        if (accountDetails && accountDetails.legalInfo && f === 'legalDocUrl') {
          const fileName = accountDetails.legalInfo[f].fileName === null ? '' : accountDetails.legalInfo[f].fileName;
          const fileId = accountDetails.legalInfo[f].fileId === null ? '' : accountDetails.legalInfo[f].fileId;
          this.PERSONAL_INFO_FRM.fields[f].value = fileName;
          this.PERSONAL_INFO_FRM.fields[f].fileId = fileId;
        } else if (accountDetails && accountDetails.legalInfo) {
          this.PERSONAL_INFO_FRM.fields[f].value = accountDetails.legalInfo[f];
        }
      } else if (form === 'FORM_DOCS_FRM') {
        if (accountDetails && accountDetails.legalDocs) {
          const { legalDocs } = accountDetails;
          if (legalDocs[f]) {
            const fileName = legalDocs[f].fileName === null ? '' : legalDocs[f].fileName;
            const fileId = legalDocs[f].fileId === null ? '' : legalDocs[f].fileId;
            this.FORM_DOCS_FRM.fields[f].value = fileName;
            this.FORM_DOCS_FRM.fields[f].fileId = fileId;
          }
        }
      }
      return this[form].fields[f];
    });
    FormValidator.onChange(this[form], '', '', isDirty);
  }

  @action
  populateData = (userData) => {
    if (!isEmpty(userData)) {
      const account = find(userData.roles, { name: 'entity' });
      if (account) {
        this.setFormData('FIN_INFO_FRM', account.details);
        this.setFormData('GEN_INFO_FRM', account.details);
        if (account.details && account.details.address) {
          this.setEntityAttributes('General');
        }
        this.setFormData('TRUST_INFO_FRM', account.details);
        if (account.details && account.details.isTrust) {
          this.setEntityAttributes('Trust Status');
        }
        this.setFormData('PERSONAL_INFO_FRM', account.details);
        if (account.details && account.details.legalInfo) {
          this.setEntityAttributes('Personal info');
        }
        this.setFormData('FORM_DOCS_FRM', account.details);

        if (account.details && account.details.legalDocs) {
          this.setEntityAttributes('Formation doc');
        }
        if (account.details.linkedBank &&
          account.details.linkedBank.plaidItemId) {
          bankAccountStore.setPlaidAccDetails(account.details.linkedBank);
          bankAccountStore.formAddFunds.fields.value.value = account.details.initialDepositAmount;
        } else {
          Object.keys(bankAccountStore.formLinkBankManually.fields).map((f) => {
            const { details } = account;
            if (details.linkedBank && details.linkedBank[f] !== '') {
              bankAccountStore.formLinkBankManually.fields[f].value = details.linkedBank[f];
              return bankAccountStore.formLinkBankManually.fields[f];
            }
            return null;
          });
          if (account.details.linkedBank && account.details.linkedBank.routingNumber !== '' &&
          account.details.linkedBank.accountNumber !== '') {
            bankAccountStore.linkBankFormChange();
          }
          bankAccountStore.formAddFunds.fields.value.value = account.details.initialDepositAmount;
        }
        this.renderAfterPopulate();
      }
    }
  }

  renderAfterPopulate = () => {
    const getEntityStep = AccCreationHelper.entitySteps();
    if (!this.FIN_INFO_FRM.meta.isValid) {
      this.setStepToBeRendered(getEntityStep.FIN_INFO_FRM);
    } else if (!this.GEN_INFO_FRM.meta.isValid) {
      this.setStepToBeRendered(getEntityStep.GEN_INFO_FRM);
    } else if (!this.TRUST_INFO_FRM.meta.isValid) {
      this.setStepToBeRendered(getEntityStep.TRUST_INFO_FRM);
    } else if (!this.PERSONAL_INFO_FRM.meta.isValid) {
      this.setStepToBeRendered(getEntityStep.PERSONAL_INFO_FRM);
    } else if (!this.FORM_DOCS_FRM.meta.isValid) {
      this.setStepToBeRendered(getEntityStep.FORM_DOCS_FRM);
    } else if (!bankAccountStore.formLinkBankManually.meta.isValid &&
      isEmpty(bankAccountStore.plaidAccDetails)) {
      this.setStepToBeRendered(getEntityStep.formLinkBankManually);
    } else {
      this.setStepToBeRendered(getEntityStep.summary);
    }
  }

  @action
  setFileUploadData = (form, field, files) => {
    uiStore.setProgress();
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, 'ACCOUNT_ENTITY_CREATION', 'INVESTOR').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this[form].fields[field].fileId = fileId;
      this[form].fields[field].preSignedUrl = preSignedUrl;
      this[form].fields[field].fileData = file;
      this[form] = FormValidator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
      uiStore.setProgress();
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file })
        .then(() => { })
        .catch((err) => {
          uiStore.setProgress(false);
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
        });
    }));
  }

  @action
  removeUploadedData = (form, field, step) => {
    const currentStep = { name: step };
    const { fileId } = this[form].fields[field];
    fileUpload.removeUploadedData(fileId).then(action(() => {
      this[form] = FormValidator.onChange(
        this[form],
        { name: field, value: '' },
      );
      this[form].fields[field].fileId = '';
      this[form].fields[field].preSignedUrl = '';
      this.createAccount(currentStep, 'draft', true, field);
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
    this.resetFormData('GEN_INFO_FRM');
    this.resetFormData('PERSONAL_INFO_FRM');
    this.resetFormData('FORM_DOCS_FRM');
    this.TRUST_INFO_FRM.fields.isTrust.value = true;
    this.TRUST_INFO_FRM.fields.isTrust.error = undefined;
    this.TRUST_INFO_FRM.fields.trustDate.value = moment(`${new Date().getFullYear()}-01-01`).format('MM/DD/YYYY');
    this.TRUST_INFO_FRM.fields.trustDate.error = undefined;
    this.TRUST_INFO_FRM.meta.isValid = false;
    this.TRUST_INFO_FRM.meta.error = '';
    this.entityData = {};
    this.stepToBeRendered = '';
  };
}

export default new EntityAccountStore();
