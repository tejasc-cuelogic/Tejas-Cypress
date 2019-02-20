import { observable, action, computed, toJS } from 'mobx';
import { forEach, includes, find, isEmpty, has } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import {
  BUSINESS_PRE_QUALIFICATION_BASIC,
  BUSINESS_PRE_QUALIFICATION,
  BUSINESS_SIGNUP,
  BUSINESS_DETAILS,
  BUSINESS_PERF,
  BUSINESS_PERF_COMMON,
  BUSINESS_DOC,
  BUSINESS_APPLICATION_STATUS,
  BUSINESS_GOAL,
  BUSINESS_APP_FILE_UPLOAD_ENUMS,
  AFFILIATED_PARTNERS,
  LENDIO,
  NEED_HELP,
  BUSINESS_PRE_QUALIFICATION_REAL_ESTATE,
  BUSINESS_DOC_REAL_ESTATE,
  BUSINESS_APPLICATION_NOTIFICATION_CARD,
} from '../../../constants/businessApplication';
import Helper from '../../../../helper/utility';
import {
  getBusinessApplicationsById,
  getBusinessApplicationsDetailsAdmin,
  getPrequalBusinessApplicationsById,
  getBusinessApplications,
  createBusinessApplicationPrequalificaiton,
  createBusinessApplicationBasicInfo,
  upsertBusinessApplicationInformationPerformance,
  upsertBusinessApplicationInformationBusinessDetails,
  upsertBusinessApplicationInformationDocumentation,
  submitApplication,
  helpAndQuestion,
} from '../../queries/businessApplication';
import { uiStore, navStore, userDetailsStore, businessAppLendioStore, businessAppAdminStore, offeringsStore } from '../../index';
import { fileUpload } from '../../../actions';

