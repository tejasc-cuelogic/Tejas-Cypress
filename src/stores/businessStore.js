import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import {
  DOCFILE_TYPES,
  FORM_VALUES,
  FILER_INFORMATION,
  ISSUER_INFORMATION,
  OFFERING_INFORMATION,
  ANNUAL_REPORT_REQUIREMENTS,
  SIGNATURE,
  NEW_OFFERING_INFORMATION,
  TEMPLATE_VARIABLES,
} from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  businessId = '';

  @observable
  filingId = '';

  @observable
  folderId = '';

  @observable
  offeringUrl = '';

  @observable
  templateVariables = { ...TEMPLATE_VARIABLES };

  @observable
  businessList = [];

  @observable
  isBusinessExist = false;

  @observable
  business = {
    id: '',
    name: {
      value: '',
      error: undefined,
      key: 'name',
    },
    desc: {
      value: '',
      error: undefined,
      key: 'desc',
    },
    filings: [],
  };

  @observable
  filerInformation = { ...FILER_INFORMATION }

  @observable
  issuerInformation = { ...ISSUER_INFORMATION }

  @observable
  offeringInformation = { ...OFFERING_INFORMATION }

  @observable
  annualReportRequirements = { ...ANNUAL_REPORT_REQUIREMENTS }

  @observable
  signature = { ...SIGNATURE }

  @observable
  documentList = { ...DOCFILE_TYPES };

  @observable
  offeringList = [];

  @observable
  newOfferingInformation = { ...NEW_OFFERING_INFORMATION };

  @observable
  editBusinessName = false;

  @observable
  editBusinessMode = false;

  @computed get canSubmitEdgarForm() {
    return (_.every(this.templateVariables, val => !_.isEmpty(val)));
  }

  @computed get canSubmitNewOfferingForm() {
    return (_.every(this.newOfferingInformation, data => !_.isEmpty(data.value)));
  }

  @computed get getSummary() {
    return this.businessList.length || 0;
  }

  @action
  setEditBusinessName(status) {
    this.editBusinessName = status;
  }

  @action
  setTemplateVariableByKey(key, value) {
    this.templateVariables[key] = value;
  }

  @action
  setTemplateVariable(variable) {
    this.templateVariables = variable;
  }

  @action
  resetTemplateVariables() {
    this.templateVariables = { ...TEMPLATE_VARIABLES };
  }

  @action
  toggleRequiredFiles(key) {
    this.documentList[key] = !this.documentList[key];
  }

  @action
  setBusinessId(id) {
    this.businessId = id;
  }

  @action
  setFilingId(id) {
    this.filingId = id;
  }

  @action
  setFolderId(id) {
    this.folderId = id;
  }

  @action
  setOfferingUrl(url) {
    this.offeringUrl = url;
  }

  @action
  setFilerInfo(field, value) {
    this.filerInformation[field].value = value;
  }

  @action
  setFilerError(field, error) {
    this.filerInformation[field].error = error;
  }

  @action
  togglefilerCheckbox(name) {
    this.filerInformation[name].value = !this.filerInformation[name].value;
  }

  @action
  setIssuerInfo(field, value) {
    this.issuerInformation[field].value = value;
  }

  @action
  setIssuerError(field, error) {
    this.issuerInformation[field].error = error;
  }

  @action
  setOfferingInfo(field, value) {
    this.offeringInformation[field].value = value;
  }

  @action
  setOfferingError(field, error) {
    this.offeringInformation[field].error = error;
  }

  @action
  setAnnualReportInfo(field, value) {
    this.annualReportRequirements[field].value = value;
  }

  @action
  setAnnualReportError(field, error) {
    this.annualReportRequirements[field].error = error;
  }

  @action
  setSignatureInfo(field, value) {
    this.signature[field].value = value;
  }

  @action
  setSignatureError(field, error) {
    this.signature[field].error = error;
  }

  /**
  * @desc This action changes fields in personal signature form, Form can has multiple entries
  *       Depending on unique ID we need to change value of particular entry only, hence we are
  *       finding out and entry with and given ID and then modifying value in it...
  */
  @action
  changePersonalSignature(field, id, value) {
    _.filter(this.signature.signaturePersons, person => person.id === id)[0][field].value = value;
  }

  @action
  setPersonalSignatureError(field, id, error) {
    _.filter(this.signature.signaturePersons, person => person.id === id)[0][field].error = error;
  }

  @action
  setCountry(identifier, name, value) {
    // this.annualReportRequirements.issueJurisdictionSecuritiesOffering.value = value;
    this[identifier][name].value = value;
  }

  @action
  addNewPersonalSignature(newSignatures) {
    this.signature.signaturePersons = newSignatures;
  }

  @action
  deletePersonalSignature(id) {
    const { signaturePersons } = this.signature;
    this.signature.signaturePersons = _.filter(signaturePersons, person => person.id !== id);
  }

  @action
  setOfferingList(list) {
    this.offeringList = list;
  }

  @action
  setBusinessList(list) {
    this.businessList = list;
  }

  @action
  setNewOfferingInfo(field, value) {
    this.newOfferingInformation[field].value = value;
  }

  @action
  setNewOfferingError(field, error) {
    this.newOfferingInformation[field].error = error;
  }

  @action
  resetNewOfferingInfo() {
    this.newOfferingInformation.businessName.value = '';
    this.newOfferingInformation.businessName.error = undefined;
    this.newOfferingInformation.businessDescription.value = '';
    this.newOfferingInformation.businessDescription.error = undefined;
  }

  @action
  setIsBusinessExist(value) {
    this.isBusinessExist = value;
    if (value === true) {
      this.setNewOfferingError('businessName', 'Business Name is already exist.');
    }
  }

  @action
  setBusiness(details) {
    this.business = details;
  }

  @action
  setBusinessDetailsOnEdit(field, value) {
    this.business[field].value = value;
    if (value === '') {
      this.setBusinessNameErrorOnEdit(field, `${field} field is required.`);
    } else {
      this.setBusinessNameErrorOnEdit(field, '');
    }
  }

  @action
  setBusinessNameErrorOnEdit(field, error) {
    this.business[field].error = error;
  }

  @action
  setBusinessMode(status) {
    this.editBusinessMode = status;
  }
}

export default new BusinessStore();
