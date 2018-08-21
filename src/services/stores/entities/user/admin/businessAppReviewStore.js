import { observable, action, computed } from 'mobx';
import { OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN, CONTROL_PERSONS, SOURCES, USES, LAUNCH, CLOSE } from '../../../../constants/admin/businessApplication';
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
  @observable LAUNCH_FRM = Validator.prepareFormObject(LAUNCH);
  @observable CLOSE_FRM = Validator.prepareFormObject(CLOSE);
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;

  @action
  toggleConfirmModal = (index, formName = null) => {
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = formName;
    this.removeIndex = this.confirmModal ? index : null;
  }

  @action
  removeData = (formName) => {
    this[formName].fields.data.splice(this.removeIndex, 1);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    this.removeIndex = null;
  }

  getMetaData = (metaData) => {
    const metaDataMapping = {
      LAUNCH_FRM: LAUNCH,
      CLOSE_FRM: CLOSE,
      CONTROL_PERSONS_FRM: CONTROL_PERSONS,
      JUSTIFICATIONS_FRM: JUSTIFICATIONS,
      OVERVIEW_FRM: OVERVIEW,
      SOURCES_FRM: SOURCES,
      USES_FRM: USES,
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

  @action
  overviewEleChange = (e, result, index) => {
    this.OVERVIEW_FRM = Validator
      .onArrayFieldChange(this.OVERVIEW_FRM, Validator.pullValues(e, result), 'data', index);
  };

  @action
  managerEleChange = (e, result) => {
    this.MANAGERS_FRM =
      Validator.onChange(this.MANAGERS_FRM, Validator.pullValues(e, result));
  };

  @action
  justificationEleChange = (e, result, index) => {
    this.JUSTIFICATIONS_FRM = Validator
      .onArrayFieldChange(this.JUSTIFICATIONS_FRM, Validator.pullValues(e, result), 'data', index);
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
  controlPersonEleChange = (e, result, index) => {
    this.CONTROL_PERSONS_FRM = Validator
      .onArrayFieldChange(this.CONTROL_PERSONS_FRM, Validator.pullValues(e, result), 'data', index);
  }

  @action
  controlPersonMaskChange = (values, index) => {
    this.CONTROL_PERSONS_FRM = Validator.onArrayFieldChange(
      this.CONTROL_PERSONS_FRM,
      { name: 'ownership', value: values.formattedValue }, 'data', index,
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
      { name: field, value: fileData.fileName }, 'data', index,
    );
  }

  @action
  removeUploadedData = (form, field) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: '' },
    );
  }

  @action
  removeUploadedDataWithIndex = (form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: '' }, 'data', index,
    );
  }

  @action
  sourceEleChange = (e, result, index) => {
    this.SOURCES_FRM = Validator
      .onArrayFieldChange(this.SOURCES_FRM, Validator.pullValues(e, result), 'data', index);
  }

  @action
  sourceMaskChange = (values, index) => {
    this.SOURCES_FRM = Validator.onArrayFieldChange(
      this.SOURCES_FRM,
      { name: 'amount', value: values.floatValue }, 'data', index,
    );
  }

  @computed
  get totalSourcesAmount() {
    let totalAmount = 0;
    this.SOURCES_FRM.fields.data.map((source) => {
      totalAmount += source.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }

  @action
  useEleChange = (e, result, index) => {
    this.USES_FRM = Validator
      .onArrayFieldChange(this.USES_FRM, Validator.pullValues(e, result), 'data', index);
  }

  @action
  useMaskChange = (values, index) => {
    this.USES_FRM = Validator.onArrayFieldChange(
      this.USES_FRM,
      { name: 'amount', value: values.floatValue }, 'data', index,
    );
  }

  @computed
  get totalUsesAmount() {
    let totalAmount = 0;
    this.USES_FRM.fields.data.map((use) => {
      totalAmount += use.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }

  @action
  contingenciesEleChange = (e, formName, result, index) => {
    this[formName] = Validator
      .onArrayFieldChange(this[formName], Validator.pullValues(e, result), 'data', index);
  };
}
export default new BusinessAppReviewStore();
