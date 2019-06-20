import { observable, action, computed, toJS } from 'mobx';
import { forEach, indexOf } from 'lodash';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { LENDIO_PRE_QUAL, LENDIO } from '../../../constants/businessApplication';
import { submitPartneredWithLendio } from '../../queries/businessApplication';
import { uiStore } from '../../index';

export class BusinessAppStore {
  @observable LENDIO_QUAL_FRM = Validator.prepareFormObject(LENDIO_PRE_QUAL);

  @observable lendioUrl = null;

  @observable lendioObj = null;

  @action
  setPartneredLendioData = (preQualificationData) => {
    this.LENDIO_QUAL_FRM = Validator.prepareFormObject(LENDIO_PRE_QUAL);
    const {
      email,
      firstName,
      lastName,
      businessGeneralInfo: {
        businessName,
        contactDetails: {
          phone: {
            number,
          },
        },
      },
      existingBusinessInfo: {
        ageMonths,
        ageYears,
      },
      performanceSnapshot: {
        pastYearSnapshot: {
          grossSales,
        },
      },
      businessExperience: {
        estimatedCreditScore,
        amountNeeded,
      },
    } = preQualificationData;

    this.lendioObj = preQualificationData.lendio;
    this.LENDIO_QUAL_FRM.fields.businessName.value = businessName;
    this.LENDIO_QUAL_FRM.fields.phoneNumber.value = number;
    this.LENDIO_QUAL_FRM.fields.emailAddress.value = email;
    this.LENDIO_QUAL_FRM.fields.businessOwnerName.value = `${firstName} ${lastName}`;

    // Extract and map business age (months)
    const ageInMonths = (12 * ageYears) + ageMonths;
    let selectedDuration = '';
    forEach(LENDIO.LENDING_PARTNER_LENDIO_DURATION_MAP, (value, months) => {
      selectedDuration = value;
      if (ageInMonths <= months) {
        return false;
      }
      return true;
    });

    this.LENDIO_QUAL_FRM.fields.yrsInBusiness.value = selectedDuration;

    // Extract and map monthly sales
    const monthlySales = Math.floor(grossSales / 12);
    let selectedSales = '';
    forEach(LENDIO.LENDING_PARTNER_LENDIO_MO_SALES_MAP, (value, sales) => {
      selectedSales = value;
      if (monthlySales <= sales) {
        return false;
      }
      return true;
    });

    this.LENDIO_QUAL_FRM.fields.avgSales.value = selectedSales;

    // Extract and map personal credit
    let selectedCredit = '';
    forEach(LENDIO.LENDING_PARTNER_LENDIO_SALES_CREDIT_MAP, (value, credit) => {
      selectedCredit = value;
      if (estimatedCreditScore <= credit) {
        return false;
      }
      return true;
    });

    this.LENDIO_QUAL_FRM.fields.personalCreditRating.value = selectedCredit;

    // Extract and map raise amount
    let selectedRaiseAmt = '';
    forEach(LENDIO.LENDING_PARTNER_LENDIO_RAISE_AMT_MAP, (value, amount) => {
      selectedRaiseAmt = value;
      if (amountNeeded <= amount) {
        return false;
      }
      return true;
    });

    this.LENDIO_QUAL_FRM.fields.raiseAmount.value = selectedRaiseAmt;
  };

  @action
  lendioEleChange = (e, res, type) => {
    this.LENDIO_QUAL_FRM = Validator.onChange(this.LENDIO_QUAL_FRM, Validator.pullValues(e, res, type));
  };

  @action
  businessLendioEleChange = (e, res) => {
    this.LENDIO_QUAL_FRM = Validator.onChange(this.LENDIO_QUAL_FRM, Validator.pullValues(e, res));
  };

  @computed get getFormatedofLendioData() {
    const data = Validator.ExtractValues(toJS(this.LENDIO_QUAL_FRM.fields));
    const agreeConditionsValue = indexOf(data.applicationAgreeConditions, 'agreeConditions') !== -1;
    const sendDataToLendioValue = indexOf(data.applicationAgreeConditions, 'sendDataToLendio') !== -1;

    const lendioData = {
      preQualInformation: {
        duration: data.yrsInBusiness,
        averageMonthlySales: data.avgSales,
        ratePersonalCredit: data.personalCreditRating,
        industry: data.industry,
        raiseAmount: data.raiseAmount,
      },
      customerInformation: {
        businessName: data.businessName,
        ownerFullName: data.businessOwnerName,
        realEmail: data.emailAddress,
        phoneNumber: data.phoneNumber,
        comments: data.comments,
      },
      agreeConditions: agreeConditionsValue,
      sendDataToLendio: sendDataToLendioValue,
    };

    return lendioData;
  }

  @action
  businessLendioPreQual = (applicationId) => {
    let formatedData = this.getFormatedofLendioData;
    formatedData = { id: applicationId, ...formatedData };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      clientPublic
        .mutate({
          mutation: submitPartneredWithLendio,
          variables: {
            lendioApplication: formatedData,
          },
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          uiStore.setErrors('Something went wrong, please try again later.');
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  };

  @action
  setLendioUrl = (val) => {
    this.lendioUrl = val;
  };
}

export default new BusinessAppStore();
