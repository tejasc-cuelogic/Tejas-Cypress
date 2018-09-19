import { observable, action, computed, toJS } from 'mobx';
import { MODEL_MANAGER, OFFER_MANAGER, MISCELLANEOUS_MANAGER, CONTINGENCY_MANAGER, BUSINESS_PLAN_MANAGER, PROJECTIONS_MANAGER, DOCUMENTATION_MANAGER, JUSTIFICATIONS_MANAGER, OVERVIEW_MANAGER, MODEL_RESULTS, MODEL_INPUTS, MODEL_VARIABLES, OFFERS, UPLOADED_DOCUMENTS, OTHER_DOCUMENTATION_UPLOADS, SOCIAL_MEDIA, OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN, CONTROL_PERSONS, SOURCES, USES, LAUNCH, CLOSE } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class BusinessAppReviewStore {
  @observable OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);
  @observable OVERVIEW_MANAGER_FRM = Validator.prepareFormObject(OVERVIEW_MANAGER);
  @observable MANAGERS_FRM = Validator.prepareFormObject(MANAGERS);
  @observable JUSTIFICATIONS_FRM = Validator.prepareFormObject(JUSTIFICATIONS);
  @observable JUSTIFICATIONS_MANAGER_FRM = Validator.prepareFormObject(JUSTIFICATIONS_MANAGER);
  @observable DOCUMENTATION_FRM = Validator.prepareFormObject(DOCUMENTATION);
  @observable DOCUMENTATION_MANAGER_FRM = Validator.prepareFormObject(DOCUMENTATION_MANAGER);
  @observable PROJECTIONS_FRM = Validator.prepareFormObject(PROJECTIONS);
  @observable PROJECTIONS_MANAGER_FRM = Validator.prepareFormObject(PROJECTIONS_MANAGER);
  @observable BUSINESS_PLAN_FRM = Validator.prepareFormObject(BUSINESS_PLAN);
  @observable BUSINESS_PLAN_MANAGER_FRM = Validator.prepareFormObject(BUSINESS_PLAN_MANAGER);
  @observable CONTINGENCY_MANAGER_FRM = Validator.prepareFormObject(CONTINGENCY_MANAGER);
  @observable MISCELLANEOUS_MANAGER_FRM = Validator.prepareFormObject(MISCELLANEOUS_MANAGER);
  @observable OFFER_MANAGER_FRM = Validator.prepareFormObject(OFFER_MANAGER);
  @observable MODEL_MANAGER_FRM = Validator.prepareFormObject(MODEL_MANAGER);
  @observable CONTROL_PERSONS_FRM = Validator.prepareFormObject(CONTROL_PERSONS);
  @observable SOURCES_FRM = Validator.prepareFormObject(SOURCES);
  @observable USES_FRM = Validator.prepareFormObject(USES);
  @observable LAUNCH_FRM = Validator.prepareFormObject(LAUNCH);
  @observable CLOSE_FRM = Validator.prepareFormObject(CLOSE);
  @observable SOCIAL_MEDIA_FRM = Validator.prepareFormObject(SOCIAL_MEDIA);
  @observable OTHER_DOCUMENTATION_FRM = Validator.prepareFormObject(OTHER_DOCUMENTATION_UPLOADS);
  @observable UPLOADED_DOCUMENTS_FRM = Validator.prepareFormObject(UPLOADED_DOCUMENTS);
  @observable OFFERS_FRM = Validator.prepareFormObject(OFFERS);
  @observable MODEL_INPUTS_FRM = Validator.prepareFormObject(MODEL_INPUTS);
  @observable MODEL_VARIABLES_FRM = Validator.prepareFormObject(MODEL_VARIABLES);
  @observable RESULTS_FRM = Validator.prepareFormObject(MODEL_RESULTS);
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
    Validator.validateForm(this[formName], true, false, false);
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
      SOCIAL_MEDIA_FRM: SOCIAL_MEDIA,
      OTHER_DOCUMENTATION_FRM: OTHER_DOCUMENTATION_UPLOADS,
      OFFERS_FRM: OFFERS,
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
  onDateChange = (form, field, date) => {
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: date },
    );
  }

  @action
  controlPersonMaskChange = (values, index) => {
    this.CONTROL_PERSONS_FRM = Validator.onArrayFieldChange(
      this.CONTROL_PERSONS_FRM,
      { name: 'ownership', value: values.formattedValue }, 'data', index,
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

  @action
  maskChange = (values, form, field) => {
    const fieldValue = field === 'dateOfIncorporation' ? values.formattedValue : values.floatValue;
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

  @computed
  get totalSourcesAmount() {
    let totalAmount = 0;
    this.SOURCES_FRM.fields.data.map((source) => {
      totalAmount += source.amount.value;
      return totalAmount;
    });
    return totalAmount;
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
  setDataForFields = (fields, data, form) => {
    Object.keys(fields).map((key) => {
      try {
        if (fields[key] && Array.isArray(toJS(fields[key]))) {
          if (data[key] && data[key].length > 0) {
            const addRec = data[key].length - toJS(fields[key]).length;
            for (let i = addRec; i > 0; i -= 1) {
              this.addMore(form, key);
            }
            data[key].forEach((record, index) => {
              this.setDataForFields(fields[key][index], data[key][index]);
            });
          }
        } else if (fields[key].objRef) {
          let tempRef = false;
          fields[key].objRef.split('.').map((k) => {
            tempRef = !tempRef ? data[k] : tempRef[k];
            return tempRef;
          });
          // fields[key].value = tempRef[key];
        } else {
          // fields[key].value = data && typeof data === 'string' ? data : data[key];
        }
        if (fields[key].refSelector) {
          // fields[key].refSelectorValue = fields[key].value !== '';
        }
      } catch (e) {
        // do nothing
      }
      return null;
    });
  }

  @action
  setFormData = (form, ref, ref2, ref3) => {
    const { offer } = this.OVERVIEW_FRM;
    // const { fields } = this[form];
    const data = ref ? (ref2 ? (ref3 ? offer[ref][ref2][ref3] : offer[ref][ref2]) : offer[ref]) :
      offer;
    if (this[form].fields.data && Array.isArray(toJS(this[form].fields.data))) {
      this.resetMe(form);
      if (data && data.length > 0) {
        data.forEach((record, index) => {
          this.addMore(form);
          this.setDataForFields(this[form].fields.data[index], data[index], form);
        });
      }
    } else {
      this.setDataForFields(this[form].fields, data, form);
    }
  }
}
export default new BusinessAppReviewStore();
