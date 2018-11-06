import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';
import {
  EMPLOYMENT,
  INVESTOR_PROFILE,
  FINANCES,
  INVESTMENT_EXPERIENCE,
  BROKERAGE_EMPLOYMENT,
  PUBLIC_COMPANY_REL,
} from '../../../../constants/account';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { updateInvestorProfileData } from '../../queries/account';
import { GqlClient as client } from '../../../../api/gqlApi';
import { DataFormatter, FormValidator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';

class InvestorProfileStore {
  @observable EMPLOYMENT_FORM = FormValidator.prepareFormObject(EMPLOYMENT, true);
  @observable BROKERAGE_EMPLOYMENT_FORM =
  FormValidator.prepareFormObject(BROKERAGE_EMPLOYMENT, true);
  @observable PUBLIC_COMPANY_REL_FORM =
  FormValidator.prepareFormObject(PUBLIC_COMPANY_REL, true);
  @observable INVESTOR_PROFILE_FORM = FormValidator.prepareFormObject(INVESTOR_PROFILE, true);
  @observable FINANCES_FORM = FormValidator.prepareFormObject(FINANCES);
  @observable INVESTMENT_EXP_FORM = FormValidator.prepareFormObject(INVESTMENT_EXPERIENCE, true);
  @observable chkboxTicked = null;
  @observable stepToBeRendered = 0;
  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  setchkBoxTicked = (fieldName) => {
    this.chkboxTicked = fieldName;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  employmentChange = (e, form, result) => {
    this.formChange(e, result, form);
  }

  @action
  investorProfileChange = (e, result) => {
    this.formChange(e, result, 'INVESTOR_PROFILE_FORM');
  }

  @action
  financesChange = (values, field) => {
    this.FINANCES_FORM = FormValidator.onChange(
      this.FINANCES_FORM,
      { name: field, value: values.floatValue },
    );
  }

  @action
  financesInputChange = (e, result) => {
    this.formChange(e, result, 'FINANCES_FORM');
  }

  @action
  experiencesChange = (e, result) => {
    this.formChange(e, result, 'INVESTMENT_EXP_FORM');
  }

  @computed
  get canSubmitFieldsForm() {
    if (this.chkboxTicked === 'checkbox1') {
      return !isEmpty(this.FINANCES_FORM.fields.directorShareHolderOfCompany.value);
    } else if (this.chkboxTicked === 'checkbox2') {
      return !isEmpty(this.FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value);
    }
    return false;
  }

  @action
  submitFieldsForm = () => {
    let name = '';
    let value = '';
    if (this.chkboxTicked === 'checkbox1') {
      name = 'checkbox1';
      value = 'iamadirector';
    } else {
      name = 'checkbox2';
      value = 'iamamember';
    }
    this.FINANCES_FORM = FormValidator.onChange(
      this.FINANCES_FORM,
      { name, value },
      'checkbox',
    );
  }

  @action
  resetData = (fieldName) => {
    this.FINANCES_FORM.fields[fieldName].value = [];
    if (fieldName === 'checkbox1') {
      this.FINANCES_FORM.fields.directorShareHolderOfCompany.value = '';
    } else {
      this.FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value = '';
    }
  }

  @computed
  get isValidInvestorProfileForm() {
    return this.EMPLOYMENT_FORM.meta.isValid && this.INVESTOR_PROFILE_FORM.meta.isValid
    && this.FINANCES_FORM.meta.isValid && this.INVESTMENT_EXP_FORM.meta.isValid;
  }

  @action
  updateInvestorProfileData = (currentStep) => {
    this[currentStep.form] = FormValidator.validateForm(this[currentStep.form], false, true);
    if (this[currentStep.form].meta.isValid) {
      let formPayload = '';
      if (currentStep.form === 'EMPLOYMENT_FORM') {
        formPayload =
          { employmentStatusInfo: FormValidator.ExtractValues(this.EMPLOYMENT_FORM.fields) };
      } else if (currentStep.form === 'INVESTOR_PROFILE_FORM') {
        formPayload =
        { investorProfileType: this.INVESTOR_PROFILE_FORM.fields.investorProfileType.value };
      } else if (currentStep.form === 'FINANCES_FORM') {
        formPayload = {
          financialInfo: {
            netWorth: this.FINANCES_FORM.fields.netWorth.value !== '' ? this.FINANCES_FORM.fields.netWorth.value : null,
            annualIncomeThirdLastYear: this.FINANCES_FORM.fields.annualIncomeThirdLastYear.value !== '' ? this.FINANCES_FORM.fields.annualIncomeThirdLastYear.value : null,
            annualIncomeLastYear:
            this.FINANCES_FORM.fields.annualIncomeLastYear.value !== '' ?
              this.FINANCES_FORM.fields.annualIncomeLastYear.value : null,
            annualIncomeCurrentYear:
              this.FINANCES_FORM.fields.annualIncomeCurrentYear.value !== '' ?
                this.FINANCES_FORM.fields.annualIncomeCurrentYear.value : null,
            directorShareHolderOfCompany: this.FINANCES_FORM.fields.directorShareHolderOfCompany.value !== '' ?
              this.FINANCES_FORM.fields.directorShareHolderOfCompany.value : null,
            employedOrAssoWithFINRAFirmName: this.FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value !== '' ?
              this.FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value : null,
          },
        };
      } else if (currentStep.form === 'INVESTMENT_EXP_FORM') {
        let readyForRisksInvolvedValue = false;
        let liquiditySecurities = false;
        if (this.INVESTMENT_EXP_FORM.fields.readyForRisksInvolved.value[0] === 'checked') {
          readyForRisksInvolvedValue = true;
        }
        if (this.INVESTMENT_EXP_FORM.fields.readyInvestingInLimitedLiquiditySecurities.value[0] === 'checked') {
          liquiditySecurities = true;
        }
        formPayload = {
          investmentExperienceInfo: {
            experienceLevel:
            this.INVESTMENT_EXP_FORM.fields.experienceLevel.value,
            readyForRisksInvolved: readyForRisksInvolvedValue,
            readyInvestingInLimitedLiquiditySecurities: liquiditySecurities,
          },
        };
      }
      formPayload.isPartialProfile = !this.isValidInvestorProfileForm;
      this.submitForm(currentStep, formPayload);
    }
  }

  @action
  submitForm = (currentStep, formPayload) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateInvestorProfileData,
          variables: formPayload,
        })
        .then(action(() => {
          Helper.toast('Investor profile updated successfully.', 'success');
          FormValidator.setIsDirty(this[currentStep.form], false);
          this.setStepToBeRendered(currentStep.stepToBeRendered);
        }))
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  populateData = (userData) => {
    if (!isEmpty(userData)) {
      const { investorProfileData } = userData;
      if (investorProfileData) {
        this.setFormData('EMPLOYMENT_FORM', investorProfileData);
        this.setFormData('FINANCES_FORM', investorProfileData);
        this.setFormData('INVESTOR_PROFILE_FORM', investorProfileData);
        this.setFormData('INVESTMENT_EXP_FORM', investorProfileData);
        const getProfileStep = AccCreationHelper.establishProfileSteps();
        if (!this.EMPLOYMENT_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.EMPLOYMENT_FORM);
        } else if (!this.INVESTOR_PROFILE_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.INVESTOR_PROFILE_FORM);
        } else if (!this.FINANCES_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.FINANCES_FORM);
        } else if (!this.INVESTMENT_EXP_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.INVESTMENT_EXP_FORM);
        } else {
          this.setStepToBeRendered(getProfileStep.INVESTMENT_EXP_FORM);
        }
      }
    }
  }

  @action
  setFormData = (form, investorProfileData) => {
    console.log(investorProfileData);
    Object.keys(this[form].fields).map((f) => {
      console.log(1);
      // switch (form) {
      // case 'EMPLOYMENT_FORM':
      //   if (investorProfileData.employment) {
      //     this.EMPLOYMENT_FORM.fields[f].value = investorProfileData.employment[f];
      //   }
      //   break;
      // case 'FINANCES_FORM':
      //   this.FINANCES_FORM.fields[f].value = investorProfileData.financialInfo[f];
      //   if (investorProfileData.financialInfo.directorShareHolderOfCompany !== null) {
      //     this.FINANCES_FORM.fields.checkbox1.value = 'iamadirector';
      //   } else {
      //     this.FINANCES_FORM.fields.checkbox1.value = [];
      //   }
      //   if (investorProfileData.financialInfo.employedOrAssoWithFINRAFirmName !== null) {
      //     this.FINANCES_FORM.fields.checkbox2.value = 'iamamember';
      //   } else {
      //     this.FINANCES_FORM.fields.checkbox2.value = [];
      //   }
      //   break;
      // case 'INVESTOR_PROFILE_FORM':
      //   if (!isNull(investorProfileData.investorProfileType)) {
      //     this.INVESTOR_PROFILE_FORM.fields[f].value =
      //     investorProfileData.investorProfileType;
      //   }
      //   break;
      // case 'INVESTMENT_EXP_FORM':
      //   if (f !== 'readyInvestingInLimitedLiquiditySecurities' && !== 'readyForRisksInvolved') {
      //     if (!isNull(investorProfileData.investmentExperienceInfo[f])) {
      //       this.INVESTMENT_EXP_FORM.fields[f].value =
      //       investorProfileData.investmentExperienceInfo[f];
      //     }
      //   } else if (f === 'readyInvestingInLimitedLiquiditySecurities' &&
      //   investorProfileData.investmentExperienceInfo[f]) {
      //     this.INVESTMENT_EXP_FORM.fields.readyInvestingInLimitedLiquiditySecurities.value =
      // 'checked';
      //   } else if (f === 'readyForRisksInvolved' &&
      //   investorProfileData.investmentExperienceInfo[f]) {
      //     this.INVESTMENT_EXP_FORM.fields.readyForRisksInvolved.value = 'checked';
      //   }
      //   break;
      // default:
      //   break;
      // }
      return this[form].fields[f];
    });
    FormValidator.onChange(this[form], '', '');
  }

  @action
  resetFormData(form) {
    const resettedForm = FormValidator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @action
  resetStoreData = () => {
    this.resetFormData('EMPLOYMENT_FORM');
    this.resetFormData('INVESTOR_PROFILE_FORM');
    this.resetFormData('FINANCES_FORM');
    this.resetFormData('INVESTMENT_EXP_FORM');
    this.stepToBeRendered = 0;
  }
}

export default new InvestorProfileStore();
