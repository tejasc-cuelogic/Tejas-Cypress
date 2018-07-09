import { observable, action } from 'mobx';
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

  @action
  employmentChange = (e, result) => {
    this.EMPLOYMENT_FORM = FormValidator.onChange(
      this.EMPLOYMENT_FORM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  investorProfileChange = (e, result) => {
    this.INVESTOR_PROFILE_FORM = FormValidator.onChange(
      this.INVESTOR_PROFILE_FORM,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  financesChange = (e, result) => {
    this.FINANCES = FormValidator.onChange(
      this.FINANCES,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  experiencesChange = (e, result) => {
    this.INVESTMENT_EXPERIENCE = FormValidator.onChange(
      this.INVESTMENT_EXPERIENCE,
      FormValidator.pullValues(e, result),
    );
  }
}

export default new InvestorProfileStore();
