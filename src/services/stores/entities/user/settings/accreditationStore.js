import { observable, action, toJS } from 'mobx';
import { forEach } from 'lodash';
import { INCOME_EVIDENCE, ACCREDITATION_METHODS, VERIFICATION_REQUEST, INCOME_UPLOAD_DOCUMENTS, ASSETS_UPLOAD_DOCUMENTS, NET_WORTH, ENTITY_ACCREDITATION_METHODS, TRUST_ENTITY_ACCREDITATION } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { uiStore, userDetailsStore } from '../../../index';
import { updateAccreditation } from '../../../queries/accreditation';
import { userDetailsQuery } from '../../../queries/users';
import { fileUpload } from '../../../../actions';
import { ACCREDITATION_FILE_UPLOAD_ENUMS } from '../../../../constants/accreditation';

export class AccreditationStore {
  @observable ACCREDITATION_FORM = Validator.prepareFormObject(ACCREDITATION_METHODS);
  @observable ENTITY_ACCREDITATION_FORM =
  Validator.prepareFormObject(ENTITY_ACCREDITATION_METHODS);
  @observable INCOME_EVIDENCE_FORM = Validator.prepareFormObject(INCOME_EVIDENCE);
  @observable TRUST_ENTITY_ACCREDITATION_FRM =
  Validator.prepareFormObject(TRUST_ENTITY_ACCREDITATION);
  @observable VERIFICATION_REQUEST_FORM = Validator.prepareFormObject(VERIFICATION_REQUEST);
  @observable INCOME_UPLOAD_DOC_FORM = Validator.prepareFormObject(INCOME_UPLOAD_DOCUMENTS);
  @observable ASSETS_UPLOAD_DOC_FORM = Validator.prepareFormObject(ASSETS_UPLOAD_DOCUMENTS);
  @observable NET_WORTH_FORM = Validator.prepareFormObject(NET_WORTH);
  @observable stepToBeRendered = '';
  @observable removeFileIdsList = [];

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  accreditationMethodChange = (e, form, result) => {
    this[form] =
      Validator.onChange(this[form], Validator.pullValues(e, result));
  }

  @action
  incomeEvidenceChange = (e, result) => {
    this.INCOME_EVIDENCE_FORM =
    Validator.onChange(this.INCOME_EVIDENCE_FORM, Validator.pullValues(e, result));
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
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fileData.fileName },
    );
  }

  @action
  checkFormValid = (form, multiForm, showErrors) => {
    this[form] = Validator.validateForm(this[form], multiForm, showErrors, false);
  }

  getFileUploadEnum = field => ACCREDITATION_FILE_UPLOAD_ENUMS[field];

  @action
  setFileUploadData = (form, field, files) => {
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getFileUploadEnum(field);
        this.setFormFileArray(form, field, 'showLoader', true);
        fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR').then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(form, field, 'fileData', file);
            this.setFormFileArray(form, field, 'preSignedUrl', preSignedUrl);
            this.setFormFileArray(form, field, 'fileId', fileId);
            this.setFormFileArray(form, field, 'value', fileData.fileName);
            this.setFormFileArray(form, field, 'error', undefined);
            this.checkFormValid(form, false, false);
            this.setFormFileArray(form, field, 'showLoader', false);
          }).catch((error) => {
            this.setFormFileArray(form, field, 'showLoader', false);
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
          });
        }).catch((error) => {
          this.setFormFileArray(form, field, 'showLoader', false);
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        });
      });
    }
  }

  @action
  removeUploadedData = (form, field, index = null) => {
    let removeFileIds = '';
    if (index != null) {
      const fileId = this[form].fields[field].fileId.splice(index, 1);
      this[form].fields[field].value.splice(index, 1);
      removeFileIds = fileId;
    } else {
      const { fileId } = this[form].fields[field];
      removeFileIds = fileId;
      this.setFormFileArray(form, field, 'fileId', '');
      this.setFormFileArray(form, field, 'fileData', '');
      this.setFormFileArray(form, field, 'value', '');
      this.setFormFileArray(form, field, 'preSignedUrl', '');
    }
    this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
    this.setFormFileArray(form, field, 'error', undefined);
    this.setFormFileArray(form, field, 'showLoader', false);
    this.checkFormValid(form, false, false);
  }

  @action
  setFormFileArray = (formName, field, getField, value) => {
    this[formName].fields[field][getField] = value;
  }

  @action
  removeUploadedFiles = () => {
    const fileList = toJS(this.removeFileIdsList);
    if (fileList.length) {
      forEach(fileList, (fileId) => {
        fileUpload.removeUploadedData(fileId).then(() => {
        }).catch((error) => {
          uiStore.setErrors(error.message);
        });
      });
      this.removeFileIdsList = [];
    }
  }

  @action
  resetAccreditation = (form) => {
    Validator.resetFormData(form);
    this.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value = 'verificationrequest';
  }

  @action
  setAccreditationMethod = (value) => {
    this.ACCREDITATION_FORM =
        Validator.onChange(this.ACCREDITATION_FORM, { name: 'accreditationMethods', value });
  }

  @action
  updateAccreditation = (form, accountId, accountType) => {
    uiStore.setProgress();
    const userAccreditationDetails = Validator.evaluateFormData(this[form].fields);
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: updateAccreditation,
          variables: {
            id: userDetailsStore.currentUserId,
            accountId,
            accountType,
            userAccreditationDetails,
          },
          refetchQueries: [{
            query: userDetailsQuery,
            variables: {
              userId: userDetailsStore.currentUserId,
            },
          }],
        })
        .then(() => resolve())
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => uiStore.setProgress(false));
    });
  }
}
export default new AccreditationStore();
