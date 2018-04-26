import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import {
  FORM_VALUES,
  FILER_INFORMATION,
  ISSUER_INFORMATION,
  OFFERING_INFORMATION,
  ANNUAL_REPORT_REQUIREMENTS,
  SIGNATURE,
  NEW_OFFERING_INFORMATION,
  TEMPLATE_VARIABLES,
  XML_SUBMISSION_TABS,
} from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  businessId = '';

  @observable
  filingId = '';

  @observable
  xmlSubmissionId = '';

  @observable
  folderId = '';

  // @observable
  // offeringUrl = '';

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
  documentList = [];

  @observable
  offeringList = [];

  @observable
  newOfferingInformation = { ...NEW_OFFERING_INFORMATION };

  @observable
  editBusinessMode = false;

  @observable
  xmlErrors = {};

  @observable
  xmlSubmissionTabs = [...XML_SUBMISSION_TABS];

  @observable
  xmlActiveTabId = 0;

  @observable
  xmlSubmissionStatus = '';

  @computed get canSubmitEdgarForm() {
    return (_.every(this.templateVariables, val => !_.isEmpty(val)));
  }

  @computed get canSubmitNewOfferingForm() {
    return (_.every(this.newOfferingInformation, data => !_.isEmpty(data.value)));
  }

  @computed get canSubmitEditBusinessForm() {
    return (this.business.name.value !== '' && this.business.desc.value !== '');
  }

  @computed get canSubmitXmlForm() {
    return _.isEmpty(_.filter(this.filerInformation, field => field.error)) &&
      _.isEmpty(_.filter(this.issuerInformation, field => field.error)) &&
      _.isEmpty(_.filter(this.offeringInformation, field => field.error)) &&
      _.isEmpty(_.filter(this.annualReportRequirements, field => field.error));
  }

  @computed get canSubmitFilerInfoXmlForm() {
    return _.isEmpty(_.filter(this.filerInformation, field => field.error));
  }

  @computed get canSubmitIssuerInfoXmlForm() {
    return _.isEmpty(_.filter(this.issuerInformation, field => field.error));
  }

  @computed get canSubmitOfferingInfoXmlForm() {
    return _.isEmpty(_.filter(this.offeringInformation, field => field.error));
  }

  @computed get canSubmitAnnualReportXmlForm() {
    return _.isEmpty(_.filter(this.annualReportRequirements, field => field.error));
  }

  @computed get canSubmitSigntureForm() {
    return _.isEmpty(_.filter(this.signature, field => field.error));
  }

  @computed get canSubmitSignaturePersonsForm() {
    return _.map(this.signature.signaturePersons, signaturePerson =>
      _.isEmpty(_.filter(signaturePerson, field => field.error)));
  }

  @computed get getSummary() {
    return this.businessList.length || 0;
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
  setDocumentList(list) {
    this.documentList = list;
  }

  @action
  setDocument(name, value) {
    /*eslint-disable*/
    _.forEach(this.documentList, (document) => {
      if (document.name === name) {
        document.checked = value;
      }
    });
  }

  @action
  toggleRequiredFiles(key) {
    _.filter(this.documentList, document => document.name === key)[0].checked =
      !_.filter(this.documentList, document => document.name === key)[0].checked;
    
    if (_.filter(this.documentList, document => document.name === key)[0].checked) {
      this.removeXmlError('documentListError');
    } 
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
  setXmlSubmissionId(id) {
    this.xmlSubmissionId = id;
  }

  @action
  setFolderId(id) {
    this.folderId = id;
  }

  // @action
  // setOfferingUrl(url) {
  //   this.offeringUrl = url;
  // }

  @action
  setFiler(filerInformation) {
    this.filerInformation = filerInformation;
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
  clearFiler() {
    this.filerInformation = { ...FILER_INFORMATION };
  }

  @action
  togglefilerCheckbox(name) {
    this.filerInformation[name].value = !this.filerInformation[name].value;
  }

  @action
  setIssuer(issuerInformation) {
    this.issuerInformation = issuerInformation;
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
  clearIssuer() {
    this.issuerInformation = { ...ISSUER_INFORMATION };
  }

  @action
  setOffering(offeringInformation) {
    this.offeringInformation = offeringInformation;
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
  clearOffering() {
    this.offeringInformation = { ...OFFERING_INFORMATION };
  }

  @action
  setAnnualReport(newAnnualReport) {
    this.annualReportRequirements = newAnnualReport;
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
  clearAnnualReport() {
    this.annualReportRequirements = { ...ANNUAL_REPORT_REQUIREMENTS };
  }

  @action
  setSignature(signature) {
    this.signature = signature;
  }

  @action
  setSignatureInfo(field, value) {
    this.signature[field].value = value;
  }

  @action
  setSignatureError(field, error) {
    this.signature[field].error = error;
  }

  @action
  clearSignature() {
    this.signature = { ...SIGNATURE }
  }

  @action
  setXmlSubmissionStatus(status) {
    this.xmlSubmissionStatus = status;
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
  setNewPersonalSignature(newSignatures) {
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
  }

  @action
  setBusinessNameErrorOnEdit(field, error) {
    this.business[field].error = error;
  }

  @action
  setEditBusinessMode(status) {
    this.editBusinessMode = status;
  }

  @action
  setXmlError(errors) {
    this.xmlErrors = { ...errors };
  }

  @action
  removeXmlError(key) {
    this.xmlErrors = _.omit(this.xmlErrors, key);
  }

  @action
  setXmlActiveTabId(id) {
    this.xmlActiveTabId = id;
  }
}

export default new BusinessStore();
