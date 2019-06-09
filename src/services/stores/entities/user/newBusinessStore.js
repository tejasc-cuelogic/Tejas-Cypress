import { observable, action, computed, toJS } from 'mobx';
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
    const data = toJS(Validator.ExtractValues(this.BUSINESS_APP_FRM.fields));
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
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'businessStreet', value: data.residentalStreet });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'city', value: data.city });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'state', value: data.state });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'zipCode', value: data.zipCode });
  };

  @action
  businessDetailsFiles = (fieldName, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.BUSINESS_DETAILS_FRM = Validator.onChange(
        this.BUSINESS_DETAILS_FRM,
        { name: fieldName, value: uploadedFile },
      );
    }
  }

  @action
  businessDetailsReset = (field) => {
    this.BUSINESS_DETAILS_FRM = Validator.onChange(this.BUSINESS_DETAILS_FRM, { name: field, value: '' });
  };

  @action
  performanceFiles = (fieldName, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.BUSINESS_PERF_FRM = Validator.onChange(
        this.BUSINESS_PERF_FRM,
        { name: fieldName, value: uploadedFile },
      );
    }
  }

  @action
  performanceReset = (field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(this.BUSINESS_PERF_FRM, { name: field, value: '' });
  };

  @action
  docuFiles = (fieldName, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.BUSINESS_DOC_FRM = Validator.onChange(
        this.BUSINESS_DOC_FRM,
        { name: fieldName, value: uploadedFile },
      );
    }
  }

  @action
  docuReset = (field) => {
    this.BUSINESS_DOC_FRM = Validator.onChange(this.BUSINESS_DOC_FRM, { name: field, value: '' });
  };
}

export default new NewBusinessStore();
