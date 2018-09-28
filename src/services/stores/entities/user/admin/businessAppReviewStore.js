/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { map } from 'lodash';
import { CONTINGENCY, MODEL_MANAGER, MISCELLANEOUS, MODEL_RESULTS, MODEL_INPUTS, MODEL_VARIABLES, OFFERS, UPLOADED_DOCUMENTS, OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { BUSINESS_APPLICATION_STATUS } from '../../../../constants/businessApplication';
import { updateApplicationStatusAndReview } from '../../../queries/businessApplication';
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
  @observable subNavPresentation = {
    overview: '', preQualification: '', businessPlan: '', projections: '', documentation: '', miscellaneous: '', contingencies: '', model: '', offer: '',
  };

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

  @action
  updateStatuses = (steps) => {
    const { review, offers } = businessAppStore.businessApplicationDetailsAdmin;
    map(steps, (ele) => {
      if (ele.to !== 'model') {
        const submitted = ele.to === 'overview' ? review && review[ele.to] && review[ele.to].criticalPoint && review[ele.to].criticalPoint.submitted && (review[ele.to].criticalPoint.submitted || null) : ele.to === 'offer' ? offers && offers.submitted && (offers.submitted || null) : review && review[ele.to] && review[ele.to].submitted && (review[ele.to].submitted || null);
        const approved = ele.to === 'overview' ? review && review[ele.to] && review[ele.to].criticalPoint && review[ele.to].criticalPoint.approved && (review[ele.to].criticalPoint.approved || null) : ele.to === 'offer' ? offers && offers.approved && (offers.approved || null) : review && review[ele.to] && review[ele.to].approved && (review[ele.to].approved || null);
        const status = (submitted && (!approved || (approved && !approved.status))) ? 'ns-reload-circle' : approved && approved.status ? 'ns-check-circle' : '';
        this.subNavPresentation[ele.to] = status;
      }
    });
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      CONTINGENCY_FRM: { actionType: 'REVIEW_CONTINGENCIES' },
      JUSTIFICATIONS_FRM: { actionType: 'REVIEW_PREQUALIFICATION' },
      BUSINESS_PLAN_FRM: { actionType: 'REVIEW_BUSINESSPLAN' },
      MISCELLANEOUS_FRM: { actionType: 'REVIEW_MISCELLANEOUS' },
      OVERVIEW_FRM: { actionType: 'REVIEW_OVERVIEW' },
      PROJECTIONS_FRM: { actionType: 'REVIEW_PROJECTIONS' },
      DOCUMENTATION_FRM: { actionType: 'REVIEW_DOCUMENTATION' },
      OFFERS_FRM: { actionType: 'REVIEW_OFFER' },
      MANAGERS_FRM: { formData: MANAGERS },
    };
    return metaDataMapping[formName][getField];
  }

  @action
  addMore = (formName, arrayName = 'data') => {
    this[formName] = Validator.addMoreRecordToSubSection(this[formName], arrayName);
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
    const fieldValue = field === 'expirationDate' || field === 'dateOfIncorporation' ? values.formattedValue : values.floatValue;
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
  saveReviewForms = (formName, approveOrSubmitted = '', approvedStatus = true) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const { applicationId, userId, applicationStatus } = businessApplicationDetailsAdmin;
    let formInputData = Validator.evaluateFormData(this[formName].fields);
    const managerFormInputData = approveOrSubmitted === 'REVIEW_APPROVED' ? Validator.evaluateFormData(this.MANAGERS_FRM.fields) : '';
    const payloadKey = formName === 'OFFERS_FRM' ? 'offers' : 'review';
    if (formName === 'OVERVIEW_FRM' || formName === 'JUSTIFICATIONS_FRM') {
      const key = formName === 'OVERVIEW_FRM' ? 'description' : 'justifications';
      const data = map(formInputData[key], value => value[key]);
      formInputData = { [key]: data };
      formInputData = formName === 'OVERVIEW_FRM' ? { overview: { criticalPoint: formInputData } } : { preQualification: formInputData };
    }
    const key = Object.keys(formInputData)[0];
    formInputData = managerFormInputData !== '' ? formInputData = { ...formInputData, [key]: { ...formInputData[key], ...managerFormInputData } } : formInputData;
    let actionType = this.getActionType(formName);
    let applicationReviewAction = '';
    if (approveOrSubmitted !== '') {
      actionType = approveOrSubmitted;
      applicationReviewAction = this.getActionType(formName);
    }
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    uiStore.setProgress();
    let payload = {
      [payloadKey]: formInputData,
      actionType,
      applicationId,
      userId,
      applicationSource,
    };
    if (approveOrSubmitted !== '') {
      payload = { ...payload, applicationReviewAction };
      payload = approveOrSubmitted === 'REVIEW_APPROVED' ? { ...payload, approvedStatus } : payload;
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateApplicationStatusAndReview,
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
    let formInputData = Validator.evaluateFormData(this[formName].fields);
    const payloadKey = formName === 'OFFERS_FRM' ? 'offers' : 'review';
    if (formName === 'OVERVIEW_FRM' || formName === 'JUSTIFICATIONS_FRM') {
      const key = formName === 'OVERVIEW_FRM' ? 'description' : 'justifications';
      const data = map(formInputData[key], value => value[key]);
      formInputData = { [key]: data };
      formInputData = formName === 'OVERVIEW_FRM' ? { overview: { criticalPoint: formInputData } } : { preQualification: formInputData };
    }
    const applicationReviewAction = this.getActionType(formName);
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    uiStore.setProgress();
    const payload = {
      [payloadKey]: formInputData,
      actionType,
      applicationReviewAction,
      applicationId,
      userId,
      applicationSource,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateApplicationStatusAndReview,
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
