import { observable, action } from 'mobx';
import { USER_IDENTITY } from '../../../constants/user';
import { FormValidator as Validator } from '../../../../helper';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = Validator.prepareFormObject(USER_IDENTITY);

  @action
  personalInfoChange = (e, result) => {
    this.ID_VERIFICATION_FRM = Validator.onChange(
      this.ID_VERIFICATION_FRM,
      Validator.pullValues(e, result),
    );
  };

  @action
  dobChange = (date) => {
    this.ID_VERIFICATION_FRM = Validator.onChange(
      this.ID_VERIFICATION_FRM,
      { name: 'dateOfBirth', value: date },
    );
  };
}

export default new IdentityStore();
