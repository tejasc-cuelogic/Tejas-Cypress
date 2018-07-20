import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';
import {
  EMPLOYMENT,
  INVESTOR_PROFILE,
  FINANCES,
  INVESTMENT_EXPERIENCE,
} from '../../../../constants/account';
import { updateInvestorProfileData } from '../../queries/account';
import { GqlClient as client } from '../../../../api/gqlApi';
import { DataFormatter, FormValidator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../index';

class InvestorProfileStore {
  @observable EMPLOYMENT_FORM = FormValidator.prepareFormObject(EMPLOYMENT);
  @observable INVESTOR_PROFILE_FORM = FormValidator.prepareFormObject(INVESTOR_PROFILE);
  @observable FINANCES_FORM = FormValidator.prepareFormObject(FINANCES);
  @observable INVESTMENT_EXPERIENCE = FormValidator.prepareFormObject(INVESTMENT_EXPERIENCE);
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
  employmentChange = (e, result) => {
    this.formChange(e, result, 'EMPLOYMENT_FORM');
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
    this.formChange(e, result, 'INVESTMENT_EXPERIENCE');
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

  @action
  updateInvestorProfileData = (currentStep) => {
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
    } else if (currentStep.form === 'INVESTMENT_EXPERIENCE') {
      let readyForRisksInvolvedValue = false;
      let liquiditySecurities = false;
      if (this.INVESTMENT_EXPERIENCE.fields.readyForRisksInvolved.value[0] === 'checked') {
        readyForRisksInvolvedValue = true;
      }
      if (this.INVESTMENT_EXPERIENCE.fields.readyInvestingInLimitedLiquiditySecurities.value[0] === 'checked') {
        liquiditySecurities = true;
      }
      formPayload = {
        investmentExperienceInfo: {
          investmentExperienceLevel:
          this.INVESTMENT_EXPERIENCE.fields.investmentExperienceLevel.value,
          readyForRisksInvolved: readyForRisksInvolvedValue,
          readyInvestingInLimitedLiquiditySecurities: liquiditySecurities,
        },
        // FormValidator.ExtractValues(this.INVESTMENT_EXPERIENCE.fields),
      };
    }
    this.submitForm(currentStep, formPayload);
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
          resolve();
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
        Object.keys(this.EMPLOYMENT_FORM.fields).map((f) => {
          this.EMPLOYMENT_FORM.fields[f].value = investorProfileData.employmentStatusInfo[f];
          return true;
        });
        FormValidator.onChange(this.EMPLOYMENT_FORM, '', '', false);
        Object.keys(this.FINANCES_FORM.fields).map((f) => {
          this.FINANCES_FORM.fields[f].value = investorProfileData.financialInfo[f];
          if (investorProfileData.financialInfo.directorShareHolderOfCompany !== null) {
            this.FINANCES_FORM.fields.checkbox1.value = 'iamadirector';
          } else {
            this.FINANCES_FORM.fields.checkbox1.value = [];
          }
          if (investorProfileData.financialInfo.employedOrAssoWithFINRAFirmName !== null) {
            this.FINANCES_FORM.fields.checkbox2.value = 'iamamember';
          } else {
            this.FINANCES_FORM.fields.checkbox2.value = [];
          }
          return true;
        });
        FormValidator.onChange(this.FINANCES_FORM, '', '', false);
        Object.keys(this.INVESTOR_PROFILE_FORM.fields).map((f) => {
          this.INVESTOR_PROFILE_FORM.fields[f].value =
            investorProfileData.investorProfileType;
          return true;
        });
        FormValidator.onChange(this.INVESTOR_PROFILE_FORM, '', '', false);
        Object.keys(this.INVESTMENT_EXPERIENCE.fields).map((f) => {
          if (f !== 'readyInvestingInLimitedLiquiditySecurities' && f !== 'readyForRisksInvolved') {
            this.INVESTMENT_EXPERIENCE.fields[f].value =
            investorProfileData.investmentExperienceInfo[f];
          } else if (f === 'readyInvestingInLimitedLiquiditySecurities' &&
          investorProfileData.investmentExperienceInfo[f]) {
            this.INVESTMENT_EXPERIENCE.fields.readyInvestingInLimitedLiquiditySecurities.value = 'checked';
          } else if (f === 'readyForRisksInvolved' &&
          investorProfileData.investmentExperienceInfo[f]) {
            this.INVESTMENT_EXPERIENCE.fields.readyForRisksInvolved.value = 'checked';
          }
          return true;
        });
        FormValidator.onChange(this.INVESTMENT_EXPERIENCE, '', '', false);

        if (!this.EMPLOYMENT_FORM.meta.isValid) {
          this.setStepToBeRendered(0);
        } else if (!this.INVESTOR_PROFILE_FORM.meta.isValid) {
          this.setStepToBeRendered(1);
        } else if (!this.FINANCES_FORM.meta.isValid) {
          this.setStepToBeRendered(2);
        } else if (!this.INVESTMENT_EXPERIENCE.meta.isValid) {
          this.setStepToBeRendered(3);
        } else {
          this.setStepToBeRendered(3);
        }
      }
    }
  }
}

export default new InvestorProfileStore();
