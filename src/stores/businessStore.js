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
} from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  offeringId = '';

  @observable
  offeringUrl = '';

  @observable
  templateVariables = {
    name_of_business: '',
    shorthand_name: '',
    investment_multiple: '',
    revenue_share_percentage: '',
    minimum_offering_amount: '',
    offering_amount: '',
    maturity_date: '',
    interest_rate: '',
    offer_date: '',
    state_of_formation: '',
    type_of_business: '',
    termination_date: '',
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

  @computed get canSubmitEdgarForm() {
    return (_.every(this.templateVariables, val => !_.isEmpty(val)));
  }

  @action
  setTemplateVariable(key, value) {
    this.templateVariables[key] = value;
  }

  @action
  toggleRequiredFiles(key) {
    this.documentList[key] = !this.documentList[key];
  }

  @action
  setOfferingId(id) {
    this.offeringId = id;
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
  setSignatureInfo(field, value) {
    this.signature[field].value = value;
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
}

export default new BusinessStore();
