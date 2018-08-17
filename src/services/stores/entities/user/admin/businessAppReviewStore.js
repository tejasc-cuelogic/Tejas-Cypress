import { observable, action } from 'mobx';
import { OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class BusinessAppReviewStore {
  @observable OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);
  @observable MANAGERS_FRM = Validator.prepareFormObject(MANAGERS);
  @observable JUSTIFICATIONS_FRM = Validator.prepareFormObject(JUSTIFICATIONS);
  @observable DOCUMENTATION_FRM = Validator.prepareFormObject(DOCUMENTATION);
  @observable PROJECTIONS_FRM = Validator.prepareFormObject(PROJECTIONS);
  @observable BUSINESS_PLAN_FRM = Validator.prepareFormObject(BUSINESS_PLAN);
  @observable justificationConfirmModal = false;
  @observable removeJustificationIndex = null;

  @action
  toggleJustificationConfirmModal(index) {
    this.justificationConfirmModal = !this.justificationConfirmModal;
    this.removeJustificationIndex = this.justificationConfirmModal ? index : null;
  }

  @action
  addMoreCriticalPoint = () => {
    this.OVERVIEW_FRM = {
      ...this.OVERVIEW_FRM,
      fields: {
        ...this.OVERVIEW_FRM.fields,
        overview: [
          ...this.OVERVIEW_FRM.fields.overview,
          OVERVIEW.overview[0],
        ],
      },
      meta: {
        ...this.OVERVIEW_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  overviewEleChange = (e, result, index) => {
    this.OVERVIEW_FRM = Validator
      .onArrayFieldChange(this.OVERVIEW_FRM, Validator.pullValues(e, result), 'overview', index);
  };

  @action
  addJustification = () => {
    this.JUSTIFICATIONS_FRM = {
      ...this.JUSTIFICATIONS_FRM,
      fields: {
        ...this.JUSTIFICATIONS_FRM.fields,
        justifications: [
          ...this.JUSTIFICATIONS_FRM.fields.justifications,
          JUSTIFICATIONS.justifications[0],
        ],
      },
      meta: {
        ...this.JUSTIFICATIONS_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  removeJustification() {
    this.JUSTIFICATIONS_FRM.fields.justifications.splice(this.removeJustificationIndex, 1);
    this.justificationConfirmModal = !this.justificationConfirmModal;
    this.removeJustificationIndex = null;
  }

  @action
  managerEleChange = (e, result) => {
    this.MANAGERS_FRM =
      Validator.onChange(this.MANAGERS_FRM, Validator.pullValues(e, result));
  };

  @action
  justificationEleChange = (e, result, index) => {
    this.JUSTIFICATIONS_FRM = Validator
      .onArrayFieldChange(this.JUSTIFICATIONS_FRM, Validator.pullValues(e, result), 'justifications', index);
  }

  @action
  documentationEleChange = (e, result) => {
    this.DOCUMENTATION_FRM =
      Validator.onChange(this.DOCUMENTATION_FRM, Validator.pullValues(e, result));
  };

  @action
  projectionsEleChange = (e, result) => {
    this.PROJECTIONS_FRM =
      Validator.onChange(this.PROJECTIONS_FRM, Validator.pullValues(e, result));
  };

  @action
  businessPlanEleChange = (e, result) => {
    this.BUSINESS_PLAN_FRM =
      Validator.onChange(this.BUSINESS_PLAN_FRM, Validator.pullValues(e, result));
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
export default new BusinessAppReviewStore();
