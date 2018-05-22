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
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    this[form].fields[field].error = validation.errors.first(field);
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
    return _.isEmpty(this.formFinInfo.fields.entityNetAssets.error) &&
    _.isEmpty(this.formFinInfo.fields.cfInvestments.error);
  }

  @computed
  get isValidEntityGeneralInfo() {
    return _.isEmpty(this.formGeneralInfo.fields.nameOfEntity.error) &&
    _.isEmpty(this.formGeneralInfo.fields.taxId.error) &&
    _.isEmpty(this.formGeneralInfo.fields.street.error) &&
    _.isEmpty(this.formGeneralInfo.fields.city.error) &&
    _.isEmpty(this.formGeneralInfo.fields.state.error) &&
    _.isEmpty(this.formGeneralInfo.fields.zipCode.error);
  }

  @computed
  get isValidEntityInfo() {
    return _.isEmpty(this.formEntityInfo.fields.isEntityTrust.error) &&
    _.isEmpty(this.formEntityInfo.fields.dateOfTrust.error);
  }

  @computed
  get isValidPersonalInfo() {
    return _.isEmpty(this.formPersonalInfo.fields.entityTitle.error) &&
    _.isEmpty(this.formPersonalInfo.fields.photoId.error);
  }

  @computed
  get accountAttributes() {
    return {
      netAssets: this.formFinInfo.fields.entityNetAssets.value
        ? this.formFinInfo.fields.entityNetAssets.value : 0,
      cfInvestment: {
        dateOfInvestment: '02281975',
        amount: this.formFinInfo.fields.cfInvestments.value ?
          this.formFinInfo.fields.cfInvestments.value : 0,
      },
      entity: {
        name: this.formGeneralInfo.fields.nameOfEntity.value,
        taxId: this.formGeneralInfo.fields.taxId.value,
        address: '232 sda asd',
        isTrust: this.formEntityInfo.fields.isEntityTrust.value,
        trustDate: this.formEntityInfo.fields.dateOfTrust.value,
        /* eslint-disable no-dupe-keys */
        address: {
          street1: this.formGeneralInfo.fields.street.value,
          street2: 'str2',
          city: this.formGeneralInfo.fields.city.value,
          state: this.formGeneralInfo.fields.state.value,
          zipCode: this.formGeneralInfo.fields.zipCode.value,
        },
        legalInfo: {
          legalFirstName: 'legal first name',
          legalLastName: 'legal last name',
        },
      },
    };
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
      if (typeof userDetailsStore.currentUser.data !== 'undefined') {
        const accountDetails = _.find(
          userDetailsStore.currentUser.data.user.accounts,
          { accountType: 'entity' },
        );
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
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation,
            variables,
          })
          .then((result) => {
            switch (currentStep.name) {
              case 'Financial info':
                this.setIsDirty('formFinInfo', false);
                break;
              case 'General':
                this.setIsDirty('formGeneralInfo', false);
                break;
              case 'Entity info':
                this.setIsDirty('formEntityInfo', false);
                break;
              case 'Personal info':
                this.setIsDirty('formPersonalInfo', false);
                break;
              default:
                break;
            }
            userDetailsStore.getUser(userStore.currentUser.sub);
            if (formStatus === 'submit') {
              Helper.toast('Entity account created successfully.', 'success');
            } else {
              Helper.toast(`${currentStep.name} ${actionPerformed} successfully.`, 'success');
            }
            resolve(result);
          })
          .catch((err) => {
            uiStore.setErrors(err);
            reject(err);
          })
          .finally(() => {
            uiStore.setProgress(false);
          });
      });
    }
  }
}

export default new EntityAccountStore();
