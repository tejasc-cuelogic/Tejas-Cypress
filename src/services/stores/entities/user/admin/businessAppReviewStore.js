/* eslint-disable no-underscore-dangle */
import { observable, action, computed, toJS } from 'mobx';
import { map, forEach, filter, get, ceil } from 'lodash';
import graphql from 'mobx-apollo';
import cleanDeep from 'clean-deep';
import { Calculator } from 'amortizejs';
import money from 'money-math';
import { APPLICATION_STATUS_COMMENT, CONTINGENCY, MODEL_MANAGER, MISCELLANEOUS, MODEL_RESULTS, MODEL_INPUTS, MODEL_VARIABLES, OFFERS, UPLOADED_DOCUMENTS, OVERVIEW, MANAGERS, JUSTIFICATIONS, DOCUMENTATION, PROJECTIONS, BUSINESS_PLAN } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { BUSINESS_APPLICATION_STATUS, BUSINESS_APP_FILE_UPLOAD_ENUMS } from '../../../../constants/businessApplication';
import { generatePortalAgreement, createOffering, getPortalAgreementStatus, signPortalAgreement, updateApplicationStatusAndReview, getBusinessApplicationsDetailsAdmin, getBusinessApplicationOffers } from '../../../queries/businessApplication';
import { businessAppStore, uiStore, userStore } from '../../../index';
import { fileUpload } from '../../../../actions';
import { allOfferingsCompact } from '../../../queries/offerings/manage';

export class BusinessAppReviewStore {
  @observable APPLICATION_STATUS_COMMENT_FRM =
    Validator.prepareFormObject(APPLICATION_STATUS_COMMENT);
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
  @observable businessApplicationOffers = null;
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;
  @observable selectedOfferIndex = null;
  @observable paBoxFolderId = null;
  @observable signPortalAgreementURL = '';
  @observable removeFileIdsList = [];
  @observable showGeneratePA = false;
  @observable inProgress = false;
  @observable subNavPresentation = {
    overview: '', preQualification: '', businessPlan: '', projections: '', documentation: '', miscellaneous: '', contingencies: '', model: '', offer: '',
  };
  @observable amortizationArray = [];
  @observable initLoad = [];

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

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

