import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';
import {
  EMPLOYMENT,
  INVESTOR_PROFILE,
  FINANCES,
  INVESTMENT_EXPERIENCE,
} from '../../../../constants/account';
import { FormValidator } from '../../../../helper';

class InvestorProfileStore {
  @observable EMPLOYMENT_FORM = FormValidator.prepareFormObject(EMPLOYMENT);
  @observable INVESTOR_PROFILE_FORM = FormValidator.prepareFormObject(INVESTOR_PROFILE);
  @observable FINANCES = FormValidator.prepareFormObject(FINANCES);
  @observable INVESTMENT_EXPERIENCE = FormValidator.prepareFormObject(INVESTMENT_EXPERIENCE);
  @observable chkboxTicked = null;

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
  financesChange = (e, result) => {
    this.formChange(e, result, 'FINANCES');
  }

  @action
  experiencesChange = (e, result) => {
    this.formChange(e, result, 'INVESTMENT_EXPERIENCE');
  }

  @computed
  get isValidEmployment() {
    const { employmentStatus, employer, currentPosition } = this.EMPLOYMENT_FORM.fields;
    return isEmpty(employmentStatus.error) && isEmpty(employer.error) &&
      isEmpty(currentPosition.error);
  }

  @computed
  get isValidInvestorProfile() {
    const { profileType } = this.INVESTOR_PROFILE_FORM.fields;
    return isEmpty(profileType.error);
  }

  @computed
  get isValidFinances() {
    const {
      netWorth,
      annualIncome1,
      annualIncome2,
      annualIncome3,
      checkbox1,
      checkbox2,
      companyName,
      firmName,
    } = this.FINANCES.fields;
    return isEmpty(netWorth.error) && isEmpty(annualIncome1.error) && isEmpty(annualIncome2.error)
    && isEmpty(annualIncome3.error) && isEmpty(checkbox1.error) && isEmpty(checkbox2.error)
    && isEmpty(companyName.error) && isEmpty(firmName.error);
  }

  @computed
  get isValidExperience() {
    const { experienceInfo, checkbox1, checkbox2 } = this.INVESTMENT_EXPERIENCE.fields;
    return isEmpty(experienceInfo.error) && isEmpty(checkbox1.error) && isEmpty(checkbox2.error);
  }
}

export default new InvestorProfileStore();
