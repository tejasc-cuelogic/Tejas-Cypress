import { observable, action, computed, toJS } from 'mobx';
import { forEach } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
// import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import {
  BUSINESS_PRE_QUALIFICATION,
  BUSINESS_SIGNUP,
  BUSINESS_DETAILS,
  BUSINESS_PERF,
  BUSINESS_DOC,
  LENDIO_PRE_QUAL,
  BUSINESS_APPLICATION_STATUS,
} from '../../../constants/newBusiness';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import Helper from '../../../../helper/utility';
import { createBusinessApplicationPrequalificaiton } from '../../queries/businessApplication';
import { uiStore } from '../../index';

export class NewBusinessStore {
  @observable BUSINESS_APP_FRM = Validator.prepareFormObject(BUSINESS_PRE_QUALIFICATION);
  @observable BUSINESS_ACCOUNT =Validator.prepareFormObject(BUSINESS_SIGNUP);
  @observable BUSINESS_DETAILS_FRM = Validator.prepareFormObject(BUSINESS_DETAILS);
  @observable BUSINESS_PERF_FRM = Validator.prepareFormObject(BUSINESS_PERF);
  @observable BUSINESS_DOC_FRM = Validator.prepareFormObject(BUSINESS_DOC);
  @observable LENDIO_QUAL_FRM = Validator.prepareFormObject(LENDIO_PRE_QUAL);
  @observable BUSINESS_APP_STATUS = '';
  @observable BUSINESS_APP_STEP_URL = 'pre-qualification';

  @action
  businessAccEleChange = (e, result) => {
    this.LOGIN_FRM = Validator.onChange(this.LOGIN_FRM, Validator.pullValues(e, result));
  };

  @action
  businessDocChange = (e, res) => {
    this.BUSINESS_ACCOUNT = Validator.onChange(this.BUSINESS_ACCOUNT, Validator.pullValues(e, res));
  };

