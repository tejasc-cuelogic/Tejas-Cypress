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
} from '../../constants/account';

import { GqlClient as client } from '../../services/graphql';
import { createAccount, updateAccount } from '../../stores/queries/account';
import accountStore from '../accountStore';
import uiStore from '../uiStore';
import userStore from '../userStore';
import userDetailsStore from '../user/userDetailsStore';
import Helper from '../../helper/utility';

class EntityAccountStore {
  @observable
  formFinInfo = {
    fields: { ...ENTITY_FIN_INFO }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formGeneralInfo = {
    fields: { ...ENTITY_GEN_INFO }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formEntityInfo = {
    fields: { ...ENTITY_TRUST_INFO }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formPersonalInfo = {
    fields: { ...ENTITY_PERSONAL_INFO }, meta: { isValid: true, error: '', isDirty: false },
  };

  @observable
  formFormationDocuments = {
    fields: { ...ENTITY_FORMATION_DOCS }, meta: { isValid: true, error: '', isDirty: false },
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
  genInfoChange = (e, { name, value }) => {
    this.onFieldChange('formGeneralInfo', name, value);
  };

  @action
  entityInfoChange = (e, { name, value }) => {
    this.onFieldChange('formEntityInfo', name, value);
  };

  @action
  entityInfoDateChange = (date) => {
    this.onFieldChange('formEntityInfo', 'trustDate', date);
  }

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

  @computed
  get isValidLinkBank() {
    if (accountStore.bankLinkInterface === 'list') {
      return _.isEmpty(this.formPersonalInfo.fields.title.error) &&
    _.isEmpty(this.formPersonalInfo.fields.legalDocUrl.error);
    } else if (_.isEmpty(accountStore.plaidBankDetails)) {
      return false;
    }
    return true;
  }

  @computed
  get isValidEntityForm() {
    return this.formFinInfo.meta.isValid && this.formGeneralInfo.meta.isValid
      && this.formEntityInfo.meta.isValid && this.formPersonalInfo.meta.isValid;
  }

  @computed
  get accountAttributes() {
    const payload = {
      netAssets: this.formFinInfo.fields.netAssets.value
        ? this.formFinInfo.fields.netAssets.value : 0,
      cfInvestment: {
        dateOfInvestment: '02281975',
        amount: this.formFinInfo.fields.cfInvestment.value ?
          this.formFinInfo.fields.cfInvestment.value : 0,
      },
      entity: {
        name: this.formGeneralInfo.fields.name.value ? this.formGeneralInfo.fields.name.value : '',
        taxId: this.formGeneralInfo.fields.taxId.value ? this.formGeneralInfo.fields.taxId.value : '',
        isTrust: this.formEntityInfo.fields.isTrust.value,
        trustDate: this.formEntityInfo.fields.trustDate.value,
        address: {
          street: this.formGeneralInfo.fields.street.value ? this.formGeneralInfo.fields.street.value : '',
          city: this.formGeneralInfo.fields.city.value ? this.formGeneralInfo.fields.city.value : '',
          state: this.formGeneralInfo.fields.state.value ? this.formGeneralInfo.fields.state.value : '',
          zipCode: this.formGeneralInfo.fields.zipCode.value ? this.formGeneralInfo.fields.zipCode.value : '',
        },
        legalInfo: {
          legalFirstName: userStore.currentUser.givenName,
          legalLastName: userStore.currentUser.familyName,
          title: this.formPersonalInfo.fields.title.value ? this.formPersonalInfo.fields.title.value : '',
          legalDocUrl: this.formPersonalInfo.fields.legalDocUrl.value ? this.formPersonalInfo.fields.legalDocUrl.value : '',
        },
        legalDocs: {
          formationDoc: this.formFormationDocuments.fields.formationDoc.value ? this.formFormationDocuments.fields.formationDoc.value : '',
          operatingAgreementDoc: this.formFormationDocuments.fields.operatingAgreementDoc.value ? this.formFormationDocuments.fields.operatingAgreementDoc.value : '',
          einVerificationDoc: this.formFormationDocuments.fields.einVerificationDoc.value ? this.formFormationDocuments.fields.einVerificationDoc.value : '',
        },
      },
    };
    if (!_.isEmpty(accountStore.plaidBankDetails)) {
      const plaidBankDetails = _.omit(accountStore.plaidBankDetails, '__typename');
      payload.bankDetails = plaidBankDetails;
    } else {
      const plaidBankDetails = {
        accountNumber: accountStore.formLinkBankManually.fields.accountNumber.value,
        routingNumber: accountStore.formLinkBankManually.fields.routingNumber.value,
      };
      payload.bankDetails = plaidBankDetails;
    }

    return payload;
  }

  /* eslint-disable consistent-return */
  /* eslint-disable arrow-body-style */
  @action
  createAccount = (currentStep, formStatus = 'draft') => {
    let isValidCurrentStep = true;
    switch (currentStep.name) {
      case 'Financial info':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityFinancialInfo;
        break;
      case 'General':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityGeneralInfo;
        break;
      case 'Entity info':
        currentStep.validate();
        isValidCurrentStep = this.isValidEntityInfo;
        break;
      case 'Personal info':
        currentStep.validate();
        isValidCurrentStep = this.isValidPersonalInfo;
        break;
      case 'Formation doc':
        currentStep.validate();
        isValidCurrentStep = this.isValidFormationDoc;
        break;
      case 'Link Bank':
        if (accountStore.bankLinkInterface === 'list') {
          currentStep.validate();
        }
        isValidCurrentStep = this.isValidLinkBank;
        break;
      default:
        break;
    }
    if (isValidCurrentStep) {
      let mutation = createAccount;
      let variables = {
        userId: userStore.currentUser.sub,
        accountAttributes: this.accountAttributes,
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
            accountAttributes: this.accountAttributes,
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
          accountAttributes: this.accountAttributes,
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
              case 'General':
                this.setIsDirty('formGeneralInfo', false);
                this.setStepToBeRendered(2);
                break;
              case 'Entity info':
                this.setIsDirty('formEntityInfo', false);
                this.setStepToBeRendered(3);
                break;
              case 'Personal info':
                this.setIsDirty('formPersonalInfo', false);
                this.setStepToBeRendered(4);
                break;
              case 'Formation doc':
                this.setIsDirty('formFormationDocuments', false);
                this.setStepToBeRendered(5);
                break;
              default:
                break;
            }
            if (formStatus === 'submit') {
              Helper.toast('Entity account created successfully.', 'success');
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
        { accountType: 'entity' },
      );
      if (account) {
        Object.keys(this.formFinInfo.fields).map((f) => {
          if (f === 'cfInvestment') {
            this.formFinInfo.fields[f].value = account.accountDetails[f].amount;
          } else {
            this.formFinInfo.fields[f].value = account.accountDetails[f];
          }
          return this.formFinInfo.fields[f];
        });
        this.onFieldChange('formFinInfo');
        Object.keys(this.formGeneralInfo.fields).map((f) => {
          if (f === 'taxId' || f === 'name') {
            this.formGeneralInfo.fields[f].value = account.accountDetails.entity[f];
          } else {
            this.formGeneralInfo.fields[f].value = account.accountDetails.entity.address[f];
          }
          return this.formGeneralInfo.fields[f];
        });
        this.onFieldChange('formGeneralInfo');
        Object.keys(this.formEntityInfo.fields).map((f) => {
          if (f === 'isTrust') {
            this.formEntityInfo.fields[f].value = account.accountDetails.entity[f];
          }
          return this.formEntityInfo.fields[f];
        });
        this.onFieldChange('formEntityInfo');
        Object.keys(this.formPersonalInfo.fields).map((f) => {
          this.formPersonalInfo.fields[f].value = account.accountDetails.entity.legalInfo[f];
          return this.formPersonalInfo.fields[f];
        });
        this.onFieldChange('formPersonalInfo');
        Object.keys(this.formFormationDocuments.fields).map((f) => {
          this.formFormationDocuments.fields[f].value = account.accountDetails.entity.legalDocs[f];
          return this.formFormationDocuments.fields[f];
        });
        this.onFieldChange('formFormationDocuments');
        if (account.accountDetails.bankDetails.plaidItemId) {
          const { accountNumber, routingNumber } = account.accountDetails.bankDetails;
          accountStore.formLinkBankManually.fields.accountNumber.value = accountNumber;
          accountStore.formLinkBankManually.fields.routingNumber.value = routingNumber;
        } else {
          Object.keys(accountStore.formLinkBankManually.fields).map((f) => {
            const { accountDetails } = account;
            accountStore.formLinkBankManually.fields[f].value = accountDetails.bankDetails[f];
            return accountStore.formLinkBankManually.fields[f];
          });
          accountStore.onFieldChange('formLinkBankManually');
        }
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
        } else if (!accountStore.formLinkBankManually.meta.isValid &&
          _.isEmpty(accountStore.plaidBankDetails)) {
          this.setStepToBeRendered(5);
        } else {
          this.setStepToBeRendered(6);
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

export default new EntityAccountStore();
