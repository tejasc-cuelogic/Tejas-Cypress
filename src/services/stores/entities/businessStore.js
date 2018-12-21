import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import Validator from 'validatorjs';

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
} from './../../../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  offeringId = '';

  @observable
  filingId = '';

  @observable
  xmlSubmissionId = '';

  @observable
  folderId = '';

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
  formFilerInfo = {
    fields: { ...FILER_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formIssuerInfo = {
    fields: { ...ISSUER_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formOfferingInfo = {
    fields: { ...OFFERING_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formAnnualInfo = {
    fields: { ...ANNUAL_REPORT_REQUIREMENTS }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formSignatureInfo = {
    fields: { ...SIGNATURE }, meta: { isValid: false, error: '', isDirty: false },
  };

  @observable
  formDocumentInfo = {
    documentList: [],
    meta: { isDirty: false },
  }

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
  xmlActiveTabName = 'filer';

  @observable
  xmlSubmissionStatus = '';

  @observable
  xmlSubStepsStatus = {
    filer: false,
    issuer: false,
    offering: false,
    annual: false,
    signature: false,
    doc: false,
  };

  @observable boxFolderLink = '/';

  @computed get canSubmitEdgarForm() {
    return (_.every(this.templateVariables, val => !_.isEmpty(val)));
  }

  @computed get canSubmitNewOfferingForm() {
    return (_.every(this.newOfferingInformation, data => !_.isEmpty(data.value)));
  }

  @computed get canSubmitEditBusinessForm() {
    return (this.business.name.value !== '' && this.business.desc.value !== '');
  }

  @computed get canSubmitFilerInfoXmlForm() {
    return _.isEmpty(_.filter(this.formFilerInfo.fields, field => field.error));
  }

  @computed get canSubmitIssuerInfoXmlForm() {
    return _.isEmpty(_.filter(this.formIssuerInfo.fields, field => field.error));
  }

  @computed get canSubmitOfferingInfoXmlForm() {
    return _.isEmpty(_.filter(this.formOfferingInfo.fields, field => field.error));
  }

  @computed get canSubmitAnnualReportXmlForm() {
    return _.isEmpty(_.filter(this.formAnnualInfo.fields, field => field.error));
  }

  @computed get canSubmitSigntureForm() {
    return _.isEmpty(_.filter(this.formSignatureInfo.fields, field => field.error));
  }

  @computed get canSubmitSignaturePersonsForm() {
    return _.map(this.formSignatureInfo.fields.signaturePersons, signaturePerson =>
      _.isEmpty(_.filter(signaturePerson, field => field.error)));
  }

  @computed get getSummary() {
    return this.businessList.length || 0;
  }

  @computed get checkStepsStatus() {
    return _.every(this.xmlSubStepsStatus, key => key === true);
  }

  @action
  setBoxFolderLink = (link) => {
    this.boxFolderLink = link;
  }

  @action
  updateStatusFlag = (stepDetails, key, value) => {
    this[stepDetails][key].isValid = value;
  };

  @action
  filerInfoChange = (e, { name, value }) => {
    this.onFieldChange('formFilerInfo', name, value);
  };

  @action
  issuerInfoChange = (e, { name, value }) => {
    this.onFieldChange('formIssuerInfo', name, value);
  };

  @action
  verifyDateIncorporation = (values) => {
    this.onFieldChange('formIssuerInfo', 'dateIncorporation', values.formattedValue);
  }

  @action
  offeringInfoChange = (e, { name, value }) => {
    this.onFieldChange('formOfferingInfo', name, value);
  };

  @action
  verifyDeadlineDate = (date) => {
    this.onFieldChange('formOfferingInfo', 'deadlineDate', date.formattedValue);
  };

  @action
  annualInfoChange = (e, { name, value }) => {
    this.onFieldChange('formAnnualInfo', name, value);
  };

  @action
  signatureInfoChange = (e, { name, value }) => {
    this.onFieldSigChange(name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFilerInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      _.mapValues(this[form].fields, f => f.value),
      _.mapValues(this[form].fields, f => f.rule),
      _.mapValues(this[form].fields, f => f.customErrors),
    );
    this[form].meta.isValid = validation.passes();
    this[form].meta.isDirty = true;
    this[form].fields[field].error = validation.errors.first(field);
  };

  @action
  onFieldSigChange = (field, value) => {
    this.formSignatureInfo.fields[field].value = value;
    const newSigInfo = {
      issuer: this.formSignatureInfo.fields.issuer,
      issuerSignature: this.formSignatureInfo.fields.issuerSignature,
      issuerTitle: this.formSignatureInfo.fields.issuerTitle,
    };
    const validation = new Validator(
      _.mapValues(newSigInfo, f => f.value),
      _.mapValues(newSigInfo, f => f.rule),
      _.mapValues(newSigInfo, f => f.customErrors),
    );

    this.formSignatureInfo.meta.isValid = validation.passes();
    this.formSignatureInfo.meta.isDirty = true;
    this.formSignatureInfo.fields[field].error = validation.errors.first(field);
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
    this.formDocumentInfo.documentList = list;
  }

  @action
  setDocument(name, value) {
    /*eslint-disable*/
    _.forEach(this.formDocumentInfo.documentList, (document) => {
      if (document.name === name) {
        document.checked = value;
      }
    });
  }

  @action
  toggleRequiredFiles(key, isDirtyUpdate) {
    _.filter(this.formDocumentInfo.documentList, document => document.name === key)[0].checked =
      !_.filter(this.formDocumentInfo.documentList, document => document.name === key)[0].checked;

    if (_.filter(this.formDocumentInfo.documentList, document => document.name === key)[0].checked) {
      if (isDirtyUpdate) {
        this.formDocumentInfo.meta.isDirty = true;
      }
      this.removeXmlError('documentListError');
    }
  }

  @action
  setOfferingId(id) {
    this.offeringId = id;
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

  @action
  setFiler(filerInformation) {
    this.formFilerInfo.fields = filerInformation;
  }

  @action
  setFilerInfo(field, value) {
    this.formFilerInfo.fields[field].value = value;
  }

  @action
  setFilerError(field, error) {
    this.formFilerInfo.fields[field].error = error;
  }

  @action
  clearFiler() {
    this.formFilerInfo = {
      fields: { ...FILER_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
    };
  }

  @action
  togglefilerCheckbox(name) {
    this.formFilerInfo.fields[name].value = !this.formFilerInfo.fields[name].value;
  }

  @action
  setIssuer(issuerInformation) {
    this.formIssuerInfo.fields = issuerInformation;
  }

  @action
  setIssuerInfo(field, value) {
    this.formIssuerInfo.fields[field].value = value;
  }

  @action
  setIssuerError(field, error) {
    this.formIssuerInfo.fields[field].error = error;
  }

  @action
  clearIssuer() {
    this.formIssuerInfo = {
      fields: { ...ISSUER_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
    };
  }

  @action
  setOffering(offeringInformation) {
    this.formOfferingInfo.fields = offeringInformation;
  }

  @action
  setOfferingInfo(field, value) {
    this.formOfferingInfo.fields[field].value = value;
  }

  @action
  setOfferingError(field, error) {
    this.formOfferingInfo.fields[field].error = error;
  }

  @action
  clearOffering() {
    this.formOfferingInfo = {
      fields: { ...OFFERING_INFORMATION }, meta: { isValid: false, error: '', isDirty: false },
    };
  }

  @action
  setAnnualReport(newAnnualReport) {
    this.formAnnualInfo.fields = newAnnualReport;
  }

  @action
  setAnnualReportInfo(field, value) {
    this.formAnnualInfo.fields[field].value = value;
  }

  @action
  setAnnualReportError(field, error) {
    this.formAnnualInfo.fields[field].error = error;
  }

  @action
  clearAnnualReport() {
    this.formAnnualInfo = {
      fields: { ...ANNUAL_REPORT_REQUIREMENTS }, meta: { isValid: false, error: '', isDirty: false },
    };
  }

  @action
  setSignature(signature) {
    this.formSignatureInfo.fields = signature;
  }

  @action
  setSignatureInfo(field, value) {
    this.formSignatureInfo.fields[field].value = value;
  }

  @action
  setSignatureError(field, error) {
    this.formSignatureInfo.fields[field].error = error;
  }

  @action
  clearSignature() {
    this.formSignatureInfo = {
      fields: { ...SIGNATURE }, meta: { isValid: false, error: '', isDirty: false },
    };
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
  changePersonalSignature(field, id, value, isDirtyUpdate) {
    _.filter(this.formSignatureInfo.fields.signaturePersons, person => person.id === id)[0][field].value = value;

    let fieldValue = value;
    let fieldRule = _.filter(this.formSignatureInfo.fields.signaturePersons, person => person.id === id)[0][field].rule;
    let fieldCustomError = _.filter(this.formSignatureInfo.fields.signaturePersons, person => person.id === id)[0][field].customErrors;

    const validation = new Validator(
      fieldValue,
      fieldRule,
      fieldCustomError,
    );

    validation.passes();
    if (isDirtyUpdate) {
      this.formSignatureInfo.meta.isDirty = true;
    }

    if (!fieldValue) {
      this.setPersonalSignatureError(field, id, validation.errors.first());
    } else {
      this.setPersonalSignatureError(field, id, '');
    }
  }

  @action
  setPersonalSignatureError(field, id, error) {
    _.filter(this.formSignatureInfo.fields.signaturePersons, person => person.id === id)[0][field].error = error;
  }

  @action
  setCountry(identifier, fields, name, value) {    
    this[identifier][fields][name].value = value;
  }

  @action
  setNewPersonalSignature(newSignatures) {
    this.formSignatureInfo.fields.signaturePersons = newSignatures;
  }

  @action
  deletePersonalSignature(id) {
    const { signaturePersons } = this.formSignatureInfo.fields;
    this.formSignatureInfo.fields.signaturePersons = _.filter(signaturePersons, person => person.id !== id);
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
  setXmlActiveTabName(name) {
    this.xmlActiveTabName = name;
  }

  @action
  setXmlSubStepsStatus(stepname, isValue) {
    this.xmlSubStepsStatus[stepname] = isValue;
  }

  @action
  clearXmlSubStepsStatus() {
    _.forEach(this.xmlSubStepsStatus, (value, key) => {
      this.xmlSubStepsStatus[key] = false;
    });
  }

  @action
  setXmlSubmissionTab(index, value) {
    this.xmlSubmissionTabs[index].errorClass = value;
  }

  @action
  clearXmlTabsValue() {
    _.forEach(this.xmlSubmissionTabs, (value, key) => {
      this.xmlSubmissionTabs[key].errorClass = '';
    });
  }

}
export default new BusinessStore();
