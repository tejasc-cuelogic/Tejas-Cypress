import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import {
  ENTITY_FIN_INFO,
  ENTITY_GEN_INFO,
  ENTITY_TRUST_INFO,
  ENTITY_PERSONAL_INFO,
  ENTITY_FORMATION_DOCS,
} from '../../constants/account';

class EntityAccountStore {
  @observable
  formFinInfo = {
    fields: { ...ENTITY_FIN_INFO }, meta: { isValid: true, error: '' },
  };

  @observable
  formGeneralInfo = {
    fields: { ...ENTITY_GEN_INFO }, meta: { isValid: true, error: '' },
  };

  @observable
  formEntityInfo = {
    fields: { ...ENTITY_TRUST_INFO }, meta: { isValid: true, error: '' },
  };

  @observable
  formPersonalInfo = {
    fields: { ...ENTITY_PERSONAL_INFO }, meta: { isValid: true, error: '' },
  };

  @observable
  formFormationDocuments = {
    fields: { ...ENTITY_FORMATION_DOCS }, meta: { isValid: true, error: '' },
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
    this[form].fields[field].error = validation.errors.first(field);
  };
}

export default new EntityAccountStore();
