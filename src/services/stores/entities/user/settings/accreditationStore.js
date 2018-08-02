import { observable, action } from 'mobx';
import { INCOME_EVIDENCE, ACCREDITATION_METHODS, VERIFICATION_REQUEST, INCOME_UPLOAD_DOCUMENTS, ASSETS_UPLOAD_DOCUMENTS, NET_WORTH } from '../../../../constants/investmentLimit';
import { FormValidator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class AccreditationStore {
  @observable ACCREDITATION_FORM = FormValidator.prepareFormObject(ACCREDITATION_METHODS);
  @observable INCOME_EVIDENCE_FORM = FormValidator.prepareFormObject(INCOME_EVIDENCE);
  @observable VERIFICATION_REQUEST_FORM = FormValidator.prepareFormObject(VERIFICATION_REQUEST);
  @observable INCOME_UPLOAD_DOC_FORM = FormValidator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
  @observable ASSETS_UPLOAD_DOC_FORM = FormValidator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
  @observable NET_WORTH_FORM = FormValidator.prepareFormObject(NET_WORTH);

  @action
  formChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  }

  @action
  accreditationMethodChange = (e, result) => {
    this.ACCREDITATION_FORM =
      FormValidator.onChange(this.ACCREDITATION_FORM, FormValidator.pullValues(e, result));
  }

  @action
  incomeEvidenceChange = (e, result) => {
    this.formChange(e, result, 'INCOME_EVIDENCE_FORM');
  }

  @action
  verificationFormChange = (e, result) => {
    this.formChange(e, result, 'VERIFICATION_REQUEST_FORM');
  }

  @action
  netWorthChange = (e, result) => {
    this.formChange(e, result, 'NET_WORTH_FORM');
  }

  @action
  setFileUploadData = (form, field, files) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: fileData.fileName },
    );
  }

  @action
  removeUploadedData = (form, field) => {
    this[form] = FormValidator.onChange(
      this[form],
      { name: field, value: '' },
    );
  }

  @action
  resetAccreditation = (form) => {
    FormValidator.resetFormData(form);
    this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value = 'verificationrequest';
  }
}
export default new AccreditationStore();
