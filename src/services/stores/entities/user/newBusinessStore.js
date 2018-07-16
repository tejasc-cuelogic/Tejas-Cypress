import { observable, action, computed } from 'mobx';
import { FormValidator as Validator } from '../../../../helper';
// import { GqlClient as client } from '../../services/graphqlCool';
import {
  BUSINESS_PRE_QUALIFICATION,
  BUSINESS_SIGNUP,
  BUSINESS_DETAILS,
  BUSINESS_PERF,
  BUSINESS_DOC,
  LENDIO_PRE_QUAL,
} from '../../../constants/newBusiness';
import Helper from '../../../../helper/utility';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
  @observable BUSINESS_ACCOUNT =Validator.prepareFormObject(BUSINESS_SIGNUP);
  @observable BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
  @observable BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
  @observable BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
  @observable LENDIO_QUAL_FRM = Validator.prepareFormObject(LENDIO_PRE_QUAL);
  @observable BUSINESS_APP_STATUS = '';

  @action
  businessAccEleChange = (e, result) => {
    this.LOGIN_FRM = Validator.onChange(this.LOGIN_FRM, Validator.pullValues(e, result));
  };

  @action
  preQualifInfoChange = (values, field) => {
    this.BUSINESS_APP_FRM = Validator.onChange(
      this.BUSINESS_APP_FRM,
      { name: field, value: values.floatValue },
    );
  }

  @action
  businessDocChange = (e, res) => {
    this.BUSINESS_ACCOUNT = Validator.onChange(this.BUSINESS_ACCOUNT, Validator.pullValues(e, res));
  };

  @action
  businessPerfChange = (e, res) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(
      this.BUSINESS_PERF_FRM,
      Validator.pullValues(e, res),
    );
  };

  @action
  businessDetailsChange = (e, res) => {
    this.BUSINESS_DETAILS_FRM = Validator.onChange(
      this.BUSINESS_DETAILS_FRM,
      Validator.pullValues(e, res),
    );
  };

  @action
  businessAppEleChange = (e, res) => {
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, Validator.pullValues(e, res));
  };

  @action
  lendioEleChange = (e, res) => {
    this.LENDIO_QUAL_FRM = Validator.onChange(this.LENDIO_QUAL_FRM, Validator.pullValues(e, res));
  };

  @computed get canSubmitApp() {
    const notOkForms = ['BUSINESS_APP_FRM', 'BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    return notOkForms.length === 0;
  }

  @action
  businessLendioPreQual = () => {
    const data = Validator.ExtractValues(this.LENDIO_QUAL_FRM.fields);
    console.log(data);
  }

  @action
  businessPreQualification = () => {
    const data = Validator.ExtractValues(this.BUSINESS_APP_FRM.fields);
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
