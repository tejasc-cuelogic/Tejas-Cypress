import { toJS, observable, action, computed } from 'mobx';
// import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
// import { GqlClient as client } from '../../services/graphqlCool';
import {
  BUSINESS_PRE_QUALIFICATION,
  BUSINESS_SIGNUP,
  BUSINESS_DETAILS,
  BUSINESS_PERF,
  BUSINESS_DOC,
  LENDIO_PRE_QUAL,
} from '../../constants/newBusiness';
import Helper from '../../helper/utility';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = { fields: { ...BUSINESS_PRE_QUALIFICATION }, meta: { isValid: false, error: '' } };
  @observable BUSINESS_ACCOUNT = { fields: { ...BUSINESS_SIGNUP }, meta: { isValid: false, error: '' } };
  @observable BUSINESS_DETAILS_FRM = { fields: { ...BUSINESS_DETAILS }, meta: { isValid: false, error: '' } };
  @observable BUSINESS_PERF_FRM = { fields: { ...BUSINESS_PERF }, meta: { isValid: false, error: '' } };
  @observable BUSINESS_DOC_FRM = { fields: { ...BUSINESS_DOC }, meta: { isValid: false, error: '' } };
  @observable LENDIO_QUAL_FRM = { fields: { ...LENDIO_PRE_QUAL }, meta: { isValid: false, error: '' } };
  @observable BUSINESS_APP_STATUS = '';

  @action
  lendioEleChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('LENDIO_QUAL_FRM', fieldName, fieldValue, type);
  };

  @action
  businessAppEleChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_APP_FRM', fieldName, fieldValue, type);
  };

  @action
  businessDetailsChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_DETAILS_FRM', fieldName, fieldValue, type);
  };

  @action
  businessPerfChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_PERF_FRM', fieldName, fieldValue, type);
  };

  @action
  businessDocChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_DOC_FRM', fieldName, fieldValue, type);
  };

  @action
  businessAccEleChange = (e, result) => {
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BUSINESS_ACCOUNT', fieldName, fieldValue, type);
  };

  @computed get canSubmitApp() {
    const notOkForms = ['BUSINESS_APP_FRM', 'BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    console.log(notOkForms);
    return notOkForms.length === 0;
  }

  @action
  onFieldChange = (currentForm, field, value, type) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      if (type === 'checkbox' || Array.isArray(toJS(this[form].fields[field].value))) {
        const index = this[form].fields[field].value.indexOf(value);
        if (index === -1) {
          this[form].fields[field].value.push(value);
        } else {
          this[form].fields[field].value.splice(index, 1);
        }
      } else {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };

  @action
  businessLendioPreQual = () => {
    const data = mapValues(this.LENDIO_QUAL_FRM.fields, f => f.value);
    console.log(data);
  }

  @action
  businessPreQualification = () => {
    const data = mapValues(this.BUSINESS_APP_FRM.fields, f => f.value);
    console.log(data);
    if (data.businessName === 'SUCCESS') {
      this.BUSINESS_APP_STATUS = 'success';
    } else {
      this.BUSINESS_APP_STATUS = 'failed';
    }
  }

  @action
  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.onFieldChange('BUSINESS_APP_FRM', 'businessStreet', data.residentalStreet);
    this.onFieldChange('BUSINESS_APP_FRM', 'city', data.city);
    this.onFieldChange('BUSINESS_APP_FRM', 'state', data.state);
    this.onFieldChange('BUSINESS_APP_FRM', 'zipCode', data.zipCode);
  };

  @action
  businessDetailsFiles = (name, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.onFieldChange('BUSINESS_DETAILS_FRM', name, uploadedFile);
    }
  }

  @action
  businessDetailsReset = (field) => {
    this.onFieldChange('BUSINESS_DETAILS_FRM', field, '');
  };

  @action
  performanceFiles = (name, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.onFieldChange('BUSINESS_PERF_FRM', name, uploadedFile);
    }
  }

  @action
  performanceReset = (field) => {
    this.onFieldChange('BUSINESS_PERF_FRM', field, '');
  };

  @action
  docuFiles = (name, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.onFieldChange('BUSINESS_DOC_FRM', name, uploadedFile);
    }
  }

  @action
  docuReset = (field) => {
    this.onFieldChange('BUSINESS_DOC_FRM', field, '');
  };
}

export default new NewBusinessStore();