export class BusinessAppStore {
  @observable BUSINESS_APP_FRM_BASIC =
  Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION_BASIC);
  @observable BUSINESS_APP_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
  @observable NEED_HELP_FRM = Validator.prepareFormObject(NEED_HELP);
  @observable BUSINESS_ACCOUNT =Validator.prepareFormObject(BUSINESS_SIGNUP);
  @observable BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
  @observable BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
  @observable BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
  @observable BUSINESS_APP_STATUS = '';
  @observable preQualFormDisabled = false;
  @observable formReadOnlyMode = false;
  @observable BUSINESS_APP_STEP_URL = 'new/pre-qualification';
  @observable BUSINESS_APPLICATION_DATA = null;
  @observable isPartialData = null;
  @observable applicationId = null;
  @observable currentApplicationType = 'business';
  @observable applicationStep = null;
  @observable businessApplicationsList = null;
  @observable currentApplicationId = null;
  @observable businessApplicationsDataById = null;
  @observable isFetchedData = null;
  @observable removeFileIdsList = [];
  @observable appStepsStatus = [{ path: 'pre-qualification', status: 'IN_PROGRESS' }, { path: 'business-details', status: null }, { path: 'performance', status: null }, { path: 'documentation', status: null }];
  @observable isFileUploading = false;
  @observable isPrequalQulify = false;
  @observable userExists = false;
  @observable urlParameter = null;

  @action
  setFieldvalue = (field, value) => {
    this[field] = value;
  }

  @action
  setAppStepsStatus = (index, key, value) => {
    this.appStepsStatus[index][key] = value;
  }

  @action
  businessDocChange = (e, res) => {
    this.BUSINESS_DOC_FRM = Validator.onChange(this.BUSINESS_DOC_FRM, Validator.pullValues(e, res));
  };

  @computed get getInvestmentTypeTooltip() {
    const { fields } = this.BUSINESS_APP_FRM;
    const field = fields.investmentType.values.find(investmentType =>
      investmentType.value === fields.investmentType.value);
    return field ? field.tooltip : null;
  }

  @action
  checkFormisValid = (step, showErrors = false) => {
    let status = false;
    if (step === 'business-details') {
      this.BUSINESS_DETAILS_FRM =
        Validator.validateForm(this.BUSINESS_DETAILS_FRM, true, showErrors);
      status = this.BUSINESS_DETAILS_FRM.meta.isValid;
    } else if (step === 'performance') {
      this.BUSINESS_PERF_FRM = Validator.validateForm(this.BUSINESS_PERF_FRM, false, showErrors);
      status = this.BUSINESS_PERF_FRM.meta.isValid;
    } else if (step === 'documentation') {
      this.BUSINESS_DOC_FRM = Validator.validateForm(this.BUSINESS_DOC_FRM, false, showErrors);
      status = this.BUSINESS_DOC_FRM.meta.isValid;
    }
    return status;
  }

  @computed get getPersonalGuaranteeCondition() {
    return this.BUSINESS_DOC_FRM.fields.personalGuarantee.value === true;
  }

  @action
  businessPerfMaskingChange = (values, field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(
      this.BUSINESS_PERF_FRM,
      { name: field, value: values.floatValue },
    );
  };

  @action
  fetchApplicationDataById = (applicationId, isPartialApp = false) => new Promise((resolve) => {
    uiStore.setAppLoader(true);
    uiStore.setLoaderMessage('Getting application data');
    this.businessApplicationsDataById = graphql({
      client: isPartialApp ? clientPublic : client,
      query: isPartialApp ? getPrequalBusinessApplicationsById : getBusinessApplicationsById,
      variables: {
        id: applicationId,
      },
      fetchPolicy: 'network-only',
      onFetch: () => {
        this.setBusinessApplicationData(isPartialApp);
        uiStore.setAppLoader(false);
        resolve();
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setAppLoader(false);
      },
    });
  });

  @action
  fetchAdminApplicationById = (appId, appType, userId) => new Promise((resolve) => {
    this.setFieldvalue('applicationId', appId);
    const applicationType = appType === 'prequal-failed' ? 'APPLICATIONS_PREQUAL_FAILED' : 'APPLICATION_COMPLETED';
    let payLoad = {
      applicationId: appId,
      applicationType,
    };
    if (applicationType === 'APPLICATION_COMPLETED') {
      payLoad = { ...payLoad, userId };
    }
    uiStore.setAppLoader(true);
    uiStore.setLoaderMessage('Getting application data');
    this.businessApplicationsDataById = graphql({
      client,
      query: getBusinessApplicationsDetailsAdmin,
      variables: payLoad,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        this.setFieldvalue('currentApplicationType', data.businessApplicationsDetailsAdmin.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate');
        const {
          prequalDetails, signupCode, businessGeneralInfo, utmSource,
        } = data.businessApplicationsDetailsAdmin;
        businessAppAdminStore
          .setBusinessDetails(
            ((businessGeneralInfo && businessGeneralInfo.businessName) ||
            (prequalDetails.businessGeneralInfo.businessName)),
            signupCode, utmSource,
          );
        this.setBusinessApplicationData(false, data.businessApplicationsDetailsAdmin);
        uiStore.setAppLoader(false);
        resolve(data);
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setAppLoader(false);
      },
    });
  });

  @action
  getBusinessApplications = () => {
    // applicationList
    this.businessApplicationsList = graphql({
      client,
      query: getBusinessApplications,
      fetchPolicy: 'network-only',
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @computed get stepToRender() {
    const url = this.appStepsStatus.find(ele => (ele.status === null || ele.status === 'IN_PROGRESS'));
    /* eslint-disable no-unneeded-ternary */
    return this.formReadOnlyMode ? { path: 'pre-qualification' } : url ? url : { path: 'documentation' };
  }

  @action
  setBusinessApplicationData = (isPartialApp, outputData = null) => {
    this.formReset();
    if (outputData) {
      this.setFieldvalue('formReadOnlyMode', true);
      this.setFieldvalue('isPrequalQulify', true);
    }
    this.step = 'performace';
    const data = outputData ? outputData : !isPartialApp ? this.fetchBusinessApplicationsDataById :
      this.fetchPrequalBusinessApplicationsDataById;
    if (data) {
      if (!isPartialApp) {
        if ((data.applicationStatus || data.prequalStatus) ===
          BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
          this.setPrequalDetails(data);
        } else {
          this.setPrequalDetails(data.prequalDetails);
          this.setBusinessDetails(data.businessDetails);
          this.setPerformanceDetails(data.businessPerformance, data.prequalDetails);
          this.setDocumentationDetails(data.businessDocumentation);
        }
        if (((data.applicationStatus || data.prequalStatus) ===
          BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED) ||
          ((data.applicationStatus || data.prequalStatus) ===
          BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL)) {
          this.formReadOnlyMode = true;
        } else if ((data.applicationStatus || data.prequalStatus) ===
          BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
          this.appStepsStatus[0].status = 'IN_PROGRESS';
        }
        this.setFieldvalue('currentApplicationType', data.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate');
        navStore.setAccessParams('appStatus', (data.applicationStatus || data.prequalStatus));
        this.setPrequalBasicDetails();
      }
      if (data.lendio) {
        const lendioPartners = data.lendio.status;
        if (data.prequalStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
          && lendioPartners === LENDIO.LENDIO_PRE_QUALIFICATION_SUCCESSFUL) {
          businessAppLendioStore.setPartneredLendioData(data);
        }
      }
    }
  };

  @action
  setPrequalBasicDetails = () => {
    this.isPrequalQulify = true;
    const { info, email } = userDetailsStore.userDetails;
    if (info && email) {
      this.BUSINESS_APP_FRM_BASIC.fields.firstName.value = info.firstName;
      this.BUSINESS_APP_FRM_BASIC.fields.lastName.value = info.lastName;
      this.BUSINESS_APP_FRM_BASIC.fields.email.value = email.address;
    }
  }

  @action
  setPrequalDetails = (data) => {
    if (data) {
      this.appStepsStatus[0].status = 'COMPLETE';
      ['street', 'city', 'state', 'zipCode'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessGeneralInfo.address[ele];
      });
      ['website', 'businessName'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessGeneralInfo[ele];
      });
      ['amountNeeded', 'estimatedCreditScore', 'industryExperience', 'totalProjectCost'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessExperience[ele];
      });
      data.fundUsage.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.fundUsage.value.push(ele);
      });
      data.industryTypes.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.industryTypes.value.push(ele);
      });
      data.legalConfirmations.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.legalConfirmation.value.push(ele.value && ele.label);
      });
      this.BUSINESS_APP_FRM.fields.phoneNumber.value =
        data.businessGeneralInfo.contactDetails.phone.number;
      if (this.currentApplicationType === 'business') {
        ['businessModel', 'businessGoal', 'businessEntityStructure', 'franchiseHolder'].forEach((ele) => {
          this.BUSINESS_APP_FRM.fields[ele].value = data[ele];
        });
        ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
          const field = ['nextYearCogSold', 'nextYearGrossSales', 'nextYearNetIncome', 'nextYearOperatingExpenses'];
          this.BUSINESS_APP_FRM.fields[field[key]].value =
            data.performanceSnapshot.nextYearSnapshot[ele];
        });
        if (this.getBusinessTypeCondtion) {
          ['ageYears', 'ageMonths'].forEach((ele, key) => {
            const field = ['businessAgeYears', 'businessAgeMonths'];
            this.BUSINESS_APP_FRM.fields[field[key]].value =
              data.existingBusinessInfo[ele];
          });
          ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
            const field = ['previousYearCogSold', 'previousYearGrossSales', 'previousYearNetIncome', 'previousYearOperatingExpenses'];
            this.BUSINESS_APP_FRM.fields[field[key]].value =
              data.performanceSnapshot.pastYearSnapshot[ele];
          });
        }
      } else {
        data.realEstateTypes.forEach((ele) => {
          this.BUSINESS_APP_FRM.fields.realEstateType.value.push(ele);
        });
        ['investmentType', 'ownOrOperateProperty', 'businessEntityStructure'].forEach((ele) => {
          this.BUSINESS_APP_FRM.fields[ele].value = data[ele];
        });
        ['investorIRR', 'annualInvestorRoi', 'holdTimeInYears'].forEach((ele) => {
          this.BUSINESS_APP_FRM.fields[ele].value = data.target[ele];
        });
      }
      this.BUSINESS_APP_FRM.meta.isValid = false;
      this.preQualFormDisabled = true;
    }
  }

  @action
  setFileObjectToForm = (data, form, field) => {
    fileUpload.resetFileObj(this[form].fields[field]);
    data.forEach((ele) => {
      this[form].fields[field].value.push(ele.fileName);
      this[form].fields[field].fileId.push(ele.fileId);
    });
  }

  @action
  setBusinessDetails = (data) => {
    if (data) {
      this.appStepsStatus[1].status = data.stepStatus;
      data.debts.forEach((ele, key) => {
        ['amount', 'interestExpenses', 'remainingPrincipal', 'term'].forEach((field) => {
          this.BUSINESS_DETAILS_FRM.fields.debts[key][field].value = ele[field];
        });
        if (key < data.debts.length - 1) {
          this.addMoreForms(null, 'debts');
        }
      });
      data.owners.forEach((ele, key) => {
        ['companyOwnerShip', 'fullLegalName', 'linkedInUrl', 'ssn', 'dateOfService', 'yearsOfExp', 'title', 'resume'].forEach((field) => {
          if (field === 'resume') {
            this.BUSINESS_DETAILS_FRM.fields.owners[key][field].value = ele[field][0].fileName;
            this.BUSINESS_DETAILS_FRM.fields.owners[key][field].fileId = ele[field][0].fileId;
          } else {
            this.BUSINESS_DETAILS_FRM.fields.owners[key][field].value = ele[field];
          }
        });
        if (key < data.owners.length - 1) {
          this.addMoreForms(null, 'owners');
        }
      });
      if (data.planDocs && data.planDocs.length) {
        this.setFileObjectToForm(data.planDocs, 'BUSINESS_DETAILS_FRM', 'businessPlan');
      }
    }
    this.BUSINESS_DETAILS_FRM = Validator.validateForm(this.BUSINESS_DETAILS_FRM, true);
  }

  @action
  setPerformanceDetails = (data, prequalData) => {
    if (data) {
      this.appStepsStatus[2].status = data.stepStatus;
      if (data.financialStatements.fiveYearProjection &&
        data.financialStatements.fiveYearProjection.length) {
        this.setFileObjectToForm(data.financialStatements.fiveYearProjection, 'BUSINESS_PERF_FRM', 'fiveYearProjection');
      }
      if ((this.currentApplicationType === 'business' && this.getBusinessTypeCondtion) || (this.currentApplicationType !== 'business' && this.getOwnPropertyCondtion)) {
        ['priorToThreeYear', 'ytd'].forEach((field) => {
          if (data.financialStatements[field] && data.financialStatements[field].length) {
            this.setFileObjectToForm(data.financialStatements[field], 'BUSINESS_PERF_FRM', field);
          }
        });
      } else {
        ['priorToThreeYear', 'ytd'].forEach((ele) => {
          this.BUSINESS_PERF_FRM.fields[ele].rule = '';
        });
      }
      if (this.currentApplicationType === 'business' && data.performance) {
        ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
          const field = ['nyCogs', 'nyGrossSales', 'nyNetIncome', 'nyOperatingExpenses'];
          this.BUSINESS_PERF_FRM.fields[field[key]].value = data.performance.nextYearSnapshot[ele];
        });
        if (this.getBusinessTypeCondtion) {
          ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
            const field = ['pyCogs', 'pyGrossSales', 'pyNetIncome', 'pyOperatingExpenses'];
            this.BUSINESS_PERF_FRM.fields[field[key]].value =
            data.performance.pastYearSnapshot[ele];
            this.BUSINESS_PERF_FRM.fields[field[key]].rule = 'required';
          });
        } else {
          ['pyCogs', 'pyGrossSales', 'pyNetIncome', 'pyOperatingExpenses'].forEach((ele) => {
            this.BUSINESS_PERF_FRM.fields[ele].rule = '';
          });
        }
      }
    } else if (prequalData) {
      if (this.currentApplicationType === 'business') {
        ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
          const field = ['nyCogs', 'nyGrossSales', 'nyNetIncome', 'nyOperatingExpenses'];
          this.BUSINESS_PERF_FRM.fields[field[key]].value =
          prequalData.performanceSnapshot.nextYearSnapshot[ele];
        });
        if (this.getBusinessTypeCondtion) {
          ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
            const field = ['pyCogs', 'pyGrossSales', 'pyNetIncome', 'pyOperatingExpenses'];
            this.BUSINESS_PERF_FRM.fields[field[key]].value =
            prequalData.performanceSnapshot.pastYearSnapshot[ele];
          });
        } else {
          ['priorToThreeYear', 'ytd', 'pyCogs', 'pyGrossSales', 'pyNetIncome', 'pyOperatingExpenses'].forEach((ele) => {
            this.BUSINESS_PERF_FRM.fields[ele].rule = '';
          });
        }
      } else if (!this.getOwnPropertyCondtion) {
        ['priorToThreeYear', 'ytd'].forEach((ele) => {
          this.BUSINESS_PERF_FRM.fields[ele].rule = '';
        });
      }
    }
    this.BUSINESS_PERF_FRM = Validator.validateForm(this.BUSINESS_PERF_FRM);
  }

  @action
  setDocumentationDetails = (data) => {
    if (data) {
      this.appStepsStatus[3].status = data.stepStatus;
      if (this.currentApplicationType === 'business') {
        this.BUSINESS_DOC_FRM.fields.blanketLien.value = data.blanketLien !== '' ? data.blanketLien : '';
        this.BUSINESS_DOC_FRM.fields.personalGuarantee.value = data.providePersonalGuarantee === '' ? '' : data.providePersonalGuarantee;
        if (data.personalGuarantee && data.personalGuarantee.length) {
          this.setFileObjectToForm(data.personalGuarantee, 'BUSINESS_DOC_FRM', 'personalGuaranteeForm');
        }

        ['bankStatements', 'businessTaxReturns', 'leaseAgreementsOrLOIs', 'personalTaxReturns'].forEach((field, key) => {
          const formField = ['bankStatements', 'businessTaxReturn', 'leaseAgreementsOrLOIs', 'personalTaxReturn'];
          if (this.getBusinessTypeCondtion) {
            if (data[field] && data[field].length) {
              this.setFileObjectToForm(data[field], 'BUSINESS_DOC_FRM', formField[key]);
            }
          } else if (field === 'leaseAgreementsOrLOIs' || field === 'personalTaxReturns') {
            if (data[field] && data[field].length) {
              this.setFileObjectToForm(data[field], 'BUSINESS_DOC_FRM', formField[key]);
            }
          } else {
            this.BUSINESS_DOC_FRM.fields[formField[key]].rule = '';
          }
        });
        this.checkValidationForTaxReturn();
      } else {
        ['dueDiligence', 'legalDocs'].forEach((field) => {
          if (data[field] && data[field].length) {
            this.setFileObjectToForm(data[field], 'BUSINESS_DOC_FRM', field);
          }
        });
      }
    } else if (this.currentApplicationType === 'business' && !this.getBusinessTypeCondtion) {
      ['bankStatements', 'businessTaxReturn'].forEach((ele) => {
        this.BUSINESS_DOC_FRM.fields[ele].rule = '';
      });
    }
    this.BUSINESS_DOC_FRM = Validator.validateForm(this.BUSINESS_DOC_FRM);
  }

  @computed get fetchBusinessApplicationsDataById() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.businessApplication
      && toJS(this.businessApplicationsDataById.data.businessApplication)
    ) || null;
  }

  @computed get businessApplicationDetailsAdmin() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.businessApplicationsDetailsAdmin
      && toJS(this.businessApplicationsDataById.data.businessApplicationsDetailsAdmin)
    ) || null;
  }

  @computed get applicationReviewLoading() {
    return this.businessApplicationsDataById.loading;
  }

  @computed get fetchPrequalBusinessApplicationsDataById() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.getPreQualificationById
      && toJS(this.businessApplicationsDataById.data.getPreQualificationById)
    ) || null;
  }

  @computed get fetchBusinessApplication() {
    return (this.businessApplicationsList && this.businessApplicationsList.data
      && this.businessApplicationsList.data.businessApplications
      && toJS(this.businessApplicationsList.data.businessApplications)
    ) || [];
  }

  @action
  businessDetailsDateChange = (field, date, index = -1) => {
    this.BUSINESS_DETAILS_FRM = Validator.onArrayFieldChange(
      this.BUSINESS_DETAILS_FRM,
      { name: field, value: date },
      'owners',
      index,
    );
  }
  @action
  businessDetailsMaskingChange = (field, values, subFormName = '', index = -1) => {
    if (subFormName) {
      this.BUSINESS_DETAILS_FRM = Validator.onArrayFieldChange(
        this.BUSINESS_DETAILS_FRM,
        { name: field, value: values.floatValue },
        subFormName,
        index,
      );
    } else {
      this.BUSINESS_DETAILS_FRM = Validator.onChange(
        this.BUSINESS_DETAILS_FRM,
        { name: field, value: values.floatValue },
      );
    }
  };

  @action
  businessDetailsChange = (e, res, formName = '', index = -1) => {
    if (formName) {
      this.BUSINESS_DETAILS_FRM = Validator.onArrayFieldChange(
        this.BUSINESS_DETAILS_FRM,
        Validator.pullValues(e, res),
        formName,
        index,
      );
    } else {
      this.BUSINESS_DETAILS_FRM = Validator.onChange(
        this.BUSINESS_DETAILS_FRM,
        Validator.pullValues(e, res),
      );
    }
  };

  @action
  businessAppEleChange = (e, res, formName = 'BUSINESS_APP_FRM') => {
    this[formName] = Validator.onChange(this[formName], Validator.pullValues(e, res));
  };

  @action
  businessAppEleMaskChange = (values, field, formName = 'BUSINESS_APP_FRM') => {
    this[formName] = Validator.onChange(
      this[formName],
      { name: field, value: values.floatValue },
    );
  };

  @computed get getBusinessTypeCondtion() {
    return (this.currentApplicationType === 'business' && this.BUSINESS_APP_FRM.fields.businessGoal.value &&
      this.BUSINESS_APP_FRM.fields.businessGoal.value !== BUSINESS_GOAL.FRANCHISE
      && this.BUSINESS_APP_FRM.fields.businessGoal.value !== BUSINESS_GOAL.BRAND_NEW);
  }

  @computed get getOwnPropertyCondtion() {
    return (this.currentApplicationType !== 'business' && this.BUSINESS_APP_FRM.fields.ownOrOperateProperty.value);
  }

  @computed get getFranchiseCondition() {
    return (this.currentApplicationType === 'business' && this.BUSINESS_APP_FRM.fields.businessGoal.value &&
      this.BUSINESS_APP_FRM.fields.businessGoal.value === BUSINESS_GOAL.FRANCHISE);
  }

  @computed get canSubmitApp() {
    const notOkForms = ['BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    const isPartial = this.appStepsStatus.filter(step => (step.status === 'IN_PROGRESS' || step.status === null));

    return notOkForms.length === 0 && isPartial.length === 0;
  }

  @computed get ButtonTextToggle() {
    const applicationStep = this.applicationStep !== '' ? this.applicationStep : 'documentation';
    const notOkForms = ['BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    const isPartial = this.appStepsStatus.filter(step => step.path !== applicationStep && (step.status === 'IN_PROGRESS' || step.status === null));

    return (notOkForms.length === 0 && isPartial.length === 0) ? 'Submit' : 'Save';
  }

  getFilesArray = (data, form) => {
    const arr = data ? data.map((item, key) => (
      { fileId: form.fileId[key] ? form.fileId[key] : '', fileName: item }
    )) : [];
    return arr;
  }

  @action
  getValidDataForString = (data) => {
    let val = '';
    if (data && data.value !== '' && data.value !== undefined && data.value !== null && !data.error) {
      val = data.value;
    }
    return val;
  }

  @action
  getValidDataForInt = (data, decimal = 0) => {
    let val = decimal ? 0.00 : 0;
    if (data && data.value !== '' && data.value !== undefined && data.value !== null && !data.error) {
      val = decimal ? parseFloat(data.value, 2) : parseInt(data.value, 10);
    }
    return val;
  }

  @computed get getFormatedBusinessDetailsData() {
    const data = toJS(this.BUSINESS_DETAILS_FRM.fields);
    return {
      planDocs: this.getFilesArray(data.businessPlan.value, data.businessPlan),
      debts: data.debts.map(item => ({
        amount: this.getValidDataForInt(item.amount),
        interestExpenses: this.getValidDataForInt(item.interestExpenses),
        remainingPrincipal: this.getValidDataForInt(item.remainingPrincipal),
        term: this.getValidDataForInt(item.term),
      })),
      owners: data.owners.map(item => ({
        fullLegalName: this.getValidDataForString(item.fullLegalName),
        yearsOfExp: this.getValidDataForInt(item.yearsOfExp),
        ssn: this.getValidDataForString(item.ssn),
        dateOfService: item.dateOfService.value ? moment(item.dateOfService).format('MM-DD-YYYY') : null,
        companyOwnerShip: this.getValidDataForInt(item.companyOwnerShip, 1),
        linkedInUrl: this.getValidDataForString(item.linkedInUrl),
        title: this.getValidDataForString(item.title),
        resume: [
          {
            fileId: (item && item.resume.fileId !== undefined && item.resume.fileId !== '' && item.resume.fileId !== null && !item.resume.error) ? item.resume.fileId : '',
            fileName: (item && item.resume.value !== undefined && item.resume.value !== '' && item.resume.value !== null && !item.resume.error) ? item.resume.value : '',
          },
        ],
      })),
    };
  }

  @computed get getFormatedPerformanceData() {
    const data = toJS(this.BUSINESS_PERF_FRM.fields);
    let inputData = {
      financialStatements: {
        priorToThreeYear: this.getFilesArray(
          data.priorToThreeYear.value,
          this.BUSINESS_PERF_FRM.fields.priorToThreeYear,
        ),
        ytd: this.getFilesArray(data.ytd.value, this.BUSINESS_PERF_FRM.fields.ytd),
        fiveYearProjection: this.getFilesArray(
          data.fiveYearProjection.value,
          this.BUSINESS_PERF_FRM.fields.fiveYearProjection,
        ),
      },
    };
    if (this.currentApplicationType === 'business') {
      inputData = {
        ...inputData,
        performance: {
          nextYearSnapshot: {
            grossSales: this.getValidDataForInt(data.nyGrossSales),
            cogSold: this.getValidDataForInt(data.nyCogs),
            operatingExpenses: this.getValidDataForInt(data.nyOperatingExpenses),
            netIncome: this.getValidDataForInt(data.nyNetIncome),
          },
          pastYearSnapshot: {
            grossSales: this.getValidDataForInt(data.pyGrossSales),
            cogSold: this.getValidDataForInt(data.pyCogs),
            operatingExpenses: this.getValidDataForInt(data.pyOperatingExpenses),
            netIncome: this.getValidDataForInt(data.pyNetIncome),
          },
        },
      };
    }
    return inputData;
  }

  @computed get getFormatedDocumentationData() {
    const data = toJS(this.BUSINESS_DOC_FRM.fields);
    let inputData;
    if (this.currentApplicationType === 'business') {
      inputData = {
        bankStatements: this.getFilesArray(
          data.bankStatements.value,
          this.BUSINESS_DOC_FRM.fields.bankStatements,
        ),
        leaseAgreementsOrLOIs: this.getFilesArray(
          data.leaseAgreementsOrLOIs.value,
          this.BUSINESS_DOC_FRM.fields.leaseAgreementsOrLOIs,
        ),
        personalTaxReturns: this.getFilesArray(
          data.personalTaxReturn.value,
          this.BUSINESS_DOC_FRM.fields.personalTaxReturn,
        ),
        businessTaxReturns: this.getFilesArray(
          data.businessTaxReturn.value,
          this.BUSINESS_DOC_FRM.fields.businessTaxReturn,
        ),
        personalGuarantee: this.BUSINESS_DOC_FRM.fields.personalGuarantee.value === true ?
          this.getFilesArray(
            data.personalGuaranteeForm.value,
            this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm,
          ) : [],
        blanketLien: this.BUSINESS_DOC_FRM.fields.blanketLien.value === '' ? '' : this.BUSINESS_DOC_FRM.fields.blanketLien.value,
        providePersonalGuarantee: this.BUSINESS_DOC_FRM.fields.personalGuarantee.value === '' ? '' : this.BUSINESS_DOC_FRM.fields.personalGuarantee.value,
      };
    } else {
      inputData = {
        dueDiligence: this.getFilesArray(
          data.dueDiligence.value,
          this.BUSINESS_DOC_FRM.fields.dueDiligence,
        ),
        legalDocs: this.getFilesArray(
          data.legalDocs.value,
          this.BUSINESS_DOC_FRM.fields.legalDocs,
        ),
      };
    }
    return inputData;
  }

  @computed get getFormatedPreQualificationData() {
    const data = toJS(this.BUSINESS_APP_FRM.fields);
    const basicInfo = Validator.ExtractValues(this.BUSINESS_APP_FRM_BASIC.fields);
    let preQualData = {
      id: this.applicationId,
      applicationType: this.currentApplicationType === 'business' ? 'BUSINESS' : 'COMMERCIAL_REAL_ESTATE',
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      email: basicInfo.email,
      businessGeneralInfo: {
        businessName: data.businessName.value,
        address: {
          street: data.street.value,
          city: data.city.value,
          state: data.state.value,
          zipCode: data.zipCode.value,
        },
        website: data.website.value,
        contactDetails: {
          phone: {
            number: data.phoneNumber.value,
            countryCode: '1',
          },
        },
      },
      industryTypes: data.industryTypes.value,
      businessExperience: {
        industryExperience: data.industryExperience.value,
        estimatedCreditScore: data.estimatedCreditScore.value,
        totalProjectCost: data.totalProjectCost.value,
        amountNeeded: data.amountNeeded.value,
      },
      fundUsage: data.fundUsage.value,
      performanceSnapshot: {
        nextYearSnapshot: {
          grossSales: this.getValidDataForInt(data.nextYearGrossSales),
          cogSold: this.getValidDataForInt(data.nextYearCogSold),
          operatingExpenses: this.getValidDataForInt(data.nextYearOperatingExpenses),
          netIncome: this.getValidDataForInt(data.nextYearNetIncome),
        },
      },
      businessEntityStructure: data.businessEntityStructure.value,
      // legalConfirmations: data.legalConfirmation.value,
      legalConfirmations: [{
        label: 'IS_NOT_CONDUCTING_OFFERING',
        value: includes(data.legalConfirmation.value, 'IS_NOT_CONDUCTING_OFFERING'),
      },
      {
        label: 'IS_ORGANIZED_IN_USA',
        value: includes(data.legalConfirmation.value, 'IS_ORGANIZED_IN_USA'),
      },
      {
        label: 'HAS_NOT_SOLD_SECURITIES',
        value: includes(data.legalConfirmation.value, 'HAS_NOT_SOLD_SECURITIES'),
      },
      {
        label: 'HAS_NEVER_FILED_BANKRUPTCY',
        value: includes(data.legalConfirmation.value, 'HAS_NEVER_FILED_BANKRUPTCY'),
      },
      {
        label: 'HAS_NEVER_BEEN_CONVICTED_OF_FRAUD',
        value: includes(data.legalConfirmation.value, 'HAS_NEVER_BEEN_CONVICTED_OF_FRAUD'),
      },
      {
        label: 'HAS_NEVER_BEEN_CONVICTED_OF_CRIMINAL_OFFENCE',
        value: includes(data.legalConfirmation.value, 'HAS_NEVER_BEEN_CONVICTED_OF_CRIMINAL_OFFENCE'),
      },
      {
        label: 'IS_NOT_BROKER_DEALER',
        value: includes(data.legalConfirmation.value, 'IS_NOT_BROKER_DEALER'),
      },
      {
        label: 'IS_NOT_INVESTMENT_COMPANY',
        value: includes(data.legalConfirmation.value, 'IS_NOT_INVESTMENT_COMPANY'),
      }],
    };
    if (this.getFranchiseCondition) {
      preQualData = { ...preQualData, franchiseHolder: data.franchiseHolder.value };
    }
    if (this.getBusinessTypeCondtion) {
      preQualData = {
        ...preQualData,
        existingBusinessInfo: {
          ageYears: this.getValidDataForInt(data.businessAgeYears),
          ageMonths: this.getValidDataForInt(data.businessAgeMonths),
        },
        performanceSnapshot: {
          ...preQualData.performanceSnapshot,
          pastYearSnapshot: {
            grossSales: this.getValidDataForInt(data.previousYearGrossSales),
            cogSold: this.getValidDataForInt(data.previousYearCogSold),
            operatingExpenses: this.getValidDataForInt(data.previousYearOperatingExpenses),
            netIncome: this.getValidDataForInt(data.previousYearNetIncome),
          },
        },
      };
    }
    if (this.currentApplicationType === 'business') {
      preQualData = {
        ...preQualData,
        businessGoal: data.businessGoal.value,
        businessModel: data.businessModel.value,
        legalConfirmations: [...preQualData.legalConfirmations,
          {
            label: 'HAS_NOT_RAISED_SECURITIES',
            value: includes(data.legalConfirmation.value, 'HAS_NOT_RAISED_SECURITIES'),
          }],
      };
    } else {
      preQualData = {
        ...preQualData,
        investmentType: data.investmentType.value,
        realEstateTypes: data.realEstateType.value,
        ownOrOperateProperty: data.ownOrOperateProperty.value,
        target: {
          investorIRR: data.investorIRR.value,
          annualInvestorRoi: data.annualInvestorRoi.value,
          holdTimeInYears: data.holdTimeInYears.value,
        },
      };
    }
    return preQualData;
  }

  @action
  businessPreQualificationBasicFormSumbit = () => {
    uiStore.setProgress();
    let payload = Validator.ExtractValues(this.BUSINESS_APP_FRM_BASIC.fields);
    payload = { ...payload, applicationType: this.currentApplicationType === 'business' ? 'BUSINESS' : 'COMMERCIAL_REAL_ESTATE' };
    if (this.urlParameter) {
      payload = has(this.urlParameter, 'signupCode') ? { ...payload, signupCode: this.urlParameter.signupCode } : { ...payload };
      payload = has(this.urlParameter, 'utmSource') ? { ...payload, utmSource: this.urlParameter.utmSource } : { ...payload };
    }
    return new Promise((resolve, reject) => {
      clientPublic
        .mutate({
          mutation: createBusinessApplicationBasicInfo,
          variables: {
            basicInfo: payload,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          const { id } = result.data.upsertPreQualBasicInfo;
          this.setFieldvalue('applicationId', id);
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
  businessPreQualificationFormSumbit = () => {
    const data = this.getFormatedPreQualificationData;
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      clientPublic
        .mutate({
          mutation: createBusinessApplicationPrequalificaiton,
          variables: {
            preQualificationData: data,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          const {
            data: {
              updatePrequalification: {
                partnerStatus,
                id,
                status,
                userExists,
              },
            },
          } = result;
          this.setFieldvalue('BUSINESS_APP_STATUS', status);
          this.setFieldvalue('userExists', userExists);
          let lendioPartners = '';
          if (!isEmpty(partnerStatus)) {
            lendioPartners = find(partnerStatus, { partnerId: AFFILIATED_PARTNERS.LENDIO });
          }
          // setting applicationid
          const applicationId = id;
          this.setFieldvalue('isFetchedData', null);
          this.setFieldvalue('applicationId', applicationId);
          if (this.BUSINESS_APP_STATUS ===
              BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED) {
            this.setFieldvalue('BUSINESS_APP_STEP_URL', `${this.currentApplicationType}/${applicationId}/success`);
          } else if (this.BUSINESS_APP_STATUS ===
              BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
            const url = (isEmpty(lendioPartners) || lendioPartners.status === LENDIO.LENDIO_PRE_QUALIFICATION_FAILED) ? `${this.currentApplicationType}/${applicationId}/failed` : `${this.currentApplicationType}/${applicationId}/failed/lendio`;
            this.setFieldvalue('BUSINESS_APP_STEP_URL', url);
            resolve(true);
          } else {
            this.setFieldvalue('BUSINESS_APP_STEP_URL', `${this.currentApplicationType}/${applicationId}/failed`);
          }
          resolve(false);
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
  needHelpFormSubmit = () => {
    const payload = Validator.ExtractValues(this.NEED_HELP_FRM.fields);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      clientPublic
        .mutate({
          mutation: helpAndQuestion,
          variables: {
            question: payload,
          },
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
  businessApplicationSubmitAction = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: submitApplication,
          variables: {
            applicationId: this.currentApplicationId,
          },
          refetchQueries: [{ query: getBusinessApplications }],
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
  businessAppParitalSubmit = () => {
    let data = this.getFormatedBusinessDetailsData;
    let stepName = 'BUSINESS_DETAILS';
    let isPartialDataFlag = true;
    let key = 0;
    let stepStatus = 'COMPLETE';
    if (this.applicationStep === 'business-details') {
      stepName = 'BUSINESS_DETAILS';
      this.BUSINESS_DETAILS_FRM = Validator.validateForm(this.BUSINESS_DETAILS_FRM, true);
      isPartialDataFlag = !this.BUSINESS_DETAILS_FRM.meta.isValid;
      key = 1;
    } else if (this.applicationStep === 'performance') {
      stepName = 'PERFORMANCE';
      this.BUSINESS_PERF_FRM = Validator.validateForm(this.BUSINESS_PERF_FRM);
      isPartialDataFlag = !this.BUSINESS_PERF_FRM.meta.isValid;
      key = 2;
    } else if (this.applicationStep === 'documentation') {
      stepName = 'DOCUMENTATION';
      this.BUSINESS_DOC_FRM = Validator.validateForm(this.BUSINESS_DOC_FRM);
      isPartialDataFlag = !this.BUSINESS_DOC_FRM.meta.isValid;
      key = 3;
    }
    stepStatus = isPartialDataFlag ? 'IN_PROGRESS' : 'COMPLETE';
    let mutationQuery = upsertBusinessApplicationInformationBusinessDetails;
    let variableData = {
      applicationId: this.currentApplicationId,
      applicationType: this.currentApplicationType === 'business' ? 'BUSINESS' : 'COMMERCIAL_REAL_ESTATE',
      isPartialData: isPartialDataFlag,
      applicationStep: stepName,
    };
    if (this.currentApplicationType === 'business') {
      variableData = {
        ...variableData,
        businessGoal: this.BUSINESS_APP_FRM.fields.businessGoal.value,
      };
    }
    if (stepName === 'BUSINESS_DETAILS') {
      variableData = {
        ...variableData,
        businessDetails: data,
      };
    } else if (stepName === 'PERFORMANCE') {
      data = this.getFormatedPerformanceData;
      variableData = {
        ...variableData,
        businessPerformance: data,
      };
      mutationQuery = upsertBusinessApplicationInformationPerformance;
    } else if (stepName === 'DOCUMENTATION') {
      data = this.getFormatedDocumentationData;
      variableData = {
        ...variableData,
        businessDocumentation: data,
      };
      mutationQuery = upsertBusinessApplicationInformationDocumentation;
    }
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutationQuery,
          variables: variableData,
          refetchQueries: [
            { query: getBusinessApplicationsById, variables: { id: this.currentApplicationId } },
            { query: getBusinessApplications },
          ],
        })
        .then((result) => {
          this.setAppStepsStatus(key, 'status', stepStatus);
          this.businessAppRemoveUploadedFiles();
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
  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'street', value: data.residentalStreet ? data.residentalStreet : '' });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'city', value: data.city ? data.city : '' });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'state', value: data.state ? data.state : '' });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'zipCode', value: data.zipCode ? data.zipCode : '' });
  };

  @action
  businessAppRemoveFiles = (fieldName, formName, index) => {
    if (fieldName === 'resume') {
      const removeFileIds = this[formName].fields.owners[index][fieldName].fileId;
      this[formName].fields.owners[index][fieldName].value = '';
      this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
    } else {
      const removeFileIds = this[formName].fields[fieldName].fileId.splice(index, 1);
      this[formName].fields[fieldName].value.splice(index, 1);
      this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds[0]];
    }
    if (fieldName === 'personalTaxReturn' || fieldName === 'businessTaxReturn') {
      this.checkValidationForTaxReturn();
    }
    this.checkFormisValid(this.applicationStep, false);
  };

  @action
  checkValidationForTaxReturn = () => {
    const { fields } = this.BUSINESS_DOC_FRM;
    if (fields.personalTaxReturn.value.length && fields.businessTaxReturn.value.length) {
      fields.personalTaxReturn.rule = 'required';
      fields.businessTaxReturn.rule = 'required';
    } else if (fields.personalTaxReturn.value.length) {
      fields.businessTaxReturn.rule = '';
      fields.businessTaxReturn.error = undefined;
    } else if (fields.businessTaxReturn.value.length) {
      fields.personalTaxReturn.rule = '';
      fields.personalTaxReturn.error = undefined;
    } else {
      fields.personalTaxReturn.rule = 'required';
      fields.businessTaxReturn.rule = 'required';
    }
  }

  @action
  businessAppUploadFiles = (files, fieldName, formName, index = null) => {
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getFileUploadEnum(fieldName, index);
        this.setFieldvalue('isFileUploading', true);
        this.setFormFileArray(formName, fieldName, 'showLoader', true, index);
        fileUpload.setFileUploadData(this.currentApplicationId, fileData, stepName, 'ISSUER').then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(formName, fieldName, 'fileData', file, index);
            this.setFormFileArray(formName, fieldName, 'preSignedUrl', preSignedUrl, index);
            this.setFormFileArray(formName, fieldName, 'fileId', fileId, index);
            this.setFormFileArray(formName, fieldName, 'value', fileData.fileName, index);
            this.setFormFileArray(formName, fieldName, 'error', undefined, index);
            if (this.currentApplicationType === 'business' && (fieldName === 'personalTaxReturn' || fieldName === 'businessTaxReturn')) {
              this.checkValidationForTaxReturn();
            }
            this.checkFormisValid(this.applicationStep, false);
          }).catch((error) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
          }).finally(() => {
            this.setFormFileArray(formName, fieldName, 'showLoader', false, index);
            this.setFieldvalue('isFileUploading', false);
          });
        }).catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          this.setFormFileArray(formName, fieldName, 'showLoader', false, index);
          this.setFieldvalue('isFileUploading', false);
        });
      });
    }
  }

  @action
  businessAppRemoveUploadedFiles = () => {
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
  getFileUploadEnum = (fieldName, index) => {
    let step = '';
    if (fieldName === 'resume') {
      step = BUSINESS_APP_FILE_UPLOAD_ENUMS[`${fieldName}${index + 1}`];
    } else {
      step = BUSINESS_APP_FILE_UPLOAD_ENUMS[fieldName];
    }
    return step;
  }

  @action
  setFormFileArray = (formName, field, getField, value, index) => {
    if (field === 'resume') {
      this[formName].fields.owners[index][field][getField] = value;
    } else if (getField === 'showLoader' || getField === 'error') {
      this[formName].fields[field][getField] = value;
    } else {
      this[formName].fields[field][getField] =
      [...this[formName].fields[field][getField],
        value];
    }
  }

  @action
  removeForm = (e, formName, index) => {
    e.preventDefault();
    this.BUSINESS_DETAILS_FRM.fields[formName].splice(index, 1);
  }

  @action
  addMoreForms = (e = null, formName) => {
    if (e) {
      e.preventDefault();
    }
    this.BUSINESS_DETAILS_FRM = {
      ...this.BUSINESS_DETAILS_FRM,
      fields: {
        ...this.BUSINESS_DETAILS_FRM.fields,
        [formName]: [
          ...this.BUSINESS_DETAILS_FRM.fields[formName],
          BUSINESS_DETAILS[formName][0],
        ],
      },
      meta: {
        ...this.BUSINESS_DETAILS_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  formReset = (applicationType = null) => {
    const applicationTypeCheck = applicationType || this.currentApplicationType;
    this.BUSINESS_APP_FRM = Validator.prepareFormObject(applicationTypeCheck === 'business' ? BUSINESS_PRE_QUALIFICATION : BUSINESS_PRE_QUALIFICATION_REAL_ESTATE);
    this.BUSINESS_PERF_FRM = Validator.prepareFormObject(applicationTypeCheck === 'business' ? BUSINESS_PERF : BUSINESS_PERF_COMMON);
    this.BUSINESS_DOC_FRM = Validator.prepareFormObject(applicationTypeCheck === 'business' ? BUSINESS_DOC : BUSINESS_DOC_REAL_ESTATE);
    this.BUSINESS_DETAILS_FRM.fields.businessPlan.label = applicationTypeCheck === 'business' ? 'Upload your business plan' : 'Upload your Investment Summary or Business Plan';
    this.BUSINESS_PERF_FRM.fields.fiveYearProjection.label = applicationTypeCheck === 'business' ? '5 Year Projections' : '5-10 Year Projections';
    this.BUSINESS_APP_FRM_BASIC = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION_BASIC);
    this.BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
    this.preQualFormDisabled = false;
    this.appStepsStatus = [{ path: 'pre-qualification', status: 'IN_PROGRESS' }, { path: 'business-details', status: null }, { path: 'performance', status: null }, { path: 'documentation', status: null }];
    this.formReadOnlyMode = false;
    this.isPrequalQulify = false;
  }

  @action
  needHelpFormReset = () => {
    this.NEED_HELP_FRM = Validator.prepareFormObject(NEED_HELP);
  }

  @action
  performanceReset = (field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(this.BUSINESS_PERF_FRM, { name: field, value: '' });
  };

  @computed get notificationCard() {
    return find(BUSINESS_APPLICATION_NOTIFICATION_CARD.applicationStatus, e =>
      find(this.fetchBusinessApplication, a => a.applicationStatus === e.applicationStatus)) ||
      find(BUSINESS_APPLICATION_NOTIFICATION_CARD.offeringStage, e =>
        find(offeringsStore.data.data.getOfferings, a => e.offeringStage.includes(a.stage)));
  }
}

export default new BusinessAppStore();
