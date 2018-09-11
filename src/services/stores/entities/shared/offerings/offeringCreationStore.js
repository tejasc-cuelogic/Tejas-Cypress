import { observable, action } from 'mobx';
import { GENERAL, LEADERSHIP, OFFERING_DETAILS, CLOSING_CONTITNGENCIES, CONTINGENCIES, ADD_NEW_CONTINGENCY, LAUNCH_CONTITNGENCIES, COMPANY_LAUNCH, SIGNED_LEGAL_DOCS, KEY_TERMS, OFFERING_OVERVIEW, OFFERING_HIGHLIGHTS, OFFERING_COMPANY, COMPANY_HISTORY } from '../../../../constants/admin/offerings';
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
  @observable LAUNCH_CONTITNGENCIES_FRM = Validator.prepareFormObject(LAUNCH_CONTITNGENCIES);
  @observable CLOSING_CONTITNGENCIES_FRM = Validator.prepareFormObject(CLOSING_CONTITNGENCIES);
  @observable ADD_NEW_CONTINGENCY_FRM = Validator.prepareFormObject(ADD_NEW_CONTINGENCY);
  @observable OFFERING_DETAILS_FRM = Validator.prepareFormObject(OFFERING_DETAILS);
  @observable LEADERSHIP_FRM = Validator.prepareFormObject(LEADERSHIP);
  @observable GENERAL_FRM = Validator.prepareFormObject(GENERAL);
  @observable contingencyFormSelected = undefined;
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;

  @action
  setContingencyFormSelected = (formName) => {
    this.contingencyFormSelected = formName;
  }

  @action
  toggleConfirmModal = (index, formName = null) => {
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = formName;
    this.removeIndex = this.confirmModal ? index : null;
  }

  @action
  removeData = (formName) => {
    this[formName].fields.data.splice(this.removeIndex, 1);
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    this.removeIndex = null;
  }

  @action
  formChange = (e, result, form, subForm = '', index) => {
    if (subForm) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
        subForm,
        index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }
  }

  @action
  formChangeWithIndex = (e, result, form, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result), 'data', index,
    );
  }

  @action
  maskChange = (values, form, field, subForm = '', index) => {
    const fieldValue = field === 'terminationDate' ? values.formattedValue : values.floatValue;
    if (subForm) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: values.floatValue }, subForm, index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fieldValue },
      );
    }
  }

  @action
  maskChangeWithIndex = (values, form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: values.floatValue }, 'data', index,
    );
  }

  @action
  setFileUploadData = (form, field, files, index = null) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fileData.fileName }, 'data', index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
    }
  }

  @action
  removeUploadedData = (form, field, index = null) => {
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: '' }, 'data', index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: '' },
      );
    }
  }

  getMetaData = (metaData) => {
    const metaDataMapping = {
      OFFERING_HIGHLIGHTS_FRM: OFFERING_HIGHLIGHTS,
      COMPANY_HISTORY_FRM: COMPANY_HISTORY,
      LAUNCH_CONTITNGENCIES_FRM: CONTINGENCIES,
      CLOSING_CONTITNGENCIES_FRM: CONTINGENCIES,
      LEADERSHIP_FRM: LEADERSHIP,
    };
    return metaDataMapping[metaData];
  }

  @action
  addMore = (formName, addFieldValues = false) => {
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
    if (addFieldValues) {
      const dataLength = this[formName].fields.data.length;
      this[formName].fields.data[dataLength - 1].name.value =
      this.ADD_NEW_CONTINGENCY_FRM.fields.name.value;
      this[formName].fields.data[dataLength - 1].acceptanceCriteria.value =
      this.ADD_NEW_CONTINGENCY_FRM.fields.acceptanceCriteria.value;
    }
    Validator.resetFormData(this.ADD_NEW_CONTINGENCY_FRM);
  }

  @action
  setAddressFields = (place, index) => {
    Validator.setAddressFieldsIndex(place, this.LEADERSHIP_FRM, 'data', index);
  }
}

export default new OfferingCreationStore();
