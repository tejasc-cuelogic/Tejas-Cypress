import { observable, action } from 'mobx';
import { ACCREDITATION_METHODS } from '../../../../constants/investmentLimit';
import { FormValidator } from '../../../../../helper';

export class AccreditationStore {
  @observable ACCREDITATION_FORM = FormValidator.prepareFormObject(ACCREDITATION_METHODS);

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  accreditationMethodChange = (e, result) => {
    this.formChange(e, result, 'ACCREDITATION_FORM');
  }
}
export default new AccreditationStore();
