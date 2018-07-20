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
  BUSINESS_APP_FILE_UPLOAD_ENUMS,
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
  submitApplication,
} from '../../queries/businessApplication';
import { uiStore, navStore } from '../../index';
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
  @observable BUSINESS_APP_STEP_URL = 'new/pre-qualification';
  @observable BUSINESS_APPLICATION_DATA = null;
  @observable isPartialData = null;
  @observable applicationId = null;
  @observable applicationStep = null;
  @observable showConfirmModal = false;
  @observable businessApplicationsList = null;
  @observable currentApplicationId = null;
  @observable businessApplicationsDataById = null;
  @observable isFetchedData = null;
  @observable appStepsStatus = ['IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS'];

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

  @action
  checkFormisValid = (step) => {
    let status = false;
    if (step === 'business-details') {
      status = this.BUSINESS_DETAILS_FRM.meta.isValid;
    } else if (step === 'performance') {
      status = this.BUSINESS_PERF_FRM.meta.isValid;
    } else if (step === 'documentation') {
      status = this.BUSINESS_DOC_FRM.meta.isValid;
    }
    return status;
  }

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
      onFetch: () => {
        this.setBusinessApplicationData();
      },
    });
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

  @computed get getBusinessAppStepStatus() {
    let stepStatus = [];
    const data = this.fetchBusinessApplicationsDataById;
    if (data && data.businessApplication) {
      if (data.businessApplication.businessDetails) {
        stepStatus = [
          ...stepStatus,
          { businessDetails: data.businessApplication.businessDetails.stepStatus },
        ];
      } else if (data.businessApplication.businessPerformance) {
        stepStatus = [
          ...stepStatus,
          { performance: data.businessApplication.businessPerformance.stepStatus },
        ];
      } else if (data.businessApplication.businessDocumentation) {
        stepStatus = [
          ...stepStatus,
          { documentation: data.businessApplication.businessDocumentation.stepStatus },
        ];
      }
    }
    return stepStatus;
  }

  @computed get calculateStepToRender() {
    const data = this.fetchBusinessApplicationsDataById;
    let url = 'business-details';
    if (data && data.businessApplication) {
      if (data.businessApplication.businessDetails && data.businessApplication.businessDetails.stepStatus === 'IN_PROGRESS') {
        url = 'business-details';
      } else if (data.businessApplication.businessPerformance && data.businessApplication.businessPerformance.stepStatus === 'IN_PROGRESS') {
        url = 'performance';
      } else if (data.businessApplication.businessDocumentation && data.businessApplication.businessDocumentation.stepStatus === 'IN_PROGRESS') {
        url = 'documentation';
      }
    }
    return url;
  }

  @action
  setBusinessApplicationData = () => {
    this.formReset();
    const data = this.fetchBusinessApplicationsDataById;
    this.setPrequalDetails(data.prequalDetails);
    this.setbusinessDetails(data.businessDetails);
    this.setperformanceDetails(data.businessPerformance, data.prequalDetails);
    this.setDocumentationDetails(data.businessDocumentation);
    console.log(data);
    console.log(this.calculateStepToRender);
    navStore.setAccessParams('appStatus', this.fetchBusinessApplicationsStatusById);
  };

  @action
  setPrequalDetails = (data) => {
    if (data) {
      this.appStepsStatus[0] = 'COMPLETE';
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
      this.appStepsStatus[1] = data.stepStatus;
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
        ['companyOwnerShip', 'fullLegalName', 'linkedInUrl', 'ssn', 'yearsOfExp', 'title', 'resume'].forEach((field) => {
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
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.value = [];
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.fileId = [];
      }
      data.planDocs.forEach((ele) => {
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.value.push(ele.fileName);
        this.BUSINESS_DETAILS_FRM.fields.businessPlan.fileId.push(ele.fileId);
      });
    }
    Validator.validateForm(this.BUSINESS_DETAILS_FRM, true);
  }

  @action
  setperformanceDetails = (data, prequalData) => {
    console.log(data);
    if (data) {
      this.appStepsStatus[2] = data.stepStatus;
      this.BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
      ['cogSold', 'grossSales', 'netIncome', 'operatingExpenses'].forEach((ele, key) => {
        const field = ['nyCogs', 'nyGrossSales', 'nyNetIncome', 'nyOperatingExpenses'];
        this.BUSINESS_PERF_FRM.fields[field[key]].value =
          data.performance.nextYearSnapshot[ele];
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

      if (data.financialStatements.fiveYearProjection &&
        data.financialStatements.fiveYearProjection.length) {
        this.BUSINESS_PERF_FRM.fields.fiveYearProjection.value = [];
        this.BUSINESS_PERF_FRM.fields.fiveYearProjection.fileId = [];
      }
      data.financialStatements.fiveYearProjection.forEach((ele) => {
        this.BUSINESS_PERF_FRM.fields.fiveYearProjection.value.push(ele.fileName);
        this.BUSINESS_PERF_FRM.fields.fiveYearProjection.fileId.push(ele.fileId);
      });
      if (this.getBusinessTypeCondtion) {
        ['priorToThreeYear', 'ytd'].forEach((field) => {
          if (data.financialStatements[field] && data.financialStatements[field].length) {
            this.BUSINESS_PERF_FRM.fields[field].value = [];
            this.BUSINESS_PERF_FRM.fields[field].fileId = [];
            this.BUSINESS_PERF_FRM.fields[field].rule = 'required';
          }
          data.financialStatements[field].forEach((ele) => {
            this.BUSINESS_PERF_FRM.fields[field].value.push(ele.fileName);
            this.BUSINESS_PERF_FRM.fields[field].fileId.push(ele.fileId);
          });
        });
      } else {
        ['priorToThreeYear', 'ytd'].forEach((ele) => {
          this.BUSINESS_PERF_FRM.fields[ele].rule = '';
        });
      }
    } else {
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
      }
    }
    Validator.validateForm(this.BUSINESS_PERF_FRM);
  }

  @action
  setDocumentationDetails = (data) => {
    if (data) {
      this.appStepsStatus[3] = data.stepStatus;
      this.BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
      this.BUSINESS_DOC_FRM.fields.blanketLien.value = data.blanketLien !== '' ? data.blanketLien : '';
      this.BUSINESS_DOC_FRM.fields.personalGuarantee.value = data.providePersonalGurantee !== '' ? data.providePersonalGurantee : '';
      if (!data.providePersonalGurantee) {
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.rule = '';
      }
      if (data.personalGuarantee &&
        data.personalGuarantee.length) {
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.value = [];
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.fileId = [];
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.rule = 'required';
      }
      data.personalGuarantee.forEach((ele) => {
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.value.push(ele.fileName);
        this.BUSINESS_DOC_FRM.fields.personalGuaranteeForm.fileId.push(ele.fileId);
      });

      ['bankStatements', 'businessTaxReturns', 'leaseAgreementsOrLOIs', 'personalTaxReturns'].forEach((field, key) => {
        const formField = ['bankStatements', 'businessTaxReturn', 'leaseAgreementsOrLOIs', 'personalTaxReturn'];
        if (this.getBusinessTypeCondtion) {
          if (data[field] && data[field].length) {
            this.BUSINESS_DOC_FRM.fields[formField[key]].value = [];
            this.BUSINESS_DOC_FRM.fields[formField[key]].fileId = [];
          }
          data[field].forEach((ele) => {
            this.BUSINESS_DOC_FRM.fields[formField[key]].value.push(ele.fileName);
            this.BUSINESS_DOC_FRM.fields[formField[key]].fileId.push(ele.fileId);
          });
        } else if (field === 'leaseAgreementsOrLOIs' || field === 'personalTaxReturns') {
          if (data[field] && data[field].length) {
            this.BUSINESS_DOC_FRM.fields[formField[key]].value = [];
            this.BUSINESS_DOC_FRM.fields[formField[key]].fileId = [];
          }
          data[field].forEach((ele) => {
            this.BUSINESS_DOC_FRM.fields[formField[key]].value.push(ele.fileName);
            this.BUSINESS_DOC_FRM.fields[formField[key]].fileId.push(ele.fileId);
          });
        } else {
          this.BUSINESS_DOC_FRM.fields[formField[key]].rule = '';
        }
      });
    }
    Validator.validateForm(this.BUSINESS_DOC_FRM);
  }

  @computed get fetchBusinessApplicationsDataById() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.businessApplication
      && toJS(this.businessApplicationsDataById.data.businessApplication)
    ) || [];
  }

  @computed get fetchBusinessApplicationsStatusById() {
    return (this.businessApplicationsDataById && this.businessApplicationsDataById.data
      && this.businessApplicationsDataById.data.businessApplication
      && toJS(this.businessApplicationsDataById.data.businessApplication.applicationStatus)
    ) || null;
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
    const notOkForms = ['BUSINESS_DETAILS_FRM', 'BUSINESS_PERF_FRM', 'BUSINESS_DOC_FRM']
      .filter(form => !this[form].meta.isValid);
    const isPartial = this.appStepsStatus.filter(step => step === 'IN_PROGRESS');

    return notOkForms.length === 0 && isPartial.length === 0;
  }

  @action
  businessLendioPreQual = () => {
    const data = Validator.ExtractValues(this.LENDIO_QUAL_FRM.fields);
    console.log(data);
  }

  @action
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
    console.log(this.BUSINESS_DETAILS_FRM.fields);
    return {
      planDocs: this.getFilesArray(data.businessPlan.value, data.businessPlan),
      debts: data.debts.map(item => ({
        amount: this.getValidDataForInt(item.amount),
        interestExpenses: item.interestExpenses.value !== '' ? parseInt(item.interestExpenses.value, 10) : 0,
        remainingPrincipal: item.remainingPrincipal.value !== '' ? parseInt(item.remainingPrincipal.value, 10) : 0,
        term: this.getValidDataForInt(item.term),
      })),
      owners: data.owners.map(item => ({
        fullLegalName: this.getValidDataForString(item.fullLegalName),
        yearsOfExp: this.getValidDataForInt(item.yearsOfExp),
        ssn: this.getValidDataForString(item.ssn),
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
    console.log(data);
    return {
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

  @computed get getFormatedDocumentationData() {
    const data = toJS(this.BUSINESS_DOC_FRM.fields);
    console.log(data);
    return {
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
      personalGuarantee: this.getFilesArray(
        data.personalGuaranteeForm.value,
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
          grossSales: data.nextYearGrossSales !== '' ? data.nextYearGrossSales : 0,
          cogSold: data.nextYearCogSold !== '' ? data.nextYearCogSold : 0,
          operatingExpenses: data.nextYearOperatingExpenses !== '' ? data.nextYearOperatingExpenses : 0,
          netIncome: data.nextYearNetIncome !== '' ? data.nextYearNetIncome : 0,
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
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createBusinessApplicationPrequalificaiton,
          variables: {
            preQualificationData: data,
          },
          refetchQueries: [{ query: getBusinessApplications }],
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
          console.log(result);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  businessAppParitalSubmit = (step) => {
    console.log(this.applicationStep, step);
    let data = this.getFormatedBusinessDetailsData;
    let stepName = 'BUSINESS_DETAILS';
    let isPartialDataFlag = true;
    if (this.applicationStep === 'business-details') {
      stepName = 'BUSINESS_DETAILS';
      Validator.validateForm(this.BUSINESS_DETAILS_FRM, true);
      isPartialDataFlag = !this.BUSINESS_DETAILS_FRM.meta.isValid;
    } else if (this.applicationStep === 'performance') {
      stepName = 'PERFORMANCE';
      Validator.validateForm(this.BUSINESS_PERF_FRM);
      isPartialDataFlag = !this.BUSINESS_PERF_FRM.meta.isValid;
    } else if (this.applicationStep === 'documentation') {
      stepName = 'DOCUMENTATION';
      Validator.validateForm(this.BUSINESS_DOC_FRM);
      isPartialDataFlag = !this.BUSINESS_DOC_FRM.meta.isValid;
    }
    let mutationQuery = upsertBusinessApplicationInformationBusinessDetails;
    let variableData = {
      applicationId: this.currentApplicationId,
      isPartialData: isPartialDataFlag,
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
          resolve();
        })
        .catch((error) => {
          console.log(error);
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
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        const stepName = this.getStepName(fieldName, index);
        fileUpload.setFileUploadData(this.currentApplicationId, fileData, stepName, 'ISSUER').then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          Helper.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(formName, fieldName, 'fileData', file, index);
            this.setFormFileArray(formName, fieldName, 'preSignedUrl', preSignedUrl, index);
            this.setFormFileArray(formName, fieldName, 'fileId', fileId, index);
            this.setFormFileArray(formName, fieldName, 'value', fileData.fileName, index);
          });
          console.log(result);
        }).catch((error) => {
          console.log(error);
        });
      });
    }
  }

  @action
  getStepName = (fieldName, index) => {
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
    this.BUSINESS_APP_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
    this.preQualFormDisabled = false;
    this.BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
    this.BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
    this.BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
    this.appStepsStatus = ['IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS'];
  }

  @action
  performanceReset = (field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(this.BUSINESS_PERF_FRM, { name: field, value: '' });
  };
}

export default new NewBusinessStore();
