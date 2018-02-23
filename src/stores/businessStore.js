import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import {
  DOCFILE_TYPES,
  FORM_VALUES,
  FILER_INFORMATION,
  ISSUER_INFORMATION,
  OFFERING_INFORMATION,
  ANNUAL_REPORT_DISCLOSURE_REQUIREMENTS,
  SIGNATURE,
} from './../constants/business';

export class BusinessStore {
  formValues = [...FORM_VALUES];

  @observable
  offeringId = '';

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
  annualReportDisclosureRequirements = { ...ANNUAL_REPORT_DISCLOSURE_REQUIREMENTS }

  @observable
  signature = { ...SIGNATURE }

  @observable
  documentList = { ...DOCFILE_TYPES };

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
  setFilerInfo(field, value) {
    this.filerInformation[field].value = value;
  }

  @action
  setIssuerInfo(field, value) {
    this.issuerInformation[field].value = value;
  }

  @action
  setOfferingInfo(field, value) {
    this.offeringInformation[field].value = value;
  }

  @action
  setAnnualReportInfo(field, value) {
    this.annualReportDisclosureRequirements[field].value = value;
  }

  @action
  setSignatureInfo(field, value) {
    this.signature[field].value = value;
  }

  @action
  setCountry(value) {
    this.annualReportDisclosureRequirements.issueJurisdictionSecuritiesOffering.value = value;
  }
}

export default new BusinessStore();
