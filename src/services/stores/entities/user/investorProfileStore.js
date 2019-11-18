import { decorate, action, observable, runInAction, computed } from 'mobx';
import { isEmpty, isUndefined, intersection } from 'lodash';
import { updateInvestorProfileData } from '../../queries/account';
import { EMPLOYMENT_STATUS, BROKERAGE_EMPLOYMENT, PUBLIC_COMPANY_REL, FINANCES, INVESTOR_PROFILE_FULL_META, INVESTMENT_EXPERIENCE } from '../../../../constants/account';
import { FormValidator as Validator } from '../../../../helper';
import { userDetailsStore } from '../../index';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

export class InvestorProfileStore extends DataModelStore {
  constructor() {
    super({
      updateInvestorProfileData,
    });
  }

  invProfileForms = ['EMPLOYMENT_STATUS_FRM', 'BROKERAGE_EMPLOYMENT_FRM', 'PUBLIC_COMPANY_REL_FRM', 'FINANCIAL_INFO_FRM']

  EMPLOYMENT_STATUS_FRM = Validator.prepareFormObject(EMPLOYMENT_STATUS, true);

  BROKERAGE_EMPLOYMENT_FRM =
    Validator.prepareFormObject(BROKERAGE_EMPLOYMENT, true);

  PUBLIC_COMPANY_REL_FRM =
    Validator.prepareFormObject(PUBLIC_COMPANY_REL, true);

  INVESTOR_PROFILE_FULL =
    Validator.prepareFormObject(INVESTOR_PROFILE_FULL_META, true);


  FINANCIAL_INFO_FRM = Validator.prepareFormObject(FINANCES, true);

  INVESTMENT_EXP_FRM = Validator.prepareFormObject(INVESTMENT_EXPERIENCE, true);

  // eslint-disable-next-line func-names
  @action
  upsertInvestorProfile = async (currentStep) => {
    const { fields } = this[currentStep.form];
    this.validateForm(currentStep.form, false, true);
    if (this[currentStep.form].meta.isValid) {
      const { payLoad } = this.formPayLoad(fields);

      const res = await this.upsertInvestorProfileMutation(payLoad);

      if (res.data.createInvestorProfile.id) {
        runInAction(() => {
          Validator.setIsDirty(this[currentStep.form], false);
          userDetailsStore.setUserStatus(res.data.createInvestorProfile.status);
          userDetailsStore.mergeUserData('investorProfileData', payLoad, 'userPayLoad');
          if (currentStep.form === 'INVESTMENT_EXP_FRM') {
            userDetailsStore.mergeUserData(
              'investorProfileData',
              userDetailsStore.userPayLoad.investorProfileData, 'currentUser',
            );
          }
          this.setStepToBeRendered(currentStep.stepToBeRendered);
        });
      }
      return true;
    }
    return false;
  }

  formPayLoad = (fields) => {
    let payLoad = Validator.evaluateFormData(fields);
    payLoad.isPartialProfile = !!isUndefined(payLoad.isPartialProfile);

    if (intersection(['brokerageFirmName', 'publicCompanyTicker'], Object.keys(fields)).length > 0) {
      const { textField, radioField } = this.textRadioFieldData(fields);
      payLoad[textField] = fields[radioField].value === 'no' ? 'false' : fields[textField].value;
    }

    if (fields.annualIncomeCurrentYear) {
      payLoad = {
        ...payLoad,
        annualIncome: [
          {
            year: fields.annualIncomeCurrentYear.year,
            income: fields.annualIncomeCurrentYear.value,
          }],
      };
    }

    return { payLoad };
  }

  textRadioFieldData = (fields) => {
    const textField = Object.keys(fields).find(field => !fields[field].values);
    const radioField = Object.keys(fields).find(field => fields[field].values);
    return { textField, radioField };
  }

  get isInvestmentExperienceValid() {
    const { isComfortable, isRiskTaker, experienceLevel } = Validator.ExtractValues(this.INVESTMENT_EXP_FRM.fields);
    return isComfortable.length !== 0 && isRiskTaker.length !== 0 && experienceLevel !== 'NONE';
  }

