import { observable, action, computed } from 'mobx';
import { isEmpty, find } from 'lodash';
import graphql from 'mobx-apollo';
import React from 'react';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
} from '../../../../constants/account';
import { bankAccountStore, userDetailsStore, userStore, uiStore } from '../../index';
import { createAccount, updateAccount, checkEntityTaxIdCollision } from '../../queries/account';
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
      const plaidBankDetails = {};
      plaidBankDetails.accountNumber = bankAccountStore.plaidBankDetails.accountNumber;
      plaidBankDetails.bankName = bankAccountStore.plaidBankDetails.bankName;
      plaidBankDetails.plaidPublicToken = bankAccountStore.plaidBankDetails.plaidAccessToken;
      plaidBankDetails.plaidAccountId = bankAccountStore.plaidBankDetails.plaidAccountId;
      plaidBankDetails.plaidItemId = bankAccountStore.plaidBankDetails.plaidItemId;
      plaidBankDetails.routingNumber = bankAccountStore.plaidBankDetails.routingNumber;
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

    return payload;
  }

  @action
  checkTaxIdCollision = async () => {
    try {
      const data = await graphql({
        client,
        query: checkEntityTaxIdCollision,
        variables: {
          taxId: this.GEN_INFO_FRM.fields.taxId.value,
        },
        fetchPolicy: 'network-only',
        onFetch: (fData) => {
          if (fData && fData.checkEntityTaxIdCollision.alreadyExists) {
            const setErrorMessage = (
              <span>
                There was an issue with the information you submitted.
                Please double-check and try again.
                If you have any questions please contact <a target="_blank" rel="noopener noreferrer" href={`mailto:${NS_SITE_EMAIL_SUPPORT}`}>{ NS_SITE_EMAIL_SUPPORT }</a>
              </span>
            );
            uiStore.setErrors(setErrorMessage);
          }
        },
        onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
      });
      return data && data.data.checkEntityTaxIdCollision.alreadyExists;
    } catch (err) {
      return false;
    }
  };

  @action
  validateAndSubmitStep =
  (currentStep, formStatus, removeUploadedData, field) => new Promise(async (res, rej) => {
    let isValidCurrentStep = true;
    const accountAttributes = {};
    const array1 = ['Financial info', 'General', 'Entity info'];
    const array2 = ['Personal info', 'Formation doc'];
    if (array1.includes(currentStep.name)) {
      currentStep.validate();
      isValidCurrentStep = this[currentStep.form].meta.isValid;
      if (isValidCurrentStep) {
        if (currentStep.name === 'Financial info') {
          accountAttributes.netAssets = this.FIN_INFO_FRM.fields.netAssets.value;
          accountAttributes.cfInvestment = {
            dateOfInvestment: '02281975',
            amount: this.FIN_INFO_FRM.fields.cfInvestment.value,
          };
        } else if (currentStep.name === 'General' || currentStep.name === 'Entity info') {
          accountAttributes.entity = this.setEntityAttributes(currentStep.name);
        }
        const isTaxCollision = currentStep.name === 'General' ? await this.checkTaxIdCollision() : false;
        if (!isTaxCollision) {
          this.submitForm(currentStep, formStatus, accountAttributes)
            .then(() => res()).catch(() => rej());
        } else {
          rej();
        }
      } else {
        rej();
      }
    } else if (array2.includes(currentStep.name)) {
      if (removeUploadedData) {
        accountAttributes.entity =
        this.setEntityAttributes(currentStep.name, removeUploadedData, field);
        this.submitForm(currentStep, formStatus, accountAttributes, removeUploadedData)
          .then(() => res()).catch(() => rej());
      } else {
        currentStep.validate();
        isValidCurrentStep = this[currentStep.form].meta.isValid;
        if (isValidCurrentStep) {
          accountAttributes.entity = this.setEntityAttributes(currentStep.name);
          this.submitForm(currentStep, formStatus, accountAttributes)
            .then(() => res()).catch(() => rej());
        } else {
          rej();
        }
      }
    } else if (currentStep.name === 'Link bank') {
      if (bankAccountStore.bankLinkInterface === 'list') {
        currentStep.validate();
      }
      isValidCurrentStep = bankAccountStore.formLinkBankManually.meta.isValid ||
        bankAccountStore.isValidLinkBank;
      if (isValidCurrentStep) {
        uiStore.setProgress();
        if (!isEmpty(bankAccountStore.plaidBankDetails)) {
          const plaidBankDetails = {};
          plaidBankDetails.accountNumber = bankAccountStore.plaidBankDetails.accountNumber;
          plaidBankDetails.bankName = bankAccountStore.plaidBankDetails.bankName;
          plaidBankDetails.plaidPublicToken = bankAccountStore.plaidBankDetails.plaidAccessToken;
          plaidBankDetails.plaidAccountId = bankAccountStore.plaidBankDetails.plaidAccountId;
          plaidBankDetails.plaidItemId = bankAccountStore.plaidBankDetails.plaidItemId;
          plaidBankDetails.routingNumber = bankAccountStore.plaidBankDetails.routingNumber;
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
    let mutation = createAccount;
    const variables = {
      userId: userStore.currentUser.sub,
      accountAttributes,
      status: formStatus,
      accountType: 'entity',
    };
    let actionPerformed = 'submitted';
    if (userDetailsStore.currentUser.data) {
      const accountDetails = find(userDetailsStore.currentUser.data.user.accounts, { accountType: 'entity' });
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
        if (f === 'cfInvestment' && accountDetails[f]) {
          this.FIN_INFO_FRM.fields[f].value = accountDetails[f].amount;
        } else {
          this.FIN_INFO_FRM.fields[f].value = accountDetails[f];
        }
      } else if (form === 'GEN_INFO_FRM') {
        if ((f === 'taxId' || f === 'name') && accountDetails.entity) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails.entity[f];
        } else if (accountDetails.entity && accountDetails.entity.address) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails.entity.address[f];
        }
      } else if (form === 'TRUST_INFO_FRM') {
        if (f === 'isTrust') {
          if (accountDetails.entity && accountDetails.entity[f]) {
            this.TRUST_INFO_FRM.fields[f].value = accountDetails.entity[f];
          } else {
            this.TRUST_INFO_FRM.fields[f].value = true;
            isDirty = true;
          }
        } else if (f === 'trustDate' && accountDetails.entity && accountDetails.entity[f]) {
          this.TRUST_INFO_FRM.fields[f].value = accountDetails.entity[f];
        }
      } else if (form === 'PERSONAL_INFO_FRM') {
        if (accountDetails.entity && accountDetails.entity.legalInfo && f === 'legalDocUrl') {
          const fileName = accountDetails.entity.legalInfo[f].fileName === null ? '' : accountDetails.entity.legalInfo[f].fileName;
          const fileId = accountDetails.entity.legalInfo[f].fileId === null ? '' : accountDetails.entity.legalInfo[f].fileId;
          this.PERSONAL_INFO_FRM.fields[f].value = fileName;
          this.PERSONAL_INFO_FRM.fields[f].fileId = fileId;
        } else if (accountDetails.entity && accountDetails.entity.legalInfo) {
          this.PERSONAL_INFO_FRM.fields[f].value = accountDetails.entity.legalInfo[f];
        }
      } else if (form === 'FORM_DOCS_FRM') {
        if (accountDetails.entity && accountDetails.entity.legalDocs) {
          const { entity } = accountDetails;
          if (entity.legalDocs[f]) {
            const fileName = entity.legalDocs[f].fileName === null ? '' : entity.legalDocs[f].fileName;
            const fileId = entity.legalDocs[f].fileId === null ? '' : entity.legalDocs[f].fileId;
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
      const account = find(userData.accounts, { accountType: 'entity' });
      if (account) {
        this.setFormData('FIN_INFO_FRM', account.accountDetails);
        this.setFormData('GEN_INFO_FRM', account.accountDetails);
        if (account.accountDetails.entity && account.accountDetails.entity.address) {
          this.setEntityAttributes('General');
        }
        this.setFormData('TRUST_INFO_FRM', account.accountDetails);
        if (account.accountDetails.entity && account.accountDetails.entity.isTrust) {
          this.setEntityAttributes('Entity info');
        }
        this.setFormData('PERSONAL_INFO_FRM', account.accountDetails);
        if (account.accountDetails.entity && account.accountDetails.entity.legalInfo) {
          this.setEntityAttributes('Personal info');
        }
        this.setFormData('FORM_DOCS_FRM', account.accountDetails);

        if (account.accountDetails.entity && account.accountDetails.entity.legalDocs) {
          this.setEntityAttributes('Formation doc');
        }
        if (account.accountDetails.bankDetails && account.accountDetails.bankDetails.plaidItemId) {
          bankAccountStore.setPlaidBankDetails(account.accountDetails.bankDetails);
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
      isEmpty(bankAccountStore.plaidBankDetails)) {
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
}

export default new EntityAccountStore();
