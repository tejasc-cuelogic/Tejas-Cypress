import { observable, action, computed } from 'mobx';
import { capitalize } from 'lodash';
import graphql from 'mobx-apollo';
import { INVESTMENT_INFO, INVEST_ACCOUNT_TYPES, TRANSFER_REQ_INFO, AGREEMENT_DETAILS_INFO } from '../../../constants/investment';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { uiStore, userDetailsStore } from '../../index';
import {
  getAmountInvestedInCampaign, getInvestorAvailableCash, getUserRewardBalance,
  validateInvestmentAmountInOffering, validateInvestmentAmount, getInvestorInFlightCash,
  addFunds, generateAgreement, finishInvestment, transferFundsForInvestment,
} from '../../queries/investNow';

export class InvestmentStore {
    @observable userId = (userDetailsStore.userDetaiils && userDetailsStore.userDetaiils.id)
    || null;
    @observable currentInvestmentLimit = (userDetailsStore.userDetails &&
      userDetailsStore.userDetails.limits && userDetailsStore.userDetails.limits.limit) || 0
    @observable INVESTMONEY_FORM = Validator.prepareFormObject(INVESTMENT_INFO);
    @observable TRANSFER_REQ_FORM = Validator.prepareFormObject(TRANSFER_REQ_INFO);
    @observable AGREEMENT_DETAILS_FORM = Validator.prepareFormObject(AGREEMENT_DETAILS_INFO);
    @observable cashAvailable = 5819.01;
    @observable investAccTypes = { ...INVEST_ACCOUNT_TYPES };
    @observable stepToBeRendered = 0;
    @observable offeringMetaData = {
      campaignType: 0,
      rate: 5,
      rateMin: 2,
      rateMax: 8,
      annualReturn: 1000,
      targetTerm: 5000,
    }
    @observable estReturnVal = '-';
    @observable disableNextbtn = true;

    @computed get getSelectedAccountTypeId() {
      const accType = this.investAccTypes.value;
      userDetailsStore.setFieldValue('currentActiveAccount', accType);
      const selectedAccount = userDetailsStore.currentActiveAccountDetails;
      return selectedAccount;
    }

    @action
    setDisableNextbtn = () => {
      this.disableNextbtn = false;
    }

    @action
    ResetDisableNextbtn = () => {
      this.disableNextbtn = true;
    }

    @action
    setStepToBeRendered = (step) => {
      this.stepToBeRendered = step;
    }

    @action
    investMoneyChange = (values, field) => {
      this.INVESTMONEY_FORM = Validator.onChange(this.INVESTMONEY_FORM, {
        name: field,
        value: values.floatValue,
      });
      this.calculateEstimatedReturn();
    };

    @action
    agreementInfoChange = (values, field) => {
      this.AGREEMENT_DETAILS_FORM = Validator.onChange(this.AGREEMENT_DETAILS_FORM, {
        name: field,
        value: values.floatValue,
      });
    };

    @action
    availableCreditsChange = (values, field) => {
      this.TRANSFER_REQ_FORM = Validator.onChange(this.TRANSFER_REQ_FORM, {
        name: field,
        value: values.floatValue,
      });
    };

    @action
    accTypeChanged = (e, res) => {
      this.investAccTypes.value = res.value;
    }

    @action
    prepareAccountTypes = (UserAccounts) => {
      if (this.investAccTypes.values.length === 0 && UserAccounts) {
        UserAccounts.map((acc) => {
          const label = acc === 'ira' ? 'IRA' : capitalize(acc);
          this.investAccTypes.values.push({ label, value: acc });
          return null;
        });
        const val = this.investAccTypes.values[0].value;
        this.investAccTypes.value = val;
      }
    }
    @action
    setCheckbox = (e, res) => {
      this.AGREEMENT_DETAILS_FORM =
      Validator.onChange(this.AGREEMENT_DETAILS_FORM, Validator.pullValues(e, res), 'checkbox');
    }
    @computed get investmentAmount() {
      return this.INVESTMONEY_FORM.fields.investmentAmount.value;
    }

    @computed get investmentLimitsChecked() {
      return this.AGREEMENT_DETAILS_FORM.fields.checkboxesLeft.value.includes('4');
    }

    @computed get notePurchaseAgrChecked() {
      return this.AGREEMENT_DETAILS_FORM.fields.checkboxesRight.value.includes('5');
    }

