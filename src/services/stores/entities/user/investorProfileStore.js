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
  get canSubmitFieldsForm() {
    if (this.chkboxTicked === 'checkbox1') {
      return !isEmpty(this.FINANCES.fields.companyName.value);
    } else if (this.chkboxTicked === 'checkbox2') {
      return !isEmpty(this.FINANCES.fields.firmName.value);
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
    this.FINANCES = FormValidator.onChange(
      this.FINANCES,
      { name, value },
      'checkbox',
    );
  }

  @action
  resetData = (fieldName) => {
    this.FINANCES.fields[fieldName].value = [];
    if (fieldName === 'checkbox1') {
      this.FINANCES.fields.companyName.value = '';
    } else {
      this.FINANCES.fields.firmName.value = '';
    }
  }
}

export default new InvestorProfileStore();
