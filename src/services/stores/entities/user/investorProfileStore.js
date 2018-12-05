import { observable, action, computed, toJS } from 'mobx';
import { isEmpty, map } from 'lodash';
import {
  EMPLOYMENT,
  FINANCES,
  INVESTMENT_EXPERIENCE,
  BROKERAGE_EMPLOYMENT,
  PUBLIC_COMPANY_REL,
  INVESTOR_PROFILE_FULL_META,
} from '../../../../constants/account';
import AccCreationHelper from '../../../../modules/private/investor/accountSetup/containers/accountCreation/helper';
import { updateInvestorProfileData } from '../../queries/account';
import { GqlClient as client } from '../../../../api/gqlApi';
import { DataFormatter, FormValidator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore, userStore, userDetailsStore } from '../../index';

class InvestorProfileStore {
  @observable EMPLOYMENT_FORM = FormValidator.prepareFormObject(EMPLOYMENT, true);
  @observable BROKERAGE_EMPLOYMENT_FORM =
    FormValidator.prepareFormObject(BROKERAGE_EMPLOYMENT, true);
  @observable PUBLIC_COMPANY_REL_FORM =
    FormValidator.prepareFormObject(PUBLIC_COMPANY_REL, true);
  @observable FINANCES_FORM = FormValidator.prepareFormObject(FINANCES, true);
  @observable INVESTMENT_EXP_FORM = FormValidator.prepareFormObject(INVESTMENT_EXPERIENCE, true);
  @observable INVESTOR_PROFILE_FULL =
    FormValidator.prepareFormObject(INVESTOR_PROFILE_FULL_META, true);
  @observable chkboxTicked = null;
  @observable stepToBeRendered = 0;
  @observable isInvestmentExperienceValid = true;
  @observable finishInvestorProfileLater = false;

