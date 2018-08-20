import { observable, action, computed } from 'mobx';
import { OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN, CONTROL_PERSONS, SOURCES, USES } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class BusinessAppReviewStore {
  @observable OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);
  @observable MANAGERS_FRM = Validator.prepareFormObject(MANAGERS);
  @observable JUSTIFICATIONS_FRM = Validator.prepareFormObject(JUSTIFICATIONS);
  @observable DOCUMENTATION_FRM = Validator.prepareFormObject(DOCUMENTATION);
  @observable PROJECTIONS_FRM = Validator.prepareFormObject(PROJECTIONS);
  @observable BUSINESS_PLAN_FRM = Validator.prepareFormObject(BUSINESS_PLAN);
  @observable CONTROL_PERSONS_FRM = Validator.prepareFormObject(CONTROL_PERSONS);
  @observable SOURCES_FRM = Validator.prepareFormObject(SOURCES);
  @observable USES_FRM = Validator.prepareFormObject(USES);
  @observable justificationConfirmModal = false;
  @observable removeJustificationIndex = null;
  @observable controlPersonConfirmModal = false;
  @observable removeControlPersonIndex = null;
  @observable sourcesConfirmModal = false;
  @observable removeSourcesIndex = null;
  @observable usesConfirmModal = false;
  @observable removeUsesIndex = null;

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
  businessPlanDateChange = (date) => {
    this.BUSINESS_PLAN_FRM = Validator.onChange(
      this.BUSINESS_PLAN_FRM,
      { name: 'dateOfIncorporation', value: date },
    );
  }

  @action
  toggleControlPersonConfirmModal(index) {
    this.controlPersonConfirmModal = !this.controlPersonConfirmModal;
    this.removeControlPersonIndex = this.controlPersonConfirmModal ? index : null;
  }

  @action
  addMoreControlPerson = () => {
    this.CONTROL_PERSONS_FRM = {
      ...this.CONTROL_PERSONS_FRM,
      fields: {
        ...this.CONTROL_PERSONS_FRM.fields,
        controlPerson: [
          ...this.CONTROL_PERSONS_FRM.fields.controlPerson,
          CONTROL_PERSONS.controlPerson[0],
        ],
      },
      meta: {
        ...this.CONTROL_PERSONS_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  removeControlPerson() {
    this.CONTROL_PERSONS_FRM.fields.controlPerson.splice(this.removeControlPersonIndex, 1);
    this.controlPersonConfirmModal = !this.controlPersonConfirmModal;
    this.removeControlPersonIndex = null;
  }

  @action
  controlPersonEleChange = (e, result, index) => {
    this.CONTROL_PERSONS_FRM = Validator
      .onArrayFieldChange(this.CONTROL_PERSONS_FRM, Validator.pullValues(e, result), 'controlPerson', index);
  }

  @action
  controlPersonMaskChange = (values, index) => {
    this.CONTROL_PERSONS_FRM = Validator.onArrayFieldChange(
      this.CONTROL_PERSONS_FRM,
      { name: 'ownership', value: values.formattedValue }, 'controlPerson', index,
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
  setFileUploadDataWithIndex = (form, field, files, index) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: fileData.fileName }, 'controlPerson', index,
    );
  }

  @action
  removeUploadedDataWithIndex = (form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: '' }, 'controlPerson', index,
    );
  }

  @action
  toggleSourcesConfirmModal(index) {
    this.sourcesConfirmModal = !this.sourcesConfirmModal;
    this.removeSourcesIndex = this.sourcesConfirmModal ? index : null;
  }

  @action
  addMoreSource = () => {
    this.SOURCES_FRM = {
      ...this.SOURCES_FRM,
      fields: {
        ...this.SOURCES_FRM.fields,
        sources: [
          ...this.SOURCES_FRM.fields.sources,
          SOURCES.sources[0],
        ],
      },
      meta: {
        ...this.SOURCES_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  removeSource = () => {
    this.SOURCES_FRM.fields.sources.splice(this.removeSourcesIndex, 1);
    this.sourcesConfirmModal = !this.sourcesConfirmModal;
    this.removeSourcesIndex = null;
  }

  @action
  sourceEleChange = (e, result, index) => {
    this.SOURCES_FRM = Validator
      .onArrayFieldChange(this.SOURCES_FRM, Validator.pullValues(e, result), 'sources', index);
  }

  @action
  sourceMaskChange = (values, index) => {
    this.SOURCES_FRM = Validator.onArrayFieldChange(
      this.SOURCES_FRM,
      { name: 'amount', value: values.floatValue }, 'sources', index,
    );
  }

  @computed
  get totalSourcesAmount() {
    let totalAmount = 0;
    this.SOURCES_FRM.fields.sources.map((source) => {
      totalAmount += source.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }

  @action
  toggleUsesConfirmModal(index) {
    this.usesConfirmModal = !this.usesConfirmModal;
    this.removeUsesIndex = this.usesConfirmModal ? index : null;
  }

  @action
  addMoreUse = () => {
    this.USES_FRM = {
      ...this.USES_FRM,
      fields: {
        ...this.USES_FRM.fields,
        uses: [
          ...this.USES_FRM.fields.uses,
          USES.uses[0],
        ],
      },
      meta: {
        ...this.USES_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  removeUse = () => {
    this.USES_FRM.fields.uses.splice(this.removeUsesIndex, 1);
    this.usesConfirmModal = !this.usesConfirmModal;
    this.removeUsesIndex = null;
  }

  @action
  useEleChange = (e, result, index) => {
    this.USES_FRM = Validator
      .onArrayFieldChange(this.USES_FRM, Validator.pullValues(e, result), 'uses', index);
  }

  @action
  useMaskChange = (values, index) => {
    this.USES_FRM = Validator.onArrayFieldChange(
      this.USES_FRM,
      { name: 'amount', value: values.floatValue }, 'uses', index,
    );
  }

  @computed
  get totalUsesAmount() {
    let totalAmount = 0;
    this.USES_FRM.fields.uses.map((use) => {
      totalAmount += use.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }
}
export default new BusinessAppReviewStore();
