import { observable, action, computed, toJS } from 'mobx';
import { forEach, includes } from 'lodash';
import graphql from 'mobx-apollo';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import {
  BUSINESS_PRE_QUALIFICATION,
  BUSINESS_SIGNUP,
  BUSINESS_DETAILS,
  BUSINESS_PERF,
  BUSINESS_DOC,
  LENDIO_PRE_QUAL,
  BUSINESS_APPLICATION_STATUS,
  BUSINESS_GOAL,
} from '../../../constants/newBusiness';
// import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import Helper from '../../../../helper/utility';
import {
  getBusinessApplicationsById,
  getBusinessApplications,
  createBusinessApplicationPrequalificaiton,
  upsertBusinessApplicationInformationPerformance,
  upsertBusinessApplicationInformationBusinessDetails,
  upsertBusinessApplicationInformationDocumentation,
} from '../../queries/businessApplication';
import { uiStore } from '../../index';
import { fileUpload } from '../../../actions';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
  @observable BUSINESS_ACCOUNT =Validator.prepareFormObject(BUSINESS_SIGNUP);
  @observable BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
  @observable BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
  @observable BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
  @observable LENDIO_QUAL_FRM = Validator.prepareFormObject(LENDIO_PRE_QUAL);
  @observable BUSINESS_APP_STATUS = '';
  @observable preQualFormDisabled = false;
  @observable BUSINESS_APP_STEP_URL = 'pre-qualification';
  @observable BUSINESS_APPLICATION_DATA = null;
  @observable isPartialData = null;
  @observable applicationId = null;
  @observable applicationStep = null;
  @observable showConfirmModal = false;
  @observable businessApplicationsList = null;
  @observable currentApplicationId = null;
  @observable businessApplicationsDataById = null;
  @observable isFetchedData = null;

  @action
  businessAccEleChange = (e, result) => {
    this.LOGIN_FRM = Validator.onChange(this.LOGIN_FRM, Validator.pullValues(e, result));
  };

  @action
  setFetchedData = (val) => {
    this.isFetchedData = val;
  };

  @action
  setApplicationStep = (step) => {
    this.applicationStep = step;
  }

  @action
  setCurrentApplicationId = (id) => {
    this.currentApplicationId = id;
  }

  @action
  businessDocChange = (e, res) => {
    this.BUSINESS_DOC_FRM = Validator.onChange(this.BUSINESS_DOC_FRM, Validator.pullValues(e, res));
  };

  @computed get getGuaranteeCondtion() {
    return this.BUSINESS_DOC_FRM.fields.personalGuarantee.value;
  }

  @action
  setBusinessAppStepUrl = (url) => {
    this.BUSINESS_APP_STEP_URL = url;
  }
  @action
  setBusinessAppStatus = (status) => {
    this.BUSINESS_APP_STATUS = status;
  }

  @computed get getBusinessAppStepUrl() {
    return this.BUSINESS_APP_STEP_URL;
  }

  @action
  businessPerfMaskingChange = (values, field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(
      this.BUSINESS_PERF_FRM,
      { name: field, value: values.floatValue },
    );
  };

  @action
  fetchApplicationDataById = (applicationId) => {
    this.businessApplicationsDataById = graphql({
      client,
      query: getBusinessApplicationsById,
      variables: {
        id: applicationId,
      },
      fetchPolicy: 'network-only',
    });
    setTimeout(() => {
      this.setBusinessApplicationData();
    }, 500);
  }

  @action
  getBusinessApplications = () => {
    // applicationList
    this.businessApplicationsList = graphql({
      client,
      query: getBusinessApplications,
    });
    console.log(this.businessApplicationsList);
  }

  @computed get calculateStepToRender() {
    const data = this.fetchBusinessApplicationsDataById;
    let url = 'business-details';
    if (data && data.businessApplication) {
      if (data.businessApplication.businessDetails && data.businessApplication.businessDetails.stepStatus === 'IN_PROGRESS') {
        url = 'business-details';
      } else if (data.businessApplication.businessPerformance && data.businessApplication.businessDetails.stepStatus === 'IN_PROGRESS') {
        url = 'performance';
      } else if (data.businessApplication.businessDocumentation && data.businessApplication.businessDetails.stepStatus === 'IN_PROGRESS') {
        url = 'documentation';
      }
    }
    return url;
  }

  @action
  setBusinessApplicationData = () => {
    const data = this.fetchBusinessApplicationsDataById;
    console.log(this.businessApplicationsDataById);
    console.log(this.fetchBusinessApplicationsDataById);
    this.setPrequalDetails(data.prequalDetails);
    this.setbusinessDetails(data.businessDetails);
  };

  @action
  setPrequalDetails = (data) => {
    if (data) {
      ['street', 'city', 'state', 'zipCode'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessGeneralInfo.address[ele];
      });
      ['website', 'businessName'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessGeneralInfo[ele];
      });
      ['businessModel', 'businessGoal', 'businessEntityStructure', 'franchiseHolder'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data[ele];
      });
      ['amountNeeded', 'estimatedCreditScore', 'industryExperience', 'totalProjectCost'].forEach((ele) => {
        this.BUSINESS_APP_FRM.fields[ele].value = data.businessExperience[ele];
      });
      ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
        const field = ['nextYearCogSold', 'nextYearGrossSales', 'nextYearNetIncome', 'nextYearOperatingExpenses'];
        this.BUSINESS_APP_FRM.fields[field[key]].value =
          data.performanceSnapshot.nextYearSnapshot[ele];
      });
      ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
        const field = ['previousYearCogSold', 'previousYearGrossSales', 'previousYearNetIncome', 'previousYearOperatingExpenses'];
        this.BUSINESS_APP_FRM.fields[field[key]].value =
          data.performanceSnapshot.pastYearSnapshot[ele];
      });
      data.fundUsage.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.fundUsage.value = ele;
      });
      data.industryTypes.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.industryTypes.value = ele;
      });
      data.legalConfirmations.forEach((ele) => {
        this.BUSINESS_APP_FRM.fields.legalConfirmation.value.push(ele.value && ele.label);
      });
      this.BUSINESS_APP_FRM.fields.phoneNumber.value =
        data.businessGeneralInfo.contactDetails.phone.number;
      this.BUSINESS_APP_FRM.meta.isValid = false;
      this.preQualFormDisabled = true;
    }
  }

  @action
  setbusinessDetails = (data) => {
    if (data) {
      this.BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
      data.debts.forEach((ele, key) => {
        ['amount', 'interestExpenses', 'remainingPrincipal', 'term'].forEach((field) => {
          this.BUSINESS_DETAILS_FRM.fields.debts[key][field].value = ele[field];
        });
        if (key < data.debts.length - 1) {
          this.addMoreForms(null, 'debts');
        }
      });
      data.owners.forEach((ele, key) => {
        ['companyOwnerShip', 'fullLegalName', 'linkedInUrl', 'ssn', 'yearsOfExp', 'title'].forEach((field) => {
          this.BUSINESS_DETAILS_FRM.fields.owners[key][field].value = ele[field];
        });
        if (key < data.owners.length - 1) {
          this.addMoreForms(null, 'owners');
        }
      });
      if (data.planDocs && data.planDocs.length) {
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.value = [];
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.fileId = [];
      }
      data.planDocs.forEach((ele) => {
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.value.push(ele.fileName);
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.fileId.push(ele.fileId);
      });
    }
  }

  @computed get fetchBusinessApplicationsDataById() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.businessApplication
      && toJS(this.businessApplicationsDataById.data.businessApplication)
    ) || [];
  }

  @computed get fetchBusinessApplication() {
    return (this.businessApplicationsList && this.businessApplicationsList.data
      && this.businessApplicationsList.data.businessApplications
      && toJS(this.businessApplicationsList.data.businessApplications)
    ) || [];
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
  businessAppEleChange = (e, res) => {
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, Validator.pullValues(e, res));
  };

  @action
  businessAppEleMaskChange = (values, field) => {
    this.BUSINESS_APP_FRM = Validator.onChange(
      this.BUSINESS_APP_FRM,
      { name: field, value: values.floatValue },
    );
  };

  @action
  lendioEleChange = (e, res) => {
    this.LENDIO_QUAL_FRM = Validator.onChange(this.LENDIO_QUAL_FRM, Validator.pullValues(e, res));
  };

  @computed get getBusinessTypeCondtion() {
    return (this.BUSINESS_APP_FRM.fields.businessGoal.value &&
      this.BUSINESS_APP_FRM.fields.businessGoal.value !== BUSINESS_GOAL.FRANCHISE
      && this.BUSINESS_APP_FRM.fields.businessGoal.value !== BUSINESS_GOAL.BRAND_NEW);
  }

  @computed get getFranchiseCondition() {
    return (this.BUSINESS_APP_FRM.fields.businessGoal.value &&
      this.BUSINESS_APP_FRM.fields.businessGoal.value === BUSINESS_GOAL.FRANCHISE);
  }

  @computed get canSubmitApp() {
    const notOkForms = ['BUSINESS_APP_FRM', 'BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    return notOkForms.length === 0;
  }

  @action
  businessLendioPreQual = () => {
    const data = Validator.ExtractValues(this.LENDIO_QUAL_FRM.fields);
    console.log(data);
  }

  @action
  getFilesArray = (data, form) => {
    const arr = data.map((item, key) => (
      { fileId: form.fileId[key] ? form.fileId[key] : '123', fileName: item }
    ));
    return arr;
  }

  @action
  getValidDataForString = (data) => {
    let val = '';
    if (data && data.value !== '' && data.value !== null && data.error === undefined) {
      val = data.value;
    }
    return val;
  }

  @computed get getFormatedBusinessDetailsData() {
    const data = toJS(this.BUSINESS_DETAILS_FRM.fields);
    console.log(this.BUSINESS_DETAILS_FRM.fields);
    return {
      planDocs: this.getFilesArray(data.businessPlan.value, data.businessPlan),
      debts: data.debts.map(item => ({
        amount: item.amount.value !== '' ? parseInt(item.amount.value, 10) : 0,
        interestExpenses: item.interestExpenses.value !== '' ? parseInt(item.interestExpenses.value, 10) : 0,
        remainingPrincipal: item.remainingPrincipal.value !== '' ? parseInt(item.remainingPrincipal.value, 10) : 0,
        term: item.term.value !== '' ? parseInt(item.term.value, 10) : 0,
      })),
      owners: data.owners.map(item => ({
        fullLegalName: this.getValidDataForString(item.fullLegalName),
        yearsOfExp: item.yearsOfExp.value !== '' ? parseInt(item.yearsOfExp.value, 10) : 0,
        ssn: this.getValidDataForString(item.ssn),
        companyOwnerShip: item.companyOwnerShip.value !== '' ? parseFloat(item.companyOwnerShip.value, 2) : 0.00,
        linkedInUrl: this.getValidDataForString(item.linkedInUrl.value),
        title: this.getValidDataForString(item.title.value),
        resume: [
          {
            fileId: this.getValidDataForString(item.resume.fileId),
            fileName: this.getValidDataForString(item.resume.value),
          },
        ],
      })),
    };
  }

  @computed get getFormatedPerformanceData() {
    const data = Validator.ExtractValues(toJS(this.BUSINESS_PERF_FRM.fields));
    return {
      financialStatements: {
        priorToThreeYear: this.getFilesArray(
          data.priorToThreeYear,
          this.BUSINESS_PERF_FRM.fields.priorToThreeYear,
        ),
        ytd: this.getFilesArray(data.ytd, this.BUSINESS_PERF_FRM.fields.ytd),
        fiveYearProjection: this.getFilesArray(
          data.fiveYearProjection,
          this.BUSINESS_PERF_FRM.fields.fiveYearProjection,
        ),
      },
      performance: {
        nextYearSnapshot: {
          grossSales: data.nyGrossSales !== '' ? data.nyGrossSales : 0,
          cogSold: data.nyCogs !== '' ? data.nyCogs : 0,
          operatingExpenses: data.nyOperatingExpenses !== '' ? data.nyOperatingExpenses : 0,
          netIncome: data.nyNetIncome !== '' ? data.nyNetIncome : 0,
        },
        pastYearSnapshot: {
          grossSales: data.pyGrossSales !== '' ? data.pyGrossSales : 0,
          cogSold: data.pyCogs !== '' ? data.pyCogs : 0,
          operatingExpenses: data.pyOperatingExpenses !== '' ? data.pyOperatingExpenses : 0,
          netIncome: data.pyNetIncome !== '' ? data.pyNetIncome : 0,
        },
      },
    };
  }

  @computed get getFormatedDocumentationData() {
    const data = Validator.ExtractValues(toJS(this.BUSINESS_DOC_FRM.fields));
    return {
      bankStatements: this.getFilesArray(
        data.bankStatements,
        this.BUSINESS_DOC_FRM.fields.bankStatements,
      ),
      leaseAgreementsOrLOIs: this.getFilesArray(
        data.leaseAgreementsOrLOIs,
        this.BUSINESS_DOC_FRM.fields.leaseAgreementsOrLOIs,
      ),
      personalTaxReturns: this.getFilesArray(
        data.personalTaxReturn,
        this.BUSINESS_DOC_FRM.fields.personalTaxReturn,
      ),
      businessTaxReturns: this.getFilesArray(
        data.businessTaxReturn,
        this.BUSINESS_DOC_FRM.fields.businessTaxReturn,
      ),
      personalGuarantee: this.getFilesArray(
        data.personalGuaranteeForm,
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm,
      ),
      blanketLien: this.BUSINESS_DOC_FRM.fields.blanketLien.value !== '' ? this.BUSINESS_DOC_FRM.fields.blanketLien.value : false,
      providePersonalGurantee: this.BUSINESS_DOC_FRM.fields.personalGuarantee.value !== '' ? this.BUSINESS_DOC_FRM.fields.personalGuarantee.value : false,
    };
  }

  @computed get getFormatedPreQualificationData() {
    const data = Validator.ExtractValues(toJS(this.BUSINESS_APP_FRM.fields));
    const preQualData = {
      businessModel: data.businessModel,
      businessGeneralInfo: {
        businessName: data.businessName,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        website: data.website,
        contactDetails: {
          phone: {
            number: data.phoneNumber,
            countryCode: '1',
          },
        },
      },
      industryTypes: data.industryTypes,
      businessGoal: data.businessGoal,
      existingBusinessInfo: {
        ageYears: data.businessAgeYears !== '' ? data.businessAgeYears : 0,
        ageMonths: data.businessAgeMonths !== '' ? data.businessAgeMonths : 0,
      },
      businessExperience: {
        industryExperience: data.industryExperience,
        estimatedCreditScore: data.estimatedCreditScore,
        totalProjectCost: data.totalProjectCost,
        amountNeeded: data.amountNeeded,
      },
      fundUsage: data.fundUsage,
      performanceSnapshot: {
        pastYearSnapshot: {
          grossSales: data.previousYearGrossSales !== '' ? data.previousYearGrossSales : 0,
          cogSold: data.previousYearCogSold !== '' ? data.previousYearCogSold : 0,
          operatingExpenses: data.previousYearOperatingExpenses !== '' ? data.previousYearOperatingExpenses : 0,
          netIncome: data.previousYearNetIncome !== '' ? data.previousYearNetIncome : 0,
        },
        nextYearSnapshot: {
          grossSales: data.nextYearGrossSales,
          cogSold: data.nextYearCogSold,
          operatingExpenses: data.nextYearOperatingExpenses,
          netIncome: data.nextYearNetIncome,
        },
      },
      businessEntityStructure: data.businessEntityStructure,
      // legalConfirmations: data.legalConfirmation,
      legalConfirmations: [{
        label: 'HAS_NOT_RAISED_SECURITIES',
        value: includes(data.legalConfirmation, 'HAS_NOT_RAISED_SECURITIES'),
      },
      {
        label: 'IS_NOT_CONDUCTING_OFFERING',
        value: includes(data.legalConfirmation, 'IS_NOT_CONDUCTING_OFFERING'),
      },
      {
        label: 'IS_ORGANIZED_IN_USA',
        value: includes(data.legalConfirmation, 'IS_ORGANIZED_IN_USA'),
      },
      {
        label: 'HAS_NOT_SOLD_SECURITIES',
        value: includes(data.legalConfirmation, 'HAS_NOT_SOLD_SECURITIES'),
      },
      {
        label: 'HAS_NEVER_FILED_BANKRUPTCY',
        value: includes(data.legalConfirmation, 'HAS_NEVER_FILED_BANKRUPTCY'),
      },
      {
        label: 'HAS_NEVER_BEEN_CONVICTED_OF_FRAUD',
        value: includes(data.legalConfirmation, 'HAS_NEVER_BEEN_CONVICTED_OF_FRAUD'),
      },
      {
        label: 'HAS_NEVER_BEEN_CONVICTED_OF_CRIMINAL_OFFENCE',
        value: includes(data.legalConfirmation, 'HAS_NEVER_BEEN_CONVICTED_OF_CRIMINAL_OFFENCE'),
      },
      {
        label: 'IS_NOT_BROKER_DEALER',
        value: includes(data.legalConfirmation, 'IS_NOT_BROKER_DEALER'),
      },
      {
        label: 'IS_NOT_INVESTMENT_COMPANY',
        value: includes(data.legalConfirmation, 'IS_NOT_INVESTMENT_COMPANY'),
      }],
    };

    return this.getFranchiseCondition ?
      { ...preQualData, franchiseHolder: data.franchiseHolder } : preQualData;
  }

  @action
  businessPreQualificationFormSumbit = () => {
    const data = this.getFormatedPreQualificationData;
    console.log(data);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createBusinessApplicationPrequalificaiton,
          variables: {
            preQualificationData: data,
          },
        })
        .then((result) => {
          console.log(result);
          this.setBusinessAppStatus(result.data.createBusinessApplicationPrequalification.status);
          const applicationId = result.data.createBusinessApplicationPrequalification.id;
          this.setFetchedData(null);
          if (this.BUSINESS_APP_STATUS ===
              BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED) {
            console.log('Success');
            this.setBusinessAppStepUrl(`${applicationId}/success`);
          } else if (this.BUSINESS_APP_STATUS ===
              BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
            this.setBusinessAppStepUrl(`${applicationId}/failed`);
            console.log('Failer');
          } else {
            this.setBusinessAppStepUrl(`${applicationId}/failed`);
          }
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  businessAppParitalSubmit = (step) => {
    console.log(step);
    console.log(this.applicationStep);
    let data = this.getFormatedBusinessDetailsData;
    let stepName = 'BUSINESS_DETAILS';
    if (step === 'business-details') {
      stepName = 'BUSINESS_DETAILS';
    } else if (step === 'performance') {
      stepName = 'PERFORMANCE';
    } else if (step === 'documentation') {
      stepName = 'DOCUMENTATION';
    }
    let mutationQuery = upsertBusinessApplicationInformationBusinessDetails;
    let variableData = {
      applicationId: this.currentApplicationId,
      isPartialData: true,
      businessGoal: this.BUSINESS_APP_FRM.fields.businessGoal.value,
    };
    if (stepName === 'BUSINESS_DETAILS') {
      variableData = {
        ...variableData,
        businessDetails: data,
        applicationStep: stepName,
      };
    } else if (stepName === 'PERFORMANCE') {
      data = this.getFormatedPerformanceData;
      variableData = {
        ...variableData,
        businessPerformance: data,
        applicationStep: stepName,
      };
      mutationQuery = upsertBusinessApplicationInformationPerformance;
    } else if (stepName === 'DOCUMENTATION') {
      data = this.getFormatedDocumentationData;
      variableData = {
        ...variableData,
        businessDocumentation: data,
        applicationStep: stepName,
      };
      mutationQuery = upsertBusinessApplicationInformationDocumentation;
    }
    console.log(variableData);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutationQuery,
          variables: variableData,
        })
        .then((result) => {
          console.log(result);
          // this.setBusinessAppStatus
          // (result.data.createBusinessApplicationPrequalification.status);
          // const applicationId = result.data.createBusinessApplicationPrequalification.id;
          // if (this.BUSINESS_APP_STATUS ===
          //     BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED) {
          //   console.log('Success');
          //   this.setBusinessAppStepUrl(`${applicationId}/success`);
          // } else if (this.BUSINESS_APP_STATUS ===
          //     BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
          //   this.setBusinessAppStepUrl(`${applicationId}/failed`);
          //   console.log('Failer');
          // } else {
          //   this.setBusinessAppStepUrl(`${applicationId}/failed`);
          // }
          resolve();
        })
        .catch((error) => {
          console.log(error);
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
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'street', value: data.residentalStreet });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'city', value: data.city });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'state', value: data.state });
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, { name: 'zipCode', value: data.zipCode });
  };

  @action
  businessAppRemoveFiles = (e, fieldName, formName, index) => {
    if (fieldName === 'resume') {
      this[formName].fields.owners[index][fieldName].value = '';
    } else {
      this[formName].fields[fieldName].value.splice(index, 1);
    }
  };

  @action
  businessAppUploadFiles = (files, fieldName, formName, index = null) => {
    console.log(fieldName);
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        this.setFormFileArray(formName, fieldName, 'fileData', file, index);
        const fileData = Helper.getFormattedFileData(file);
        const stepName = 'BUSINESS_PLAN';
        // applicationId, fileData, stepName, userRole
        fileUpload.setFileUploadData(this.currentApplicationId, fileData, stepName, 'ISSUER').then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          this.setFormFileArray(formName, fieldName, 'preSignedUrl', preSignedUrl, index);
          this.setFormFileArray(formName, fieldName, 'fileId', fileId, index);
          // Helper.putUploadedFile1(this.BUSINESS_DETAILS_FRM.fields.businessPlan);
          console.log(result);
        }).catch((error) => {
          console.log(error);
        });
        this.setFormFileArray(formName, fieldName, 'value', fileData.fileName, index);
      });
    }
  }

  @action
  setFormFileArray = (formName, field, getField, value, index) => {
    if (field === 'resume') {
      this[formName].fields.owners[index][field][getField] = value;
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
  formReset = () => {
    this.BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
  }

  @action
  performanceReset = (field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(this.BUSINESS_PERF_FRM, { name: field, value: '' });
  };
}

export default new NewBusinessStore();
