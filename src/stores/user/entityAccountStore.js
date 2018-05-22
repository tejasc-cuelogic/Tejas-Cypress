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
import { createAccount } from '../../stores/queries/account';
import uiStore from '../uiStore';
import userStore from '../userStore';
// import userDetailsStore from '../user/userDetailsStore';
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
  get accountAttributes() {
    return {
      netAssets: this.formFinInfo.fields.entityNetAssets.value,
      cfInvestment: {
        dateOfInvestment: '02281975',
        amount: this.formFinInfo.fields.cfInvestments.value,
      },
      entity: {
        name: this.formGeneralInfo.fields.nameOfEntity.value,
        taxId: this.formGeneralInfo.fields.taxId.value,
        address: '232 sda asd',
        isTrust: this.formEntityInfo.fields.isEntityTrust.value,
        trustDate: this.formEntityInfo.fields.dateOfTrust.value,
        /* eslint-disable no-dupe-keys */
        address: {
          street1: 'str1',
          street2: 'str2',
          city: 'atlanta',
          state: 'GA',
          zipCode: '30318',
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
      default:
        break;
    }
    if (isValidCurrentStep) {
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation: createAccount,
            variables: {
              userId: userStore.currentUser.sub,
              accountAttributes: this.accountAttributes,
              status: formStatus,
              accountType: 'entity',
            },
          })
          .then((result) => {
            switch (currentStep.name) {
              case 'Financial info':
                this.setIsDirty('formFinInfo', false);
                break;
              default:
                break;
            }
            Helper.toast(`${currentStep.name} updated successfully.`, 'success');
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