  upsertInvestorProfileMutation = async (payLoad) => {
    const res = await this.executeMutation({
      mutation: 'updateInvestorProfileData', variables: payLoad,
    });
    return res;
  }

  setFormDataWithRadio = (data, form, textField, radioField) => {
    const { fields } = this[form];
    fields[textField].value = data[textField] !== 'false' ? data[textField] : '';
    fields[radioField].value = data[textField] && data[textField] !== ''
      && data[textField] !== 'false' ? 'yes' : data[textField] === null ? '' : 'no';
  }

  setInvestorDetailInfo = (data) => {
    this.INVESTOR_PROFILE_FULL = Validator.prepareFormObject(INVESTOR_PROFILE_FULL_META, true);
    [...this.invProfileForms, ...['INVESTMENT_EXP_FRM']].forEach((form) => {
      this.setFormData(form, data);
      this.INVESTOR_PROFILE_FULL.fields = { ...this.INVESTOR_PROFILE_FULL.fields, ...this[form].fields };
    });
    ['isRiskTaker', 'isComfortable'].map((field) => {
      if (data && data[field]) {
        this.INVESTOR_PROFILE_FULL.fields[field].value = data[field] ? ['checked'] : [];
      }
      return false;
    });
    Validator.onChange(this.INVESTOR_PROFILE_FULL, '', '', false);
  }

  updateInvestorEditProfileData = async () => {
    const { fields } = this.INVESTOR_PROFILE_FULL;
    const { payLoad } = this.formPayLoad(fields);
    const res = await this.upsertInvestorProfileMutation(payLoad);
    if (res.data.createInvestorProfile.id) {
      userDetailsStore.mergeUserData('investorProfileData', payLoad, 'currentUser');
    }
  }


  setFormData = (form, data) => {
    if (['BROKERAGE_EMPLOYMENT_FRM', 'PUBLIC_COMPANY_REL_FRM'].includes(form)) {
      const { textField, radioField } = this.textRadioFieldData(this[form].fields);
      this.setFormDataWithRadio(data, form, textField, radioField);
    } else if (form === 'FINANCIAL_INFO_FRM') {
      this[form] = Validator.setFormData(this[form], data);
      ['annualIncomeCurrentYear'].map((item, index) => {
        this[form].fields[item].value = data.annualIncome && data.annualIncome[index].income;
        return true;
      });
    } else {
      this[form] = Validator.setFormData(this[form], data);
    }
  }

  populateData = (userData) => {
    if (!isEmpty(userData)) {
      const { investorProfileData } = userData;
      if (investorProfileData) {
        // eslint-disable-next-line array-callback-return
        this.invProfileForms.forEach((form) => {
          this.setFormData(form, investorProfileData);
          Validator.onChange(this[form], '', '', false);
        });
        userDetailsStore.mergeUserData('investorProfileData', investorProfileData, 'userPayLoad');
        this.invProfileForms.some((form) => {
          const getProfileStep = AccCreationHelper.establishProfileSteps();
          if (!this[form].meta.isValid) {
            this.setStepToBeRendered(getProfileStep[form]);
            return true;
          }
          this.setStepToBeRendered(getProfileStep.INVESTMENT_EXP_FRM);
          return false;
        });
      }
    }
  }
}

decorate(InvestorProfileStore, {
  ...decorateDefault,
  EMPLOYMENT_STATUS_FRM: observable,
  BROKERAGE_EMPLOYMENT_FRM: observable,
  PUBLIC_COMPANY_REL_FRM: observable,
  FINANCIAL_INFO_FRM: observable,
  INVESTMENT_EXP_FRM: observable,
  INVESTOR_PROFILE_FULL: observable,
  setInvestorDetailInfo: action,
  populateData: action,
  setFormDataWithRadio: action,
  updateInvestorEditProfileData: action,
  setFormData: action,
  isInvestmentExperienceValid: computed,
});

export default new InvestorProfileStore();
