import { observable, action, computed } from 'mobx';
import { isEmpty, find, get, map } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
  FILE_UPLOAD_STEPS,
  US_STATES_FOR_INVESTOR,
} from '../../../../constants/account';
import { bankAccountStore, userDetailsStore, userStore, uiStore, investmentLimitStore, accountStore } from '../../index';
import { upsertInvestorAccount, submitinvestorAccount, isUniqueTaxId } from '../../queries/account';
import { FormValidator, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { validationActions, fileUpload } from '../../../actions';
import Helper from '../../../../helper/utility';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';

class EntityAccountStore {
  @observable FIN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_FIN_INFO);
  @observable GEN_INFO_FRM = FormValidator.prepareFormObject(ENTITY_GEN_INFO);
  @observable TRUST_INFO_FRM = FormValidator.prepareFormObject(ENTITY_TRUST_INFO, true);
  @observable PERSONAL_INFO_FRM = FormValidator.prepareFormObject(ENTITY_PERSONAL_INFO);
  @observable FORM_DOCS_FRM = FormValidator.prepareFormObject(ENTITY_FORMATION_DOCS);
  @observable entityData = {};
  @observable stepToBeRendered = '';
  @observable entityAccountId = null;
  @observable showProcessingModal = false;
  @observable isFormSubmitted = false;

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
    const investmentLimit =
    investmentLimitStore.getInvestmentLimit({
      annualIncome: typeof this.FIN_INFO_FRM.fields.annualIncome.value === 'string' ? parseFloat(this.FIN_INFO_FRM.fields.annualIncome.value) : this.FIN_INFO_FRM.fields.annualIncome.value,
      netWorth: typeof this.FIN_INFO_FRM.fields.netAssets.value === 'string' ? parseFloat(this.FIN_INFO_FRM.fields.netAssets.value) : this.FIN_INFO_FRM.fields.netAssets.value,
    });
    this.FIN_INFO_FRM = FormValidator.onChange(
      this.FIN_INFO_FRM,
      { name: 'investmentLimit', value: investmentLimit },
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
    this.TRUST_INFO_FRM.fields.trustDate.rule = result.fielddata.value ? 'optional' : 'required';
    this.TRUST_INFO_FRM.fields.trustDate.value = result.fielddata.value ? '' :
      moment(`${new Date().getFullYear()}-01-01`).format('MM-DD-YYYY');
    this.TRUST_INFO_FRM.fields.trustDate.error = result.fielddata.value ? undefined :
      this.TRUST_INFO_FRM.fields.trustDate.error;
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
      bankAccountStore.formEntityAddFunds.meta.isValid &&
      (bankAccountStore.formLinkBankManually.meta.isValid || bankAccountStore.isAccountPresent);
  }

  @action
  setAddressFields = (place) => {
    FormValidator.setAddressFields(place, this.GEN_INFO_FRM);
  }
  submitAccount = () => {
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'entity' });
    uiStore.setProgress();
    const payLoad = {
      accountId: get(accountDetails, 'details.accountId') || this.entityAccountId,
      accountType: 'ENTITY',
    };
    return new Promise((resolve, reject) => {
      bankAccountStore.isValidOpeningDepositAmount(false).then(() => {
        client
          .mutate({
            mutation: submitinvestorAccount,
            variables: payLoad,
          })
          .then(() => {
            this.setFieldValue('showProcessingModal', true);
            bankAccountStore.resetStoreData();
            this.isFormSubmitted = true;
            uiStore.resetcreateAccountMessage();
            Helper.toast('Entity account submitted successfully.', 'success');
            resolve();
          })
          .catch((err) => {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            uiStore.setProgress(false);
            reject();
          });
      });
    });
  }

  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  @action
  createAccount = (
    currentStep,
    removeUploadedData = false, field = null,
  ) => new Promise((resolve) => {
    this.validateAndSubmitStep(currentStep, removeUploadedData, field).then(() => {
      resolve();
    }).catch(() => {
      uiStore.setProgress(false);
    });
  })

  @action
  setEntityAttributes = (step, removeUploadedData, field) => {
    const selectedState =
    find(US_STATES_FOR_INVESTOR, { value: this.GEN_INFO_FRM.fields.state.value });
    switch (step) {
      case 'General':
        this.entityData.name = this.GEN_INFO_FRM.fields.name.value;
        this.entityData.taxId = this.GEN_INFO_FRM.fields.taxId.value;
        this.entityData.address = {
          street: this.GEN_INFO_FRM.fields.street.value,
          city: this.GEN_INFO_FRM.fields.city.value,
          state: selectedState ? selectedState.key : '',
          zipCode: this.GEN_INFO_FRM.fields.zipCode.value,
          streetTwo: this.GEN_INFO_FRM.fields.streetTwo.value,
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
    const selectedState =
          find(US_STATES_FOR_INVESTOR, { value: this.GEN_INFO_FRM.fields.state.value });
    payload = {
      limits: {
        netWorth: this.FIN_INFO_FRM.fields.netAssets.value,
        otherContributions: this.FIN_INFO_FRM.fields.annualIncome.value,
      },
      name: this.GEN_INFO_FRM.fields.name.value,
      taxId: this.GEN_INFO_FRM.fields.taxId.value,
      isTrust: this.TRUST_INFO_FRM.fields.isTrust.value,
      trustDate: this.TRUST_INFO_FRM.fields.trustDate.value,
      entityType: this.GEN_INFO_FRM.fields.entityType.value,
      address: {
        street: this.GEN_INFO_FRM.fields.street.value,
        city: this.GEN_INFO_FRM.fields.city.value,
        state: selectedState ? selectedState.key : '',
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
    if (!isEmpty(bankAccountStore.plaidAccDetails) &&
        !bankAccountStore.manualLinkBankSubmitted) {
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

    const isValidAddFunds = bankAccountStore.formEntityAddFunds.meta.isFieldValid;
    if (isValidAddFunds) {
      payload.initialDepositAmount = bankAccountStore.formEntityAddFunds.fields.value.value;
    }

    return payload;
  }

  @action
  checkTaxIdCollision = () => new Promise(async (resolve) => {
    graphql({
      client,
      query: isUniqueTaxId,
      variables: {
        taxId: this.GEN_INFO_FRM.fields.taxId.value,
      },
      fetchPolicy: 'network-only',
      onFetch: (fData) => {
        if (fData) {
          if (fData.isUniqueTaxId.alreadyExists) {
            uiStore.showErrorMessage('Please double-check and try again.');
          }
          resolve(fData.isUniqueTaxId.alreadyExists);
        }
      },
      onError: () => Helper.toast('Something went wrong, please try again later.', 'error'),
    });
  });

  @action
  validateAndSubmitStep =
  (currentStep, removeUploadedData, field) => new Promise((res, rej) => {
    let isValidCurrentStep = true;
    let accountAttributes = {};
    const array1 = ['Financial info', 'General', 'Trust Status'];
    const array2 = ['Personal info', 'Formation doc'];
    if (array1.includes(currentStep.name)) {
      currentStep.validate();
      isValidCurrentStep = this[currentStep.form].meta.isValid;
      if (isValidCurrentStep) {
        uiStore.setProgress();
        if (currentStep.name === 'Financial info') {
          accountAttributes.limits = {
            netWorth: this.FIN_INFO_FRM.fields.netAssets.value,
            income: this.FIN_INFO_FRM.fields.annualIncome.value,
          };
        } else if (currentStep.name === 'General' || currentStep.name === 'Trust Status') {
          accountAttributes = this.setEntityAttributes(currentStep.name);
        }
        if (currentStep.name === 'General') {
          this.checkTaxIdCollision().then((alreadyExists) => {
            if (alreadyExists) {
              rej();
            } else {
              uiStore.setErrors(null);
              this.submitForm(currentStep, accountAttributes)
                .then(() => res()).catch(() => rej());
            }
          });
        } else {
          this.submitForm(currentStep, accountAttributes)
            .then(() => res()).catch(() => rej());
        }
      } else {
        rej();
      }
    } else if (array2.includes(currentStep.name)) {
      if (removeUploadedData) {
        accountAttributes =
        this.setEntityAttributes(currentStep.name, removeUploadedData, field);
        this.submitForm(currentStep, accountAttributes, removeUploadedData)
          .then(() => res()).catch(() => rej());
      } else {
        currentStep.validate();
        isValidCurrentStep = this[currentStep.form].meta.isValid;
        if (isValidCurrentStep) {
          accountAttributes = this.setEntityAttributes(currentStep.name);
          this.submitForm(currentStep, accountAttributes)
            .then(() => res()).catch(() => rej());
        } else {
          rej();
        }
      }
    } else if (currentStep.name === 'Link bank') {
      if (parseFloat(bankAccountStore.formEntityAddFunds.fields.value.value, 0) !== 0) {
        bankAccountStore.validateAddFunds();
      }
      if (bankAccountStore.manualLinkBankSubmitted) {
        currentStep.validate();
      }
      // const isValidAddFunds = bankAccountStore.formAddFunds.meta.isFieldValid;
      isValidCurrentStep = bankAccountStore.formEntityAddFunds.meta.isValid ||
      bankAccountStore.isAccountPresent ||
      bankAccountStore.formLinkBankManually.meta.isValid;
      if (isValidCurrentStep) {
        uiStore.setProgress();
        // if (!isEmpty(bankAccountStore.plaidAccDetails) &&
        //   !bankAccountStore.manualLinkBankSubmitted) {
        //   const plaidBankDetails = {};
        //   plaidBankDetails.plaidPublicToken = bankAccountStore.plaidAccDetails.public_token;
        //   plaidBankDetails.plaidAccountId = bankAccountStore.plaidAccDetails.account_id;
        //   accountAttributes.linkedBank = plaidBankDetails;
        // } else {
        //   const { accountNumber, routingNumber } = bankAccountStore.formLinkBankManually.fields;
        //   if (accountNumber && routingNumber) {
        //     const plaidBankDetails = {
        //       accountNumber: accountNumber.value,
        //       routingNumber: routingNumber.value,
        //     };
        //     accountAttributes.linkedBank = plaidBankDetails;
        //   }
        // }
        accountAttributes.linkedBank = bankAccountStore.accountAttributes.linkedBank;
        accountAttributes.initialDepositAmount =
          bankAccountStore.accountAttributes.initialDepositAmount;
        bankAccountStore.isValidOpeningDepositAmount().then(() => {
          this.submitForm(currentStep, accountAttributes)
            .then(() => res()).catch(() => rej());
        })
          .catch(() => {
            rej();
          });
      } else {
        rej();
      }
    }
    return true;
  })

  @action
  submitForm = (currentStep, accountAttributes, removeUploadedData = false) => {
    uiStore.setProgress();
    let mutation = upsertInvestorAccount;
    const variables = {
      accountAttributes,
      accountType: 'ENTITY',
    };
    let actionPerformed = 'submitted';
    const accountDetails = find(userDetailsStore.currentUser.data.user.roles, { name: 'entity' });
    if (userDetailsStore.currentUser.data) {
      if (accountDetails || this.entityAccountId) {
        mutation = upsertInvestorAccount;
        variables.accountId = get(accountDetails, 'details.accountId')
          || this.entityAccountId;
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
          this.entityAccountId = result.data.upsertInvestorAccount.accountId;
          if (result.data.upsertInvestorAccount && currentStep.name === 'Link bank') {
            userDetailsStore.getUser(userStore.currentUser.sub);
            const { linkedBank } = result.data.upsertInvestorAccount;
            bankAccountStore.setPlaidAccDetails(linkedBank);
            FormValidator.setIsDirty(bankAccountStore.formEntityAddFunds, false);
            // if (bankAccountStore.ManualLinkBankSubmitted) {
            //   FormValidator.resetFormData(bankAccountStore.formAddFunds);
            // }
          }
          if (currentStep.name === 'Personal info' || currentStep.name === 'Formation doc') {
            if (removeUploadedData) {
              if (currentStep.name === 'Personal info') {
                validationActions.validateEntityPersonalInfo();
              } else {
                validationActions.validateEntityFormationDoc();
              }
            } else {
              FormValidator.setIsDirty(this[currentStep.form], false);
            }
          } else if (currentStep.name !== 'Link bank') {
            FormValidator.setIsDirty(this[currentStep.form], false);
          }
          this.setStepToBeRendered(currentStep.stepToBeRendered);
          accountStore.accountToastMessage(currentStep, actionPerformed);
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
  setFormData = (form, accountDetails) => {
    Object.keys(this[form].fields).map((f) => {
      if (form === 'FIN_INFO_FRM') {
        if (f === 'annualIncome' && accountDetails.limits && accountDetails.limits.income) {
          this.FIN_INFO_FRM.fields[f].value = accountDetails.limits.income;
        } else if (accountDetails.limits && accountDetails.limits.netWorth && f !== 'investmentLimit') {
          this.FIN_INFO_FRM.fields[f].value = accountDetails.limits.netWorth;
        }
      } else if (form === 'GEN_INFO_FRM') {
        if ((f === 'taxId' || f === 'name' || f === 'entityType') && accountDetails && accountDetails[f]) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails[f];
        } else if (f === 'state' && accountDetails && accountDetails.address && accountDetails.address.state) {
          this.GEN_INFO_FRM.fields[f].value =
          find(US_STATES_FOR_INVESTOR, { key: accountDetails.address.state }).value;
        } else if (accountDetails && accountDetails.address) {
          this.GEN_INFO_FRM.fields[f].value = accountDetails.address[f];
        }
      } else if (form === 'TRUST_INFO_FRM') {
        if (f === 'isTrust') {
          if (accountDetails && (accountDetails[f] === true || accountDetails[f] === false)) {
            this.TRUST_INFO_FRM.fields[f].value = accountDetails[f];
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
    FormValidator.onChange(this[form], '', '', false);
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
        if (account.details.linkedBank && !bankAccountStore.manualLinkBankSubmitted) {
          bankAccountStore.setPlaidAccDetails(account.details.linkedBank);
          bankAccountStore.formEntityAddFunds.fields.value.value =
          account.details.initialDepositAmount;
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
          bankAccountStore.formEntityAddFunds.fields.value.value =
          account.details.initialDepositAmount;
        }
        bankAccountStore.validateAddFunds();
        // bankAccountStore.validateAddfundsAmount();
        this.renderAfterPopulate();
      }
    }
    uiStore.setProgress(false);
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
    } else if (bankAccountStore.isLinkbankInComplete) {
      this.setStepToBeRendered(getEntityStep.formLinkBankManually);
    } else {
      this.setStepToBeRendered(getEntityStep.summary);
    }
  }

  @action
  setFileUploadData = (form, field, files) => {
    uiStore.setProgress();
    const file = files[0];
    const stepName = FILE_UPLOAD_STEPS[field];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this[form].fields[field].fileId = fileId;
      this[form].fields[field].preSignedUrl = preSignedUrl;
      this[form].fields[field].fileData = file;
      this[form] = FormValidator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
      uiStore.setProgress();
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
        .then(() => {
          const isPersonalForm = form === 'PERSONAL_INFO_FRM';
          if (this[form].meta.isValid) {
            const currentStep = isPersonalForm ?
              {
                name: 'Personal info',
                form: 'PERSONAL_INFO_FRM',
                stepToBeRendered: 4,
                validate: validationActions.validateEntityPersonalInfo,
              } :
              {
                name: 'Formation doc',
                form: 'FORM_DOCS_FRM',
                stepToBeRendered: 5,
                validate: validationActions.validateEntityFormationDoc,
              };
            if (isPersonalForm || this.formationDocUploadCount() >= 3) {
              this.createAccount(currentStep, false).then(() => {
                console.log();
                uiStore.setProgress(false);
              });
            } else {
              uiStore.setProgress(false);
            }
          } else {
            uiStore.setProgress(false);
          }
          // eslint-disable-next-line no-undef
        })
        .catch((err) => {
          uiStore.setProgress(false);
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
        });
    }));
  }

  formationDocUploadCount = () => map(this.entityData.legalDocs, k => (k.fileId)).length;

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
      if (form === 'PERSONAL_INFO_FRM' ||
        this.formationDocUploadCount() >= 3) {
        this.createAccount(currentStep, true, field);
      }
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
    this.resetFormData('TRUST_INFO_FRM');
    // this.TRUST_INFO_FRM.fields.isTrust.value = true;
    // this.TRUST_INFO_FRM.fields.isTrust.error = undefined;
    // this.TRUST_INFO_FRM.fields.trustDate.value =
    // moment(`${new Date().getFullYear()}-01-01`).format('MM/DD/YYYY');
    // this.TRUST_INFO_FRM.fields.trustDate.error = undefined;
    // this.TRUST_INFO_FRM.meta.isValid = false;
    // this.TRUST_INFO_FRM.meta.error = '';
    this.entityData = {};
    this.stepToBeRendered = '';
    this.entityAccountId = null;
  };
}

export default new EntityAccountStore();
