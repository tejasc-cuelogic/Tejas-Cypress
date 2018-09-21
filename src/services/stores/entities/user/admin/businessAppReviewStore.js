/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { map, has } from 'lodash';
import { SOURCES, USES, CONTROL_PERSONS, MODEL_MANAGER, OFFER_MANAGER, MISCELLANEOUS_MANAGER, CONTINGENCY_MANAGER, BUSINESS_PLAN_MANAGER, PROJECTIONS_MANAGER, DOCUMENTATION_MANAGER, JUSTIFICATIONS_MANAGER, OVERVIEW_MANAGER, MODEL_RESULTS, MODEL_INPUTS, MODEL_VARIABLES, OFFERS, UPLOADED_DOCUMENTS, OTHER_DOCUMENTATION_UPLOADS, SOCIAL_MEDIA, OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN, LAUNCH, CLOSE } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { BUSINESS_APPLICATION_STATUS } from '../../../../constants/businessApplication';
import { updateApplicationStatusAndReview, updateBusinessApplicationInformationData } from '../../../queries/businessApplication';
import { businessAppStore, uiStore } from '../../../index';

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

  // getMetaData = (metaData) => {
  //   const metaDataMapping = {
  //     OVERVIEW_FRM: OVERVIEW,
  //     OVERVIEW_MANAGER_FRM: OVERVIEW_MANAGER,
  //     MANAGERS_FRM: MANAGERS,
  //     JUSTIFICATIONS_FRM: JUSTIFICATIONS,
  //     JUSTIFICATIONS_MANAGER_FRM: JUSTIFICATIONS_MANAGER,
  //     DOCUMENTATION_FRM: DOCUMENTATION,
  //     DOCUMENTATION_MANAGER_FRM: DOCUMENTATION_MANAGER,
  //     PROJECTIONS_FRM: PROJECTIONS,
  //     PROJECTIONS_MANAGER_FRM: PROJECTIONS_MANAGER,
  //     BUSINESS_PLAN_FRM: BUSINESS_PLAN,
  //     BUSINESS_PLAN_MANAGER_FRM: BUSINESS_PLAN_MANAGER,
  //     CONTINGENCY_MANAGER_FRM: CONTINGENCY_MANAGER,
  //     MISCELLANEOUS_MANAGER_FRM: MISCELLANEOUS_MANAGER,
  //     OFFER_MANAGER_FRM: OFFER_MANAGER,
  //     MODEL_MANAGER_FRM: MODEL_MANAGER,
  //     CONTROL_PERSONS_FRM: CONTROL_PERSONS,
  //     SOURCES_FRM: SOURCES,
  //     USES_FRM: USES,
  //     LAUNCH_FRM: LAUNCH,
  //     CLOSE_FRM: CLOSE,
  //     SOCIAL_MEDIA_FRM: SOCIAL_MEDIA,
  //     OTHER_DOCUMENTATION_FRM: OTHER_DOCUMENTATION_UPLOADS,
  //     UPLOADED_DOCUMENTS_FRM: UPLOADED_DOCUMENTS,
  //     OFFERS_FRM: OFFERS,
  //     MODEL_INPUTS_FRM: MODEL_INPUTS,
  //     MODEL_VARIABLES_FRM: MODEL_VARIABLES,
  //     RESULTS_FRM: MODEL_RESULTS,
  //   };
  //   return metaDataMapping[metaData];
  // }

  @action
  toggleConfirmModal = (index, formName = null) => {
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = formName;
    this.removeIndex = this.confirmModal ? index : null;
  }

  @action
  removeData = (formName, ref = 'data') => {
    this[formName].fields[ref].splice(this.removeIndex, 1);
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    this.removeIndex = null;
  }

  getMetaData = (metaData, getField = 'formData') => {
    const metaDataMapping = {
      LAUNCH_FRM: { formData: LAUNCH, actionType: '' },
      CLOSE_FRM: { formData: CLOSE, actionType: '' },
      JUSTIFICATIONS_FRM: { formData: JUSTIFICATIONS, actionType: '' },
      BUSINESS_PLAN_FRM: {
        formData: {
          BUSINESS_PLAN,
          control_persons: CONTROL_PERSONS,
          sources: SOURCES,
          uses: USES,
        },
        actionType: 'BUSINESS_PLAN',
        objRef: 'businessPlan',
      },
      OVERVIEW_FRM: { formData: OVERVIEW, actionType: 'REVIEW_OVERVIEW', objRef: 'overview' },
      SOCIAL_MEDIA_FRM: { formData: SOCIAL_MEDIA, actionType: '' },
      OTHER_DOCUMENTATION_FRM: { formData: OTHER_DOCUMENTATION_UPLOADS, actionType: '' },
      OFFERS_FRM: { formData: OFFERS, actionType: '' },
    };
    return metaDataMapping[metaData][getField];
  }

  @action
  addMore = (formName, arrayName = 'data') => {
    this[formName] = {
      ...this[formName],
      fields: {
        ...this[formName].fields,
      },
      meta: {
        ...this[formName].meta,
        isValid: false,
      },
    };
    const arrayData = [
      ...this[formName].fields[arrayName],
      this.getMetaData(formName)[arrayName],
    ];
    this[formName].fields[arrayName] = arrayData;
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  formChangeWithIndex = (e, result, form, ref, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result), ref, index,
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
    this.BUSINESS_PLAN_FRM = Validator.onArrayFieldChange(
      this.BUSINESS_PLAN_FRM,
      { name: 'ownership', value: values.formattedValue }, 'control_persons', index,
    );
  }

  @action
  setFileUploadData = (form, arrayName, field, files, index = null) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fileData.fileName }, arrayName, index,
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
  maskChangeWithIndex = (values, form, arrayName, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: values.floatValue }, arrayName, index,
    );
  }

  @computed
  get totalSourcesAmount() {
    let totalAmount = 0;
    this.BUSINESS_PLAN_FRM.fields.sources.map((source) => {
      totalAmount += source.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }

  @computed
  get totalUsesAmount() {
    let totalAmount = 0;
    this.BUSINESS_PLAN_FRM.fields.uses.map((use) => {
      totalAmount += use.amount.value;
      return totalAmount;
    });
    return totalAmount;
  }

  @action
  resetMe = (form, ref) => {
    this[form] = Validator.prepareFormObject(ref);
  }

  @action
  saveReviewForms = (formName) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const { applicationId, userId, applicationStatus } = businessApplicationDetailsAdmin;
    const formInputData = this.evaluateFormData(this[formName].fields);
    const actionType = this.getMetaData(formName, 'actionType');
    const objRef = this.getMetaData(formName, 'objRef');
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    uiStore.setProgress();
    // const payload = {
    //   review: { [objRef]: formInputData },
    //   actionType,
    //   applicationId,
    //   userId,
    //   applicationSource,
    // };
    const payload = {
      review: { [objRef]: formInputData },
      applicationId,
      issuerId: userId,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateBusinessApplicationInformationData,
          variables: payload,
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  evaluateFormData = (fields) => {
    let inputData = {};
    map(fields, (ele, key) => {
      try {
        const records = toJS(fields[key]);
        if (fields[key] && Array.isArray(records)) {
          if (fields[key] && fields[key].length > 0) {
            inputData = { ...inputData, [key]: [] };
            let arrObj = [];
            records.forEach((field) => {
              let arrayFieldsKey = {};
              let arrayFields = [];
              map(field, (eleV, keyRef1) => {
                if (field[keyRef1].objType !== 'array') {
                  arrayFields = {};
                }
                if (eleV.objRefOutput) {
                  if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                    const fileObj =
                      { fileId: field[keyRef1].fileId, fileName: field[keyRef1].value };
                    arrayFields = { ...arrayFields, [keyRef1]: fileObj };
                  } else {
                    arrayFields =
                      { ...arrayFields, [keyRef1]: field[keyRef1].value };
                  }
                } else if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                  const fileObj =
                      { fileId: field[keyRef1].fileId, fileName: field[keyRef1].value };
                  arrayFields = { ...arrayFields, [keyRef1]: fileObj };
                } else if (field[keyRef1].objType === 'array') {
                  arrayFields.push(field[keyRef1].value);
                } else {
                  arrayFields = { [keyRef1]: field[keyRef1].value };
                }
                if (field[keyRef1].objType === 'array') {
                  arrayFieldsKey = { ...arrayFieldsKey, [keyRef1]: arrayFields };
                } else {
                  arrayFieldsKey = { ...arrayFieldsKey, ...arrayFields };
                  // if (eleV.objRefOutput) {
                  //   arrayFieldsKey = has(arrayFieldsKey, [eleV.objRefOutput]) ?
                  //     { ...arrayFieldsKey, [eleV.objRefOutput]: arrayFieldsKey } :
                  //     { [eleV.objRefOutput]: arrayFieldsKey };
                  // }
                }
              });
              arrObj = [...arrObj, arrayFieldsKey];
              inputData = { ...inputData, [key]: { ...inputData[key], ...arrObj } };
            });
          }
        } else if (fields[key].objRefOutput) {
          if (fields[key].objType && fields[key].objType === 'FileObjectType') {
            const fileObj = { fileId: fields[key].fileId, fileName: fields[key].value };
            inputData = { ...inputData, [fields[key].objRefOutput]: { [key]: fileObj } };
          } else {
            inputData = { ...inputData, [fields[key].objRefOutput]: { [key]: fields[key].value } };
          }
        } else if (fields[key].objType && fields[key].objType === 'FileObjectType') {
          const fileObj = { fileId: fields[key].fileId, fileName: fields[key].value };
          inputData = { ...inputData, [key]: fileObj };
        } else {
          inputData = { ...inputData, [key]: fields[key].value };
        }
      } catch (e) {
        // do nothing
      }
    });
    return inputData;
  }

  /*
  *  Set form data
  */
  @action
  setDataForFields = (fields, data, form) => {
    Object.keys(fields).map((key) => {
      try {
        if (fields[key] && Array.isArray(toJS(fields[key]))) {
          let tempRef = false;
          if (toJS(fields[key])[0].objRef) {
            fields[key][0].objRef.split('.').map((k) => {
              tempRef = !tempRef ? data[k] : tempRef[k];
              return tempRef;
            });
          }
          if ((data[key] && data[key].length > 0) || (tempRef[key] && tempRef[key].length > 0)) {
            const addRec = ((data[key] && data[key].length) ||
            (tempRef[key] && tempRef[key].length)) - toJS(fields[key]).length;
            for (let i = addRec; i > 0; i -= 1) {
              this.addMore(form, key);
            }
            (data[key] || tempRef[key]).forEach((record, index) => {
              this.setDataForFields(fields[key][index], (data[key] && data[key][index]) ||
              (tempRef[key] && tempRef[key][index]));
            });
          }
        } else if (fields[key].objRef) {
          let tempRef = false;
          fields[key].objRef.split('.').map((k) => {
            tempRef = !tempRef ? data[k] : tempRef[k];
            return tempRef;
          });
          if (typeof tempRef[key] === 'object' && tempRef[key].__typename === 'FileObjectType') {
            fields[key].value = tempRef[key].fileName;
            fields[key].fileId = tempRef[key].fileId;
          } else {
            const fieldRef = key.split('_');
            fields[key].value = fields[key].find ?
              tempRef.find(o => o[fields[key].find].toLowerCase() === fieldRef[0])[fieldRef[1]] :
              tempRef[key];
          }
        } else if (key === 'value') {
          fields[key] = data && typeof data === 'string' ? data : data[key];
        } else {
          fields[key].value = data && typeof data === 'string' ? data : data[key];
        }
        if (fields[key].refSelector) {
          fields[key].refSelectorValue = fields[key].value !== '';
        }
      } catch (e) {
        // do nothing
      }
      return null;
    });
  }
  @action
  setFormData = (form, ref, ref2, ref3) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const appData = businessApplicationDetailsAdmin;
    const { fields } = this[form];
    let data = false;
    ref.split('.').map((k) => {
      data = !data ? appData[k] : data[k];
      return data;
    });
    if (this[form].fields.data && Array.isArray(toJS(this[form].fields.data))) {
      this.resetMe(form, this.getMetaData(form));
      if (data && data.length > 0) {
        const addRec = data.length - toJS(this[form].fields.data).length;
        for (let i = addRec; i > 0; i -= 1) {
          this.addMore(form);
        }
        data.forEach((record, index) => {
          this.setDataForFields(this[form].fields.data[index], data[index], form);
        });
      }
    } else {
      this.setDataForFields(this[form].fields, data, form);
    }
  }
}
export default new BusinessAppReviewStore();