  @action
  businessPerfChange = (e, res) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(
      this.BUSINESS_PERF_FRM,
      Validator.pullValues(e, res),
    );
  };

  @action
  businessDetailsChange = (e, res) => {
    this.BUSINESS_DETAILS_FRM = Validator.onChange(
      this.BUSINESS_DETAILS_FRM,
      Validator.pullValues(e, res),
    );
  };

  @action
  businessAppEleChange = (e, res) => {
    this.BUSINESS_APP_FRM = Validator.onChange(this.BUSINESS_APP_FRM, Validator.pullValues(e, res));
  };

  @action
  lendioEleChange = (e, res) => {
    this.LENDIO_QUAL_FRM = Validator.onChange(this.LENDIO_QUAL_FRM, Validator.pullValues(e, res));
  };

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

  @computed get getFormatedData() {
    const data = Validator.ExtractValues(toJS(this.BUSINESS_APP_FRM.fields));
    return {
      businessModel: data.businessModel,
      businessGeneralInfo: {
        businessName: data.businessName,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      },
      website: data.website,
      contactDetails: {
        phone: {
          number: data.phoneNumber,
          countryCode: '1',
        },
        email: data.email,
      },
      industryTypes: data.industryTypes,
      businessGoal: data.businessGoal,
      franchiseHolder: data.franchiseHolder,
      existingBusinessInfo: {
        ageYears: data.businessAgeYears,
        ageMonths: data.businessAgeMonths,
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
          grossSales: data.previousYearGrossSales,
          cogSold: data.previousYearCogSold,
          operatingExpenses: data.previousYearOperatingExpenses,
          netIncome: data.previousYearNetIncome,
        },
        nextYearSnapshot: {
          grossSales: data.nextYearGrossSales,
          cogSold: data.nextYearCogSold,
          operatingExpenses: data.nextYearOperatingExpenses,
          netIncome: data.nextYearNetIncome,
        },
      },
      businessEntityStructure: data.businessEntityStructure,
      legalConfirmations: data.legalConfirmations,
    };
  }

  @action
  businessPreQualificationFormSumbit = () => {
    const data = this.getFormatedData;
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
          this.BUSINESS_APP_STATUS = result.data.status;
          if (result.data.status === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED) {
            this.BUSINESS_APP_STEP_URL = 'business-details';
          } else if (result.data.status === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
            this.BUSINESS_APP_STEP_URL = 'failed';
          }
          resolve();
        })
        .catch(() => reject())
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
  businessDetailsFiles = (files, fieldName) => {
    console.log(createUploadEntry, removeUploadedFile);
    console.log(files);
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        // uiStore.setProgress();
        // return new Promise((resolve, reject) => {
        //   client
        //     .mutate({
        //       mutation: createUploadEntry,
        //       variables: {
        //         userId: userStore.currentUser.sub,
        //         stepName: 'BUSINESS_DETAILS',
        //         fileData,
        //       },
        //     })
        //     .then((result) => {
        //       console.log(result);
        //       this.BUSINESS_DETAILS_FRM.fields[fieldName].value =
        //       [...this.BUSINESS_DETAILS_FRM.fields[fieldName].value,
        //         fileData.fileName];
        //       // const { fileId, preSignedUrl } = result.data.createUploadEntry;
        //       // this.confirmIdentityDocuments.fields[field].fileId = fileId;
        //       // this.confirmIdentityDocuments.fields[field].preSignedUrl = preSignedUrl;
        //       resolve();
        //     })
        //     .catch((err) => {
        //       uiStore.setErrors(this.simpleErr(err));
        //       reject(err);
        //     })
        //     .finally(() => {
        //       uiStore.setProgress(false);
        //     });
        // });
        if (fieldName === 'resume') {
          this.BUSINESS_DETAILS_FRM.fields[fieldName].value =
          [...this.BUSINESS_DETAILS_FRM.fields[fieldName].value,
            fileData.fileName];
        } else {
          this.BUSINESS_DETAILS_FRM.fields[fieldName].value =
          [...this.BUSINESS_DETAILS_FRM.fields[fieldName].value,
            fileData.fileName];
        }
      });
    }
    console.log(this.BUSINESS_DETAILS_FRM.fields[fieldName].value);
  }

  @action
  removeForm = (e, formName, index) => {
    e.preventDefault();
    this.BUSINESS_DETAILS_FRM.fields[formName].splice(index, 1);
  }

  @action
  addMoreForms = (e, formName) => {
    e.preventDefault();
    console.log(formName);
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
  businessDetailsReset = (e, fieldName, index) => {
    console.log(e, fieldName, index);
    this.BUSINESS_DETAILS_FRM.fields[fieldName].value.splice(index, 1);
    // this.BUSINESS_DETAILS_FRM = Validator.onChange(this.BUSINESS_DETAILS_FRM,
    // { name: field, value: '' });
  };

  @action
  performanceFiles = (fieldName, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.BUSINESS_PERF_FRM = Validator.onChange(
        this.BUSINESS_PERF_FRM,
        { name: fieldName, value: uploadedFile },
      );
    }
  }

  @action
  performanceReset = (field) => {
    this.BUSINESS_PERF_FRM = Validator.onChange(this.BUSINESS_PERF_FRM, { name: field, value: '' });
  };

  @action
  docuFiles = (fieldName, files) => {
    let uploadedFile = '';
    if (typeof files !== 'undefined' && files.length) {
      uploadedFile = files[0].name;
      this.BUSINESS_DOC_FRM = Validator.onChange(
        this.BUSINESS_DOC_FRM,
        { name: fieldName, value: uploadedFile },
      );
    }
  }

  @action
  docuReset = (field) => {
    this.BUSINESS_DOC_FRM = Validator.onChange(this.BUSINESS_DOC_FRM, { name: field, value: '' });
  };
}

export default new NewBusinessStore();
