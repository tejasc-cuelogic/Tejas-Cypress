import { observable, action } from 'mobx';
import {
  EMPLOYMENT,
  INVESTOR_PROFILE,
} from '../../../../constants/account';
import { FormValidator } from '../../../../helper';

class InvestorProfileStore {
  @observable EMPLOYMENT_FORM = FormValidator.prepareFormObject(EMPLOYMENT);
  @observable INVESTOR_PROFILE_FORM = FormValidator.prepareFormObject(INVESTOR_PROFILE);

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
}

export default new InvestorProfileStore();
