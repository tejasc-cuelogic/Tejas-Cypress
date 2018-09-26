/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { map } from 'lodash';
import moment from 'moment';
import { CONTINGENCY, MODEL_MANAGER, MISCELLANEOUS, MODEL_RESULTS, MODEL_INPUTS, MODEL_VARIABLES, OFFERS, UPLOADED_DOCUMENTS, OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { BUSINESS_APPLICATION_STATUS } from '../../../../constants/businessApplication';
import { updateApplicationStatusAndReview, updateBusinessApplicationInformationData } from '../../../queries/businessApplication';
import { businessAppStore, uiStore } from '../../../index';

export class BusinessAppReviewStore {
  @observable OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);
  @observable MANAGERS_FRM = Validator.prepareFormObject(MANAGERS);
  @observable JUSTIFICATIONS_FRM = Validator.prepareFormObject(JUSTIFICATIONS);
  @observable DOCUMENTATION_FRM = Validator.prepareFormObject(DOCUMENTATION);
  @observable PROJECTIONS_FRM = Validator.prepareFormObject(PROJECTIONS);
  @observable BUSINESS_PLAN_FRM = Validator.prepareFormObject(BUSINESS_PLAN);
  @observable CONTINGENCY_FRM = Validator.prepareFormObject(CONTINGENCY);
  @observable MISCELLANEOUS_FRM = Validator.prepareFormObject(MISCELLANEOUS);
  @observable MODEL_MANAGER_FRM = Validator.prepareFormObject(MODEL_MANAGER);
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
  removeData = (formName, ref = 'data') => {
    this[formName].fields[ref].splice(this.removeIndex, 1);
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    this.removeIndex = null;
  }

  getMetaData = (metaData, getField = 'formData') => {
    const metaDataMapping = {
      CONTINGENCY_FRM: { formData: CONTINGENCY, actionType: 'REVIEW_CONTINGENCIES', objRef: 'contingencies' },
      JUSTIFICATIONS_FRM: { formData: JUSTIFICATIONS, actionType: 'REVIEW_PREQUALIFICATION', objRef: 'preQualification' },
      BUSINESS_PLAN_FRM: { formData: BUSINESS_PLAN, actionType: 'REVIEW_BUSINESSPLAN', objRef: 'businessPlan' },
      MISCELLANEOUS_FRM: { formData: MISCELLANEOUS, actionType: 'REVIEW_MISCELLANEOUS', objRef: 'miscellaneous' },
      OVERVIEW_FRM: { formData: OVERVIEW, actionType: 'REVIEW_OVERVIEW', objRef: 'overview' },
      PROJECTIONS_FRM: { formData: PROJECTIONS, actionType: 'REVIEW_PROJECTIONS', objRef: 'projections' },
      DOCUMENTATION_FRM: { formData: DOCUMENTATION, actionType: 'REVIEW_DOCUMENTATION', objRef: 'documentation' },
      OFFERS_FRM: { formData: OFFERS, actionType: 'REVIEW_OFFER', objRef: 'offer' },
      MANAGERS_FRM: { formData: MANAGERS },
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
      this.getMetaData(formName)[arrayName][0],
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
  formChangeWithIndex = (e, result, form, ref = null, index) => {
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
      { name: 'ownership', value: values.floatValue }, 'controlPersons', index,
    );
  }

  @action
  setFileUploadData = (form, arrayName, field, files, index = null) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    if (index !== null) {
      this[form].fields[arrayName][index][field].fileId = '12345';
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fileData.fileName }, arrayName, index,
      );
    } else {
      this[form].fields[field].fileId = '12345';
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
    }
  }

  @action
  removeUploadedData = (form, arrayName = 'data', field, index = null) => {
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: '' }, arrayName, index,
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
  maskChangeWithIndex = (values, form, arrayName = 'data', field, index) => {
    const fieldValue = field === 'expirationDate' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: fieldValue }, arrayName, index,
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
    let formInputData = this.evaluateFormData(this[formName].fields);
    const payloadKey = formName === 'OFFERS_FRM' ? 'offers' : 'review';
    if (formName === 'OVERVIEW_FRM' || formName === 'JUSTIFICATIONS_FRM') {
      const key = formName === 'OVERVIEW_FRM' ? 'description' : 'justifications';
      const data = map(formInputData.data, value => value[key]);
      formInputData = { [key]: data };
      formInputData = formName === 'OVERVIEW_FRM' ? { criticalPoint: formInputData } : formInputData;
    }
    const actionType = this.getMetaData(formName, 'actionType');
    const objRef = this.getMetaData(formName, 'objRef');
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    uiStore.setProgress();
    // const payload = {
    //   [payloadKey]: { [objRef]: formInputData },
    //   actionType,
    //   applicationId,
    //   userId,
    //   applicationSource,
    // };
    const payload = {
      [payloadKey]: { [objRef]: formName === 'OFFERS_FRM' ? formInputData.offer : formInputData },
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
          Helper.toast('Data saved successfully.', 'success');
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
  approveOrSubmitReviewForms = (formName, actionType = 'REVIEW_SUBMITTED') => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const { applicationId, userId, applicationStatus } = businessApplicationDetailsAdmin;
    const formInputData = this.evaluateFormData(this[formName].fields);
    const applicationReviewAction = this.getMetaData(formName, 'actionType');
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    uiStore.setProgress();
    const payload = {
      comments: { text: formInputData },
      actionType,
      applicationReviewAction,
      applicationId,
      userId,
      applicationSource,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateBusinessApplicationInformationData,
          variables: payload,
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          Helper.toast('Submitted successfully.', 'success');
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

  evaluateObjectRef = (objRef, inputData, key, value) => {
    let tempRef = inputData;
    const rejObjects = objRef.split('.');
    if (rejObjects.length === 1) {
      tempRef = { ...inputData, [rejObjects[0]]: { ...inputData[[rejObjects[0]]], [key]: value } };
    } else if (rejObjects.length === 2) {
      tempRef = {
        ...inputData,
        [rejObjects[0]]: { [rejObjects[1]]: { ...inputData[[rejObjects[1]]], [key]: value } },
      };
    } else if (rejObjects.length === 3) {
      tempRef = {
        ...inputData,
        [rejObjects[0]]: {
          [rejObjects[1]]: { [rejObjects[2]]: { ...inputData[[rejObjects[2]]], [key]: value } },
        },
      };
    }
    return tempRef;
  }

  evalFileObj = fileData => ({ fileId: fileData.fileId, fileName: fileData.value });

  evalDateObj = date => moment(date).toISOString();

  @action
  evaluateFormData = (fields) => {
    let inputData = {};
    map(fields, (ele, key) => {
      try {
        const records = toJS(fields[key]);
        let reference = false;
        if (fields[key] && Array.isArray(records)) {
          if (fields[key] && fields[key].length > 0) {
            const arrObj = [];
            records.forEach((field) => {
              let arrayFieldsKey = {};
              let arrayFields = {};
              map(field, (eleV, keyRef1) => {
                if (eleV.objRefOutput) {
                  reference = !reference ? eleV.objRefOutput : false;
                  if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                    arrayFields = { ...arrayFields, [keyRef1]: this.evalFileObj(field[keyRef1]) };
                  } else {
                    arrayFields = { ...arrayFields, [keyRef1]: field[keyRef1].value };
                  }
                } else if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                  arrayFields = { ...arrayFields, [keyRef1]: this.evalFileObj(field[keyRef1]) };
                } else if (field[keyRef1].objType && field[keyRef1].objType === 'DATE') {
                  arrayFields = { [keyRef1]: this.evalDateObj(field[keyRef1].value) };
                } else {
                  arrayFields = { [keyRef1]: field[keyRef1].value };
                }
                arrayFieldsKey = { ...arrayFieldsKey, ...arrayFields };
              });
              arrObj.push(arrayFieldsKey);
              if (reference) {
                inputData = this.evaluateObjectRef(reference, inputData, [key], arrObj);
              } else {
                inputData = { ...inputData, [key]: arrObj };
              }
            });
          }
        } else if (fields[key].objRefOutput) {
          reference = !reference ? fields[key].objRefOutput : false;
          if (fields[key].objType && fields[key].objType === 'FileObjectType') {
            inputData =
            this.evaluateObjectRef(reference, inputData, [key], this.evalFileObj(fields[key]));
          } else if (fields[key].objType && fields[key].objType === 'DATE') {
            inputData = this.evaluateObjectRef(
              reference,
              inputData,
              [key],
              this.evalDateObj(fields[key].value),
            );
          } else {
            inputData = this.evaluateObjectRef(reference, inputData, [key], fields[key].value);
          }
        } else if (fields[key].objType && fields[key].objType === 'FileObjectType') {
          inputData = { ...inputData, [key]: this.evalFileObj(fields[key]) };
        } else if (fields[key].objType && fields[key].objType === 'DATE') {
          inputData = { ...inputData, [key]: this.evalDateObj(fields[key].value) };
        } else {
          inputData = { ...inputData, [key]: fields[key].value };
        }
      } catch (e) {
        console.log(e);
      }
    });
    return inputData;
  }

  @action
  setFormData = (form, ref) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const appData = businessApplicationDetailsAdmin;
    if (!appData) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], appData, ref);
    return false;
  }
}
export default new BusinessAppReviewStore();