    @computed get calculateTotalPaymentTermLoan() {
      return Math.round(((((this.offeringMetaData.annualReturn / 100.0) / 12) *
      this.investmentAmount) /
      (1 - ((1 + ((this.offeringMetaData.annualReturn / 100.0) / 12)) **
      (((-1) * this.offeringMetaData.targetTerm))))) * this.offeringMetaData.targetTerm);
    }

    @action
    calculateEstimatedReturn = () => {
      const {
        rate,
        rateMin,
        rateMax,
        campaignType,
      } = this.offeringMetaData;
      const investAmt = this.investmentAmount;
      // const campaignType = 1;
      if (investAmt >= 100) {
        if (campaignType === 0) {
          // const rate = rate;
          // const rateMin = OfferingMeta.rateMin ? OfferingMeta.rateMin : OfferingMeta.rate;
          // const rateMax = OfferingMeta.rateMax ? OfferingMeta.rateMax : OfferingMeta.rate;
          if (rateMin === rateMax) {
            this.estReturnVal = `${Helper.CurrencyFormat(Math.round(rate * investAmt))}`;
          } else {
            const estReturnMIN = Helper.CurrencyFormat(Math.round(rateMin * investAmt));
            const estReturnMAX = Helper.CurrencyFormat(Math.round(rateMax * investAmt));
            this.estReturnVal = `${estReturnMIN} - ${estReturnMAX}`;
            return this.estReturnVal;
          }
        } else if (campaignType === 1) {
          // const annualReturn = 0;
          // const targetTerm = 0;
          this.estReturnVal = `${Helper.CurrencyFormat(Math.round(this.calculateTotalPaymentTermLoan))}`;
          return this.estReturnVal;
        }
      } else {
        this.estReturnVal = '-';
        return this.estReturnVal;
      }
      return this.estReturnVal;
    }

    @action
    getAmountInvestedInCampaign = () => {
      this.details = graphql({
        client,
        query: getAmountInvestedInCampaign,
        variables: {
          // offeringId,
          userId: this.userId,
          // accountId,
        },
        fetchPolicy: 'network-only',
      });
    }

    @action
    getInvestorAvailableCash = () => new Promise((resolve) => {
      this.details = graphql({
        client,
        query: getInvestorAvailableCash,
        variables: {
          userId: this.userId,
          // accountId,
          // includeInFlight,
          // includeInterest,
          // includeReferralCredit,
          // dateFilterStart,
          // dateFilterStop,
          // txOnly,
        },
        onFetch: (data) => {
          if (data) {
            resolve(data);
          }
        },
        fetchPolicy: 'network-only',
      });
    });

    @action
    getUserRewardBalance = () => {
      this.details = graphql({
        client,
        query: getUserRewardBalance,
        variables: {
          userId: this.userId,
          // dateFilterStart,
          // dateFilterStop,
        },
        fetchPolicy: 'network-only',
      });
    }

    @action
    validateInvestmentAmountInOffering = () => {
      this.details = graphql({
        client,
        query: validateInvestmentAmountInOffering,
        variables: {
          // investmentAmount,
          // offeringId,
          userId: this.userId,
          // accountId,
        },
        fetchPolicy: 'network-only',
      });
    }

    @action
    validateInvestmentAmount = () => {
      this.details = graphql({
        client,
        query: validateInvestmentAmount,
        variables: {
          userId: this.userId,
          // accountId,
          // offeringId,
          // investmentAmount,
          // autoDraftDeposit,
          // creditToSpend,
        },
        fetchPolicy: 'network-only',
      });
    }

    @action
    getInvestorInFlightCash = () => {
      this.details = graphql({
        client,
        query: getInvestorInFlightCash,
        variables: {
          userId: this.userId,
          // accountId,
          // isAutoDraft,
        },
        fetchPolicy: 'network-only',
      });
    }

  @action
  addFunds = () => {
    uiStore.setProgress();
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: addFunds,
          variables: {
            userId: this.userId,
            // accountId,
            // amount,
            // description,
            // agreementId,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  generateAgreement = () => {
    uiStore.setProgress();
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: generateAgreement,
          variables: {
            userId: this.userId,
            // accountId,
            // offeringId,
            // investmentAmount,
            // transferAmount,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  finishInvestment = () => {
    uiStore.setProgress();
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: finishInvestment,
          variables: {
            userId: this.userId,
            // accountId,
            // offeringId,
            // investmentAmount,
            // agreementId,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  transferFundsForInvestment = () => {
    uiStore.setProgress();
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: transferFundsForInvestment,
          variables: {
            userId: this.userId,
            // accountId,
            // transferAmount,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new InvestmentStore();