  @action
  setFinishInvestorProfileLater = () => {
    this.finishInvestorProfileLater = true;
  }

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
    if (form === 'INVESTOR_PROFILE_FULL' && result && result.name === 'experienceLevel') {
      this.validateInvestmentExperience('INVESTOR_PROFILE_FULL');
    }
  }

  @action
  setInvestorDetailInfo = (investorProfileData) => {
    this.INVESTOR_PROFILE_FULL =
    FormValidator.prepareFormObject(INVESTOR_PROFILE_FULL_META, true);
    this.INVESTOR_PROFILE_FULL =
      FormValidator.setFormData(this.INVESTOR_PROFILE_FULL, investorProfileData);
    if (investorProfileData && investorProfileData.brokerageFirmName && investorProfileData.brokerageFirmName !== '' &&
      investorProfileData.brokerageFirmName !== 'false') {
      this.INVESTOR_PROFILE_FULL.fields.brokerageEmployment.value = 'yes';
    } else {
      this.INVESTOR_PROFILE_FULL.fields.brokerageFirmName.value = '';
      this.INVESTOR_PROFILE_FULL.fields.brokerageEmployment.value = 'no';
    }
    if (investorProfileData && investorProfileData.publicCompanyTicker && investorProfileData.publicCompanyTicker !== '' &&
      investorProfileData.publicCompanyTicker !== 'false') {
      this.INVESTOR_PROFILE_FULL.fields.publicCompanyRel.value = 'yes';
    } else {
      this.INVESTOR_PROFILE_FULL.fields.publicCompanyTicker.value = '';
      this.INVESTOR_PROFILE_FULL.fields.publicCompanyRel.value = 'no';
    }
    ['isRiskTaker', 'isComfortable'].map((field) => {
      if (investorProfileData && investorProfileData[field]) {
        this.INVESTOR_PROFILE_FULL.fields[field].value = investorProfileData[field] ? ['checked'] : [];
      }
      return false;
    });
    if (investorProfileData && investorProfileData.annualIncome) {
      ['annualIncomeThirdLastYear', 'annualIncomeLastYear', 'annualIncomeCurrentYear'].map((item, index) => {
        this.INVESTOR_PROFILE_FULL.fields[item].value =
          investorProfileData.annualIncome[index].income;
        return true;
      });
    }
    this.INVESTOR_PROFILE_FULL =
      FormValidator.validateForm(this.INVESTOR_PROFILE_FULL, false, false, false);
  }
  @action
  maskChange = (values, form, field) => {
    const fieldValue = values.floatValue;
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }
  @action
  employmentChange = (e, form, result) => {
    this.formChange(e, result, form);
  }

  @action
  investorProfileChange = (e, result) => {
    this.formChange(e, result, 'FINANCES_FORM');
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
    this.validateInvestmentExperience();
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
    return this.EMPLOYMENT_FORM.meta.isValid
      && this.FINANCES_FORM.meta.isValid && this.INVESTMENT_EXP_FORM.meta.isValid
      && this.BROKERAGE_EMPLOYMENT_FORM.meta.isValid && this.PUBLIC_COMPANY_REL_FORM.meta.isValid;
  }

  @action
  updateInvestorProfileData = currentStep => new Promise((res, rej) => {
    this[currentStep.form] = FormValidator.validateForm(this[currentStep.form], false, true);
    if (this[currentStep.form].meta.isValid) {
      let formPayload = '';
      if (currentStep.form === 'EMPLOYMENT_FORM') {
        formPayload =
          { employment: FormValidator.ExtractValues(this.EMPLOYMENT_FORM.fields) };
      } else if (currentStep.form === 'BROKERAGE_EMPLOYMENT_FORM') {
        const { fields } = this.BROKERAGE_EMPLOYMENT_FORM;
        if (fields.brokerageEmployment.value === 'no') {
          fields.brokerageFirmName.value = 'false';
        } else {
          fields.brokerageFirmName.value = fields.brokerageFirmName.value;
        }
        formPayload =
          { brokerageFirmName: fields.brokerageFirmName.value };
      } else if (currentStep.form === 'PUBLIC_COMPANY_REL_FORM') {
        const { fields } = this.PUBLIC_COMPANY_REL_FORM;
        if (fields.publicCompanyRel.value === 'no') {
          fields.publicCompanyTicker.value = 'false';
        } else {
          fields.publicCompanyTicker.value = fields.publicCompanyTicker.value;
        }
        formPayload =
          { publicCompanyTicker: fields.publicCompanyTicker.value };
      } else if (currentStep.form === 'FINANCES_FORM') {
        formPayload = {
          taxFilingAs: this.FINANCES_FORM.fields.investorProfileType.value,
          annualIncome: [{
            year: this.FINANCES_FORM.fields.annualIncomeThirdLastYear.year,
            income: this.FINANCES_FORM.fields.annualIncomeThirdLastYear.value,
          },
          {
            year: this.FINANCES_FORM.fields.annualIncomeLastYear.year,
            income: this.FINANCES_FORM.fields.annualIncomeLastYear.value,
          },
          {
            year: this.FINANCES_FORM.fields.annualIncomeCurrentYear.year,
            income: this.FINANCES_FORM.fields.annualIncomeCurrentYear.value,
          }],
          netWorth: this.FINANCES_FORM.fields.netWorth.value,
        };
      } else if (currentStep.form === 'INVESTMENT_EXP_FORM') {
        this.validateInvestmentExperience();
        const { fields } = this.INVESTMENT_EXP_FORM;
        formPayload = {
          experienceLevel: fields.experienceLevel.value,
          isComfortable: fields.isComfortable.value.length > 0,
          isRiskTaker: fields.isRiskTaker.value.length > 0,
        };
      }
      formPayload.isPartialProfile = !this.isValidInvestorProfileForm;
      if (formPayload.isPartialProfile === false && currentStep.form !== 'INVESTMENT_EXP_FORM') {
        formPayload.isPartialProfile = true;
      }
      if (currentStep.form === 'INVESTMENT_EXP_FORM' && this.isInvestmentExperienceValid) {
        this.submitForm(currentStep, formPayload).then(() => {
          res();
        })
          .catch(() => {
            rej();
          });
      } else if (currentStep.form !== 'INVESTMENT_EXP_FORM') {
        this.submitForm(currentStep, formPayload).then(() => {
          res();
        })
          .catch(() => {
            rej();
          });
      }
    }
  })

  @action
  updateInvestorEditProfileData = () => {
    const { fields } = this.INVESTOR_PROFILE_FULL;
    let formData = FormValidator.evaluateFormData(fields);
    const YearsList = Helper.getLastThreeYearsLabel();
    formData = {
      ...formData,
      brokerageFirmName: fields.brokerageEmployment.value === 'no' ? 'false' : formData.brokerageFirmName,
      publicCompanyTicker: fields.publicCompanyRel.value === 'no' ? 'false' : formData.publicCompanyTicker,
      annualIncome: map(formData.annualIncome, (income, key) => ({ year: YearsList[key], income })),
      isPartialProfile: false,
    };
    this.submitEditInvestorForm(formData);
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
          if (this.isValidInvestorProfileForm) {
            userDetailsStore.getUser(userStore.currentUser.sub);
          }
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
  submitEditInvestorForm = formPayload => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: updateInvestorProfileData,
        variables: formPayload,
      })
      .then(action(() => {
        Helper.toast('Investor profile updated successfully.', 'success');
        userDetailsStore.getUser(userStore.currentUser.sub);
        resolve();
      }))
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        reject(err);
      });
  });

  @action
  populateData = (userData) => {
    if (!isEmpty(userData)) {
      const { investorProfileData } = userData;
      if (investorProfileData) {
        this.setFormData('EMPLOYMENT_FORM', investorProfileData);
        this.setFormData('BROKERAGE_EMPLOYMENT_FORM', investorProfileData);
        this.setFormData('PUBLIC_COMPANY_REL_FORM', investorProfileData);
        this.setFormData('FINANCES_FORM', investorProfileData);
        this.setFormData('INVESTMENT_EXP_FORM', investorProfileData);
        const getProfileStep = AccCreationHelper.establishProfileSteps();
        if (!this.EMPLOYMENT_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.EMPLOYMENT_FORM);
        } else if (!this.BROKERAGE_EMPLOYMENT_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.BROKERAGE_EMPLOYMENT_FORM);
        } else if (!this.PUBLIC_COMPANY_REL_FORM.meta.isValid) {
          this.setStepToBeRendered(getProfileStep.PUBLIC_COMPANY_REL_FORM);
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
    Object.keys(this[form].fields).map((f) => {
      switch (form) {
        case 'EMPLOYMENT_FORM':
          if (investorProfileData.employment) {
            this.EMPLOYMENT_FORM.fields[f].value = investorProfileData.employment[f];
          }
          break;
        case 'BROKERAGE_EMPLOYMENT_FORM':
          if (investorProfileData.brokerageFirmName) {
            const { fields } = this.BROKERAGE_EMPLOYMENT_FORM;
            if (investorProfileData.brokerageFirmName !== 'false') {
              fields.brokerageFirmName.value = investorProfileData.brokerageFirmName;
            } else {
              fields.brokerageFirmName.value = '';
            }
            if (investorProfileData.brokerageFirmName && investorProfileData.brokerageFirmName !== '' &&
              investorProfileData.brokerageFirmName !== 'false') {
              fields.brokerageEmployment.value = 'yes';
            } else {
              fields.brokerageEmployment.value = 'no';
            }
          }
          break;
        case 'PUBLIC_COMPANY_REL_FORM':
          if (investorProfileData.publicCompanyTicker) {
            const { fields } = this.PUBLIC_COMPANY_REL_FORM;
            if (investorProfileData.publicCompanyTicker !== 'false') {
              fields.publicCompanyTicker.value = investorProfileData.publicCompanyTicker;
            } else {
              fields.publicCompanyTicker.value = '';
            }
            if (investorProfileData.publicCompanyTicker && investorProfileData.publicCompanyTicker !== '' &&
              investorProfileData.publicCompanyTicker !== 'false') {
              fields.publicCompanyRel.value = 'yes';
            } else {
              fields.publicCompanyRel.value = 'no';
            }
          }
          break;
        case 'INVESTMENT_EXP_FORM':
          if (investorProfileData.experienceLevel) {
            const { fields } = this.INVESTMENT_EXP_FORM;
            fields.experienceLevel.value = investorProfileData.experienceLevel;
          }
          if (investorProfileData.isRiskTaker) {
            const { fields } = this.INVESTMENT_EXP_FORM;
            if ((Array.isArray(toJS(fields.isRiskTaker.value)) &&
              fields.isRiskTaker.value.length === 0)) {
              fields.isRiskTaker.value.push('checked');
            }
          } else {
            const { fields } = this.INVESTMENT_EXP_FORM;
            fields.isRiskTaker.value = [];
          }
          if (investorProfileData.isComfortable) {
            const { fields } = this.INVESTMENT_EXP_FORM;
            if ((Array.isArray(toJS(fields.isComfortable.value)) &&
              fields.isComfortable.value.length === 0)) {
              fields.isComfortable.value.push('checked');
            }
          } else {
            const { fields } = this.INVESTMENT_EXP_FORM;
            fields.isComfortable.value = [];
          }
          break;
        case 'FINANCES_FORM':
          this.FINANCES_FORM.fields.netWorth.value = investorProfileData.netWorth;
          this.FINANCES_FORM.fields.investorProfileType.value =
            investorProfileData.taxFilingAs;
          if (investorProfileData.annualIncome) {
            ['annualIncomeThirdLastYear', 'annualIncomeLastYear', 'annualIncomeCurrentYear'].map((item, index) => {
              this.FINANCES_FORM.fields[item].value =
                investorProfileData.annualIncome[index].income;
              return true;
            });
          }
          break;
        default:
          break;
      }
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
    this.resetFormData('BROKERAGE_EMPLOYMENT_FORM');
    this.resetFormData('PUBLIC_COMPANY_REL_FORM');
    this.resetFormData('FINANCES_FORM');
    this.resetFormData('INVESTMENT_EXP_FORM');
    this.stepToBeRendered = 0;
  }

  @action
  validateInvestmentExperience = (form) => {
    const { isComfortable, isRiskTaker, experienceLevel } = form ?
      this.INVESTOR_PROFILE_FULL.fields : this.INVESTMENT_EXP_FORM.fields;
    if ((Array.isArray(toJS(isComfortable.value)) && isComfortable.value.length === 0) ||
      (Array.isArray(toJS(isRiskTaker.value)) && isRiskTaker.value.length === 0) ||
      (experienceLevel.value === 'NONE' || experienceLevel.value === 'SOME')
    ) {
      this.isInvestmentExperienceValid = false;
    } else {
      this.isInvestmentExperienceValid = true;
    }
  }

  @action
  experiencesEditChange = (e, result) => {
    this.formChange(e, result, 'INVESTOR_PROFILE_FULL');
    this.validateInvestmentExperience('INVESTOR_PROFILE_FULL');
  }

  @action
  setIsInvestmentExperienceValidStatus = (booleanValue) => {
    this.isInvestmentExperienceValid = booleanValue;
  }
}

export default new InvestorProfileStore();