  @computed get checkAllStepsIsApproved() {
    const isPartial = filter(this.subNavPresentation, (step, key) => (key !== 'model' && key !== 'offer' && (step === 'ns-reload-circle' || step === '')));
    return isPartial.length;
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      CONTINGENCY_FRM: { actionType: 'REVIEW_CONTINGENCIES', isMultiForm: true },
      JUSTIFICATIONS_FRM: { actionType: 'REVIEW_PREQUALIFICATION', isMultiForm: true },
      BUSINESS_PLAN_FRM: { actionType: 'REVIEW_BUSINESSPLAN', isMultiForm: true },
      MISCELLANEOUS_FRM: { actionType: 'REVIEW_MISCELLANEOUS', isMultiForm: true },
      OVERVIEW_FRM: { actionType: 'REVIEW_OVERVIEW', isMultiForm: true },
      PROJECTIONS_FRM: { actionType: 'REVIEW_PROJECTIONS', isMultiForm: false },
      DOCUMENTATION_FRM: { actionType: 'REVIEW_DOCUMENTATION', isMultiForm: false },
      OFFERS_FRM: { actionType: 'REVIEW_OFFER', isMultiForm: true },
      MANAGERS_FRM: { formData: MANAGERS, isMultiForm: false },
    };
    return metaDataMapping[formName][getField];
  }

  @action
  addMore = (formName, arrayName = 'data') => {
    this[formName] = Validator.addMoreRecordToSubSection(this[formName], arrayName);
    if (arrayName === 'expectedAnnualRevenue') {
      const index = this[formName].fields[arrayName].length;
      this[formName].fields[arrayName][index - 1].label.value = `Year ${index}`;
    }
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
  checkFormValid = (form, multiForm, showErrors) => {
    this[form] = Validator.validateForm(this[form], multiForm, showErrors, false);
  }
  @action
  setFileUploadData = (form, arrayName, field, files, index = null) => {
    if (typeof files !== 'undefined' && files.length) {
      const { applicationId, userId } = businessAppStore.businessApplicationDetailsAdmin;
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getFileUploadEnum(form, index);
        this.setFormFileArray(form, arrayName, field, 'showLoader', true, index);
        fileUpload.setFileUploadData(applicationId, fileData, stepName, 'ADMIN', userId).then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(form, arrayName, field, 'fileData', file, index);
            this.setFormFileArray(form, arrayName, field, 'preSignedUrl', preSignedUrl, index);
            this.setFormFileArray(form, arrayName, field, 'fileId', fileId, index);
            this.setFormFileArray(form, arrayName, field, 'value', fileData.fileName, index);
            this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
            this.checkFormValid(form, (index != null) || (form === 'OFFERS_FRM'), false);
            this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
          }).catch((error) => {
            this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
          });
        }).catch((error) => {
          this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        });
      });
    }
  }

  @action
  getFileUploadEnum = (formName, index = null) => {
    let step = '';
    if (index !== null && formName !== 'MISCELLANEOUS_FRM') {
      step = `${BUSINESS_APP_FILE_UPLOAD_ENUMS[formName]}${index + 1}`;
    } else {
      step = BUSINESS_APP_FILE_UPLOAD_ENUMS[formName];
    }
    return step;
  }

  @action
  setFormFileArray = (formName, arrayName, field, getField, value, index) => {
    if (index != null) {
      this[formName].fields[arrayName][index][field][getField] = value;
    } else {
      this[formName].fields[field][getField] = value;
    }
  }

  @action
  removeUploadedData = (form, field, index = null, arrayName) => {
    let removeFileIds = '';
    if (index != null) {
      const { fileId } = this[form].fields[arrayName][index][field];
      removeFileIds = fileId;
    } else {
      const { fileId } = this[form].fields[field];
      removeFileIds = fileId;
    }
    this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
    this.setFormFileArray(form, arrayName, field, 'fileId', '', index);
    this.setFormFileArray(form, arrayName, field, 'fileData', '', index);
    this.setFormFileArray(form, arrayName, field, 'value', '', index);
    this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
    this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
    this.setFormFileArray(form, arrayName, field, 'preSignedUrl', '', index);
    this.checkFormValid(form, (index != null) || (form === 'OFFERS_FRM'), false);
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
  maskChange = (values, form, field) => {
    const fieldValue = field === 'dateOfIncorporation' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }
  @action
  assignAdditionalTermsValue = (index) => {
    this.OFFERS_FRM.fields.offer[index].additionalTermsField.value =
      this.OFFERS_FRM.fields.offer[index].additionalTerms.value ? 'Additional Terms Apply' : 'Add Terms';
  }
  @action
  addAdditionalTermsToFormData = (index) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    if (!businessApplicationDetailsAdmin) {
      return false;
    }
    this.OFFERS_FRM.fields.offer[index].additionalTerms.value =
    (businessApplicationDetailsAdmin.offers.offer[index] &&
      businessApplicationDetailsAdmin.offers.offer[index].additionalTerms) || null;
    return false;
  }
  @action
  maskChangeWithIndex = (values, form, arrayName = 'data', field, index) => {
    const fieldValue = field === 'expirationDate' || field === 'dateOfIncorporation' || field === 'companyInceptionDate' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: fieldValue }, arrayName, index,
    );
    if (field === 'minimumAmount' || field === 'interestRate' || field === 'maturity') {
      this.showFormAmortisation(index);
    }
  }

  @computed
  get totalSourcesAmount() {
    let totalAmount = 0;
    this.BUSINESS_PLAN_FRM.fields.sources.map((source) => {
      totalAmount += parseInt(source.amount.value || 0, 10);
      return totalAmount;
    });
    return totalAmount;
  }

  @computed
  get totalUsesAmount() {
    let totalAmount = 0;
    this.BUSINESS_PLAN_FRM.fields.uses.map((use) => {
      totalAmount += parseInt(use.amount.value || 0, 10);
      return totalAmount;
    });
    return totalAmount;
  }

  @action
  resetMe = (form, ref) => {
    this[form] = Validator.prepareFormObject(ref);
  }

  @action
  resetCommentFrm = () => {
    this.APPLICATION_STATUS_COMMENT_FRM = Validator.prepareFormObject(APPLICATION_STATUS_COMMENT);
  }

 @action
  updateApplicationStatus = (applicationId, userId, applStatus, applicationFlag, comment = '') => {
    const applicationSource = applStatus ===
    BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    const formInputData = Validator.evaluateFormData(this.APPLICATION_STATUS_COMMENT_FRM.fields);
    uiStore.setProgress();
    let payload = {
      actionType: 'APPLICATION_STATUS',
      applicationId,
      applicationSource,
      applicationFlag,
      comments: comment !== '' ? { text: comment } : formInputData,
    };
    if (userId !== 'new') {
      payload = { ...payload, userId };
    }
    let reFetchPayLoad = {
      applicationId,
      applicationType: applicationSource,
    };
    if (applicationSource === 'APPLICATION_COMPLETED') {
      reFetchPayLoad = { ...reFetchPayLoad, userId };
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateApplicationStatusAndReview,
          variables: payload,
          refetchQueries:
            [{ query: getBusinessApplicationsDetailsAdmin, variables: reFetchPayLoad }],
        })
        .then((result) => {
          Helper.toast('Application status updated successfully.', 'success');
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
  saveReviewForms = (formName, approveOrSubmitted = '', approvedStatus = true) => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const { applicationId, userId, applicationStatus } = businessApplicationDetailsAdmin;
    let formInputData = Validator.evaluateFormData(this[formName].fields);
    const managerFormInputData = approveOrSubmitted === 'REVIEW_APPROVED' ? Validator.evaluateFormData(this.MANAGERS_FRM.fields) : '';
    const payloadKey = formName === 'OFFERS_FRM' ? 'offers' : 'review';
    if (formName === 'OVERVIEW_FRM' || formName === 'JUSTIFICATIONS_FRM') {
      const key = formName === 'OVERVIEW_FRM' ? 'description' : 'justifications';
      const data = map(formInputData[key], value => value[key]);
      formInputData = { [key]: cleanDeep(data) };
      formInputData = formName === 'OVERVIEW_FRM' ? { overview: { criticalPoint: formInputData } } : { preQualification: formInputData };
    }
    const key = Object.keys(formInputData)[0];
    if (formName === 'OFFERS_FRM') {
      formInputData = managerFormInputData !== '' ? formInputData = { ...formInputData, ...managerFormInputData } : formInputData;
    } else {
      formInputData = managerFormInputData !== '' ? formInputData = { ...formInputData, [key]: { ...formInputData[key], ...managerFormInputData } } : formInputData;
    }
    formInputData[key] = formName === 'OVERVIEW_FRM' ? formInputData[key] : cleanDeep(formInputData[key]);
    let actionType = this.getActionType(formName);
    let applicationReviewAction = '';
    if (approveOrSubmitted !== '') {
      actionType = approveOrSubmitted;
      applicationReviewAction = this.getActionType(formName);
    }
    const applicationSource = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
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
    let reFetchPayLoad = {
      applicationId,
      applicationType: applicationSource,
    };
    if (applicationSource === 'APPLICATION_COMPLETED') {
      reFetchPayLoad = { ...reFetchPayLoad, userId };
    }
    const progressButton = approveOrSubmitted === 'REVIEW_APPROVED' ? approvedStatus ? 'REVIEW_APPROVED' : 'REVIEW_DECLINED' : approveOrSubmitted === 'REVIEW_SUBMITTED' ? 'REVIEW_SUBMITTED' : 'SAVE';
    this.setFieldvalue('inProgress', progressButton);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateApplicationStatusAndReview,
          variables: payload,
          refetchQueries:
            [{ query: getBusinessApplicationsDetailsAdmin, variables: reFetchPayLoad }],
        })
        .then((result) => {
          this.removeUploadedFiles();
          Helper.toast('Data saved successfully.', 'success');
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          this.setFieldvalue('inProgress', false);
        });
    });
  }

  @computed get fetchBusinessApplicationOffers() {
    return (this.businessApplicationOffers && this.businessApplicationOffers.data
      && this.businessApplicationOffers.data.businessApplication
      && toJS(this.businessApplicationOffers.data.businessApplication)
    ) || null;
  }

  @computed get offerLoading() {
    return this.businessApplicationOffers.loading;
  }

  @action
  fetchApplicationOffers = applicationId => new Promise((resolve) => {
    uiStore.setAppLoader(true);
    uiStore.setLoaderMessage('Getting application data');
    this.businessApplicationOffers = graphql({
      client,
      query: getBusinessApplicationOffers,
      variables: {
        id: applicationId,
      },
      fetchPolicy: 'network-only',
      onFetch: () => {
        uiStore.setAppLoader(false);
        resolve();
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setAppLoader(false);
      },
    });
  });

  @computed get offerStructure() {
    const offerData = this.fetchBusinessApplicationOffers;
    const offer = offerData && offerData.offers && offerData.offers.offer[this.selectedOfferIndex]
      ? offerData.offers.offer[this.selectedOfferIndex] : null;
    return offer.structure;
  }
  revenueSharing = () => {
    const offerData = this.fetchBusinessApplicationOffers;
    const offer = offerData && offerData.offers && offerData.offers.offer[this.selectedOfferIndex]
      ? offerData.offers.offer[this.selectedOfferIndex] : null;
    if (this.offerStructure === 'REVENUE_SHARING_NOTE' && offer.mthRevenueSharing) {
      const { expectedAnnualRevenue } = offerData.offers;
      const result = [];
      let cumPayment = '0.00';
      expectedAnnualRevenue.map((key, index) => {
        const floatYear = key.year && key.year !== 0 ? money.floatToAmount(key.year.toString()) : '0.00';
        const revenueShare = money.floatToAmount(offer.mthRevenueSharing.toString());
        cumPayment = money.add(cumPayment, money.percent(
          floatYear,
          revenueShare,
        ));
        if (floatYear !== '0.00') {
          result.push({
            yearAmount: index + 1,
            annualRevenue: Helper.CurrencyFormat(key.year, 2),
            revenueSharingPercentage: `${offer.mthRevenueSharing} %`,
            paymentAmount: Helper.CurrencyFormat(money.percent(
              floatYear,
              revenueShare,
            ), 2),
            cumulativePayments: Helper.CurrencyFormat(cumPayment, 2),
          });
        }
        return null;
      });
      return result;
    }
    return [];
  }
  paymentChart = () => {
    const offerData = this.fetchBusinessApplicationOffers;
    const offer = offerData.offers.offer[this.selectedOfferIndex];
    if (this.offerStructure === 'TERM_NOTE') {
      const data = {
        method: 'mortgage',
        apr: offer.interestRate,
        balance: offer.minimumAmount,
        loanTerm: offer.maturity,
      };
      const { schedule, balance } = Calculator.calculate(data);
      const formattedSchedule = [];
      schedule.map((sc, index) => {
        const previousBalance = index === 0 ? money.floatToAmount(balance.toString()) :
          money.floatToAmount(schedule[index - 1].remainingBalance);
        const interestAmount = money.floatToAmount(sc.interest.toString());
        const principalAmount = money.floatToAmount(sc.principal.toString());
        const totalMonthlyPayment = money.floatToAmount(money.add(principalAmount, interestAmount));
        formattedSchedule.push({
          index: index + 1,
          loanAmount: Helper.CurrencyFormat(previousBalance, 2),
          monthlyPayment: Helper.CurrencyFormat(totalMonthlyPayment, 2),
          interestAmount: Helper.CurrencyFormat(sc.interest, 2),
          principalAmount: Helper.CurrencyFormat(sc.principal, 2),
          balanceAmount: Helper.CurrencyFormat(money.floatToAmount(sc.remainingBalance), 2),
          interestPercentage: `${money.div(money.mul('100.00', interestAmount), totalMonthlyPayment)} %`,
          principalPercentage: `${money.div(money.mul('100.00', principalAmount), totalMonthlyPayment)} %`,
        });
        return null;
      });
      return formattedSchedule;
    }
    return [];
  }

  @action
  signPortalAgreement = () => {
    const offerData = this.fetchBusinessApplicationOffers;
    const offer = offerData.offers.offer[this.selectedOfferIndex];
    delete offer.__typename;
    uiStore.setProgress();
    let payLoad = {
      applicationId: offerData.applicationId,
      issuerId: offerData.userId,
      selectedOffer: offer,
      callbackUrl: `${window.location.origin}/secure-gateway`,
    };
    if (!offer.isAccepted) {
      payLoad = {
        ...payLoad,
        isSelectedOfferChanged: true,
      };
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: signPortalAgreement,
          variables: payLoad,
        })
        .then((result) => {
          this.setFieldvalue('signPortalAgreementURL', result.data.signPortalAgreement);
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
  createOffering = (applicationId) => {
    uiStore.setProgress();
    const issuerId = userStore.currentUser ? userStore.currentUser.sub : '';
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createOffering,
          variables: {
            applicationId,
          },
          refetchQueries: [{ query: allOfferingsCompact, variables: { stage: 'CREATION', issuerId } }],
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

  getPortalAgreementStatus = () => new Promise((resolve) => {
    const offerData = this.fetchBusinessApplicationOffers;
    graphql({
      client,
      query: getPortalAgreementStatus,
      variables: {
        applicationId: offerData.applicationId,
        issuerId: offerData.userId,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setAppLoader(false);
      },
    });
  });

  @action
  generatePortalAgreement = () => {
    this.saveReviewForms('OFFERS_FRM').then(() => {
      const { businessApplicationDetailsAdmin } = businessAppStore;
      const { applicationId, userId } = businessApplicationDetailsAdmin;
      const reFetchPayLoad = {
        applicationId,
        applicationType: 'APPLICATION_COMPLETED',
        userId,
      };
      this.setFieldvalue('inProgress', 'GENERATE_PA');
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation: generatePortalAgreement,
            variables: {
              applicationId,
              userId,
            },
            refetchQueries:
              [{ query: getBusinessApplicationsDetailsAdmin, variables: reFetchPayLoad }],
          })
          .then((result) => {
            Helper.toast('Portal agreement generated successfully.', 'success');
            resolve(result);
          })
          .catch((error) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
            reject(error);
          })
          .finally(() => {
            this.setFieldvalue('inProgress', false);
          });
      });
    }).catch(() => {
      Helper.toast('Something went wrong, please try again later.', 'error');
      this.setFieldvalue('inProgress', false);
    });
  };

  @action
  setFormData = (form, ref, store = 'appStore') => {
    const { businessApplicationDetailsAdmin } = businessAppStore;
    const appData = store === 'appStore' ? businessApplicationDetailsAdmin : this.fetchBusinessApplicationOffers;
    if (!appData) {
      return false;
    }
    this.paBoxFolderId = get(appData, 'storageDetails.Application.Review.Offer.id');
    this[form] = Validator.setFormData(this[form], appData, ref);
    this.initLoad.push(form);
    const multiForm = this.getActionType(form, 'isMultiForm');
    if (form !== 'MANAGERS_FRM') {
      this.checkFormValid(form, multiForm, false);
    }
    if (form === 'OFFERS_FRM') {
      if (appData && get(appData, 'offers.offer')) {
        appData.offers.offer.map((offer, index) => {
          this.showFormAmortisation(index);
          this.OFFERS_FRM.fields.offer[index].additionalTermsField.value =
            offer.additionalTerms ? 'Additional Terms Apply' : 'Add Terms';
          return null;
        });
      }
    }
    return false;
  }
  @action
  showFormAmortisation = (index) => {
    const maturity = this.OFFERS_FRM.fields.offer[index].maturity.value || 0;
    const interestRate = this.OFFERS_FRM.fields.offer[index].interestRate.value || 0;
    const minimumAmount = this.OFFERS_FRM.fields.offer[index].amount.value || 0;
    const Formdata = {
      method: 'mortgage',
      apr: interestRate,
      balance: minimumAmount,
      loanTerm: maturity,
    };
    const data = Calculator.calculate(Formdata);
    const amortizationAmount = data && data.schedule.length ?
      data.schedule[0].interest + data.schedule[0].principal : 0;
    const returnedAmount = amortizationAmount * maturity;
    this.OFFERS_FRM.fields.offer[index].totalCapital.value = ceil(returnedAmount);
    this.OFFERS_FRM.fields.offer[index].amortizationAmount.value = ceil(amortizationAmount);
  }
}
export default new BusinessAppReviewStore();
