import { observable, action } from 'mobx';
import { KEY_TERMS, OFFERING_OVERVIEW } from '../../../../constants/admin/offerings';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class OfferingCreationStore {
  @observable KEY_TERMS_FRM = Validator.prepareFormObject(KEY_TERMS);
  @observable OFFERING_OVERVIEW_FRM = Validator.prepareFormObject(OFFERING_OVERVIEW);

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  maskChange = (values, form, field) => {
    const fieldValue = field === 'terminationDate' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }

  @action
  setFileUploadData = (form, field, files) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fileData.fileName },
    );
  }

  @action
  removeUploadedData = (form, field) => {
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: '' },
    );
  }
}

export default new OfferingCreationStore();
