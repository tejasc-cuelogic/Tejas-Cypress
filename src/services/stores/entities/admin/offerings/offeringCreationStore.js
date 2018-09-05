import { observable, action } from 'mobx';
import { COMPANY_LAUNCH, SIGNED_LEGAL_DOCS, KEY_TERMS, OFFERING_OVERVIEW, OFFERING_HIGHLIGHTS, OFFERING_COMPANY, COMPANY_HISTORY } from '../../../../constants/admin/offerings';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class OfferingCreationStore {
  @observable KEY_TERMS_FRM = Validator.prepareFormObject(KEY_TERMS);
  @observable OFFERING_OVERVIEW_FRM = Validator.prepareFormObject(OFFERING_OVERVIEW);
  @observable OFFERING_HIGHLIGHTS_FRM = Validator.prepareFormObject(OFFERING_HIGHLIGHTS);
  @observable OFFERING_COMPANY_FRM = Validator.prepareFormObject(OFFERING_COMPANY);
  @observable COMPANY_HISTORY_FRM = Validator.prepareFormObject(COMPANY_HISTORY);
  @observable SIGNED_LEGAL_DOCS_FRM = Validator.prepareFormObject(SIGNED_LEGAL_DOCS);
  @observable COMPANY_LAUNCH_FRM = Validator.prepareFormObject(COMPANY_LAUNCH);

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  formChangeWithIndex = (e, result, form, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result), 'data', index,
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
  maskChangeWithIndex = (values, form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: values.floatValue }, 'data', index,
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

  getMetaData = (metaData) => {
    const metaDataMapping = {
      OFFERING_HIGHLIGHTS_FRM: OFFERING_HIGHLIGHTS,
      COMPANY_HISTORY_FRM: COMPANY_HISTORY,
    };
    return metaDataMapping[metaData];
  }

  @action
  addMore = (formName) => {
    this[formName] = {
      ...this[formName],
      fields: {
        ...this[formName].fields,
        data: [
          ...this[formName].fields.data,
          this.getMetaData(formName).data[0],
        ],
      },
      meta: {
        ...this[formName].meta,
        isValid: false,
      },
    };
  }
}

export default new OfferingCreationStore();
