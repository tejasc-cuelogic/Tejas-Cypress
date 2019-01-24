import { observable, action, computed, toJS } from 'mobx';
import { capitalize, orderBy, min, max, floor, mapValues } from 'lodash';
import graphql from 'mobx-apollo';
import money from 'money-math';
import { INVESTMENT_LIMITS, INVESTMENT_INFO, INVEST_ACCOUNT_TYPES, TRANSFER_REQ_INFO, AGREEMENT_DETAILS_INFO } from '../../../constants/investment';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { uiStore, userDetailsStore, rewardStore, campaignStore, portfolioStore, investmentLimitStore } from '../../index';
import {
  getAmountInvestedInCampaign, getInvestorAvailableCash,
  validateInvestmentAmountInOffering, validateInvestmentAmount, getInvestorInFlightCash,
  generateAgreement, finishInvestment, transferFundsForInvestment,
} from '../../queries/investNow';
// import { getInvestorInvestmentLimit } from '../../queries/investementLimits';

export class InvestmentStore {
  @observable INVESTMONEY_FORM = Validator.prepareFormObject(INVESTMENT_INFO);
  @observable TRANSFER_REQ_FORM = Validator.prepareFormObject(TRANSFER_REQ_INFO);
  @observable AGREEMENT_DETAILS_FORM = Validator.prepareFormObject(AGREEMENT_DETAILS_INFO);
  @observable INVESTMENT_LIMITS_FORM = Validator.prepareFormObject(INVESTMENT_LIMITS);
  @observable cashAvailable = 0;
  @observable agreementDetails = null;
  @observable investAccTypes = { ...INVEST_ACCOUNT_TYPES };
  @observable stepToBeRendered = 0;
  @observable offeringMetaData = {
    campaignType: 0,
    rate: 5,
    rateMin: campaignStore.minInvestAmt,
    annualReturn: 1000,
    targetTerm: 5000,
  }
  @observable estReturnVal = '-';
  @observable disableNextbtn = true;
  @observable isValidInvestAmtInOffering = false;
  @observable byDefaultRender = true;
  @observable showTransferRequestErr = false;
  @observable investmentFlowErrorMessage = null;

  @action
  setShowTransferRequestErr = (status) => {
    this.showTransferRequestErr = status;
    this.setFieldValue('disableNextbtn', !status);
  }

  @action
  setByDefaultRender = (status) => {
    this.byDefaultRender = status;
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }
  @action
  resetAggrementForm = () => {
    this.AGREEMENT_DETAILS_FORM = Validator.prepareFormObject(AGREEMENT_DETAILS_INFO);
  }

  @computed get getDiffInvestmentLimitAmount() {
    const oldLimit = parseFloat((portfolioStore.getInvestorAccountById &&
      portfolioStore.getInvestorAccountById.investedAmount) || 0, 2);
    const currentLimit = parseFloat(this.INVESTMONEY_FORM.fields.investmentAmount.value, 2);
    return currentLimit - oldLimit;
  }

  @computed get getSelectedAccountTypeId() {
    const accType = this.investAccTypes.value;
    userDetailsStore.setFieldValue('currentActiveAccount', accType);
    const selectedAccount = userDetailsStore.currentActiveAccountDetails;
    return (selectedAccount && selectedAccount.details) ?
      selectedAccount.details.accountId : null;
  }
  @computed get getCurrCashAvailable() {
    return (this.cashAvailable &&
      this.cashAvailable.data.getInvestorAvailableCash)
      || 0;
  }
  @computed get getTransferRequestAmount() {
    const transferAmount = money.subtract(
      this.investmentAmount,
      money.add(this.getCurrCashAvailable, rewardStore.getCurrCreditAvailable),
    );
    return transferAmount < 0 ? 0 : transferAmount;
  }
  @computed get getSpendCreditValue() {
    let spendAmount = 0;
    if (this.getCurrCashAvailable < this.investmentAmount) {
      const lowValue = money.subtract(this.investmentAmount, this.getCurrCashAvailable);
      if (rewardStore.getCurrCreditAvailable < lowValue) {
        spendAmount = money.subtract(lowValue, rewardStore.getCurrCreditAvailable);
      }
    }
    return parseFloat(spendAmount, 2);
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
  accTypeChanged = (e, res) => new Promise((resolve) => {
    this.investAccTypes.value = res.value;
    resolve(res.value);
  });

  @action
  prepareAccountTypes = (UserAccounts) => {
    if (this.investAccTypes.values.length === 0 && UserAccounts.length) {
      UserAccounts.map((acc) => {
        const label = acc === 'ira' ? 'IRA' : capitalize(acc);
        this.investAccTypes.values.push({ label, value: acc });
        return null;
      });
      const val = this.investAccTypes.values[0].value;
      this.investAccTypes.value = val;
    }
    if (this.investAccTypes.values.length === 0) {
      this.setFieldValue('disableNextbtn', false);
    }
  }
  @action
  setCheckbox = (e, res) => {
    this.AGREEMENT_DETAILS_FORM =
      Validator.onChange(this.AGREEMENT_DETAILS_FORM, Validator.pullValues(e, res), 'checkbox');
  }

  @action
  investmentLimitChange = (values, field) => {
    this.INVESTMENT_LIMITS_FORM = Validator.onChange(this.INVESTMENT_LIMITS_FORM, {
      name: field,
      value: values.floatValue,
    });
  };

  @computed get investmentAmount() {
    const val = this.INVESTMONEY_FORM.fields.investmentAmount.value;
    return parseFloat(val || 0);
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
      rateMin,
      campaignType,
    } = this.offeringMetaData;
    const investAmt = this.investmentAmount;
    if (investAmt >= 100) {
      if (campaignType === 0) {
        const estReturnMIN = Helper.CurrencyFormat(Math.round(rateMin * investAmt));
        this.estReturnVal = estReturnMIN;
        return this.estReturnVal;
      } else if (campaignType === 1) {
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
        userId: userDetailsStore.currentUserId,
        // accountId,
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
      fetchPolicy: 'network-only',
    });
  }

  @action
  getInvestorAvailableCash = () => new Promise((resolve) => {
    this.cashAvailable = graphql({
      client,
      query: getInvestorAvailableCash,
      variables: {
        userId: userDetailsStore.currentUserId,
        accountId: this.getSelectedAccountTypeId,
        includeInFlight: true,
      },
      onFetch: (data) => {
        if (data) {
          rewardStore.getUserRewardBalance().then(() => {
            resolve(data);
          });
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  validateInvestmentAmountInOffering = () => {
    if (this.investmentAmount) {
      this.details = graphql({
        client,
        query: validateInvestmentAmountInOffering,
        variables: {
          investmentAmount: this.investmentAmount,
          offeringId: campaignStore.getOfferingId || portfolioStore.currentOfferingId,
          userId: userDetailsStore.currentUserId,
          accountId: this.getSelectedAccountTypeId,
        },
        onFetch: (res) => {
          const { status, message } = res.validateInvestmentAmountInOffering;
          this.setFieldValue('isValidInvestAmtInOffering', status);
          this.setFieldValue('disableNextbtn', status);
          this.INVESTMONEY_FORM.fields.investmentAmount.error = !status ? message : undefined;
          this.INVESTMONEY_FORM.meta.isValid = status;
        },
        onError: () => {
          Helper.toast('Something went wrong, please try again later.', 'error');
        },
        fetchPolicy: 'network-only',
      });
    }
  }

  @action
  validateInvestmentAmount = () => new Promise((resolve, reject) => {
    graphql({
      client,
      query: validateInvestmentAmount,
      variables: {
        userId: userDetailsStore.currentUserId,
        accountId: this.getSelectedAccountTypeId,
        offeringId: campaignStore.getOfferingId || portfolioStore.currentOfferingId,
        investmentAmount: this.investmentAmount,
        autoDraftDeposit: this.getTransferRequestAmount,
        creditToSpend: this.getSpendCreditValue,
      },
      onFetch: (data) => {
        if (data) {
          const { status, message } = data.validateInvestmentAmount;
          const errorMessage = !status ? message : null;
          this.setFieldValue('investmentFlowErrorMessage', errorMessage);
          resolve(status);
        }
        if (!data.validateInvestmentAmount) {
          this.setShowTransferRequestErr(true);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        this.setShowTransferRequestErr(true);
        reject();
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  getInvestorInFlightCash = () => {
    this.details = graphql({
      client,
      query: getInvestorInFlightCash,
      variables: {
        userId: userDetailsStore.currentUserId,
        // accountId,
        // isAutoDraft,
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
      fetchPolicy: 'network-only',
    });
  }

  @action
  generateAgreement = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: generateAgreement,
          variables: {
            userId: userDetailsStore.currentUserId,
            accountId: this.getSelectedAccountTypeId,
            offeringId: campaignStore.getOfferingId || portfolioStore.currentOfferingId,
            investmentAmount: this.investmentAmount,
            creditToSpend: this.getSpendCreditValue,
            callbackUrl: `${window.location.origin}/secure-gateway`,
          },
          // refetchQueries: [{ query: getBusinessApplications }],
        })
        .then((data) => {
          this.setFieldValue('agreementDetails', data.data.generateAgreement);
          resolve(data.data.generateAgreement);
        })
        .catch((error) => {
          Helper.toast(error.message, 'error');
          this.setShowTransferRequestErr(true);
          uiStore.setErrors(error.message);
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  finishInvestment = () => {
    if (this.agreementDetails) {
      uiStore.setProgress();
      return new Promise((resolve) => {
        client
          .mutate({
            mutation: finishInvestment,
            variables: {
              userId: userDetailsStore.currentUserId,
              accountId: this.getSelectedAccountTypeId,
              offeringId: campaignStore.getOfferingId || portfolioStore.currentOfferingId,
              investmentAmount: this.investmentAmount,
              agreementId: this.agreementDetails.agreementId,
              transferAmount: this.getTransferRequestAmount,
            },
          })
          .then((data) => {
            // resolve(data.data.finishInvestment);
            const { status, message } = data.data.finishInvestment;
            const errorMessage = !status ? message : null;
            this.setFieldValue('investmentFlowErrorMessage', errorMessage);
            resolve(status);
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
    return false;
  }

  @action
  transferFundsForInvestment = () => {
    uiStore.setProgress();
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: transferFundsForInvestment,
          variables: {
            userId: userDetailsStore.currentUserId,
            accountId: this.getSelectedAccountTypeId,
            transferAmount: this.getSpendCreditValue,
          },
        })
        .then((data) => {
          resolve(data.data.transferFundsForInvestment);
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

  @computed get validBonusRewards() {
    const { campaign } = campaignStore;
    let bonusRewards = [];
    let matchedTierAmount = 0;
    if (campaign && campaign.bonusRewards && campaign.bonusRewards.length) {
      campaign.bonusRewards.map((reward) => {
        const tiersArray = orderBy(reward.tiers, ['amount'], ['asc']);
        tiersArray.map((tier) => {
          if (this.investmentAmount >= tier.amount &&
            (matchedTierAmount === 0 || tier.amount === matchedTierAmount)) {
            matchedTierAmount = tier.amount;
            bonusRewards.push(reward);
          }
          return null;
        });
        return null;
      });
      bonusRewards = [...new Set(toJS(bonusRewards))];
    }
    return bonusRewards;
  }

  @action
  updateInvestmentLimits = () => new Promise((resolve) => {
    const data = mapValues(this.INVESTMENT_LIMITS_FORM.fields, f => parseInt(f.value, 10));
    investmentLimitStore
      .updateInvestmentLimits(data, this.getSelectedAccountTypeId, userDetailsStore.currentUserId)
      .then(() => resolve());
  })

  @action
  resetData = () => {
    Validator.resetFormData(this.INVESTMONEY_FORM);
    Validator.resetFormData(this.INVESTMENT_LIMITS_FORM);
    Validator.resetFormData(this.AGREEMENT_DETAILS_FORM);
  }

  @action
  resetForm = (form) => {
    Validator.resetFormData(form);
  }

  @computed get changedInvestmentLimit() {
    const { fields } = this.INVESTMENT_LIMITS_FORM;
    const annualIncome = fields.annualIncome.value;
    const netWorth = fields.netWorth.value;
    const annualInvestmentLimitFloor = 2200;
    const annualInvestmentLimit = 107000;
    const annualIncomeLimitHighPct = 0.10;
    let annualInvestmentLimitLowPct = 0;
    let limit = null;

    if (this.INVESTMENT_LIMITS_FORM.meta.isValid) {
      annualInvestmentLimitLowPct = 0.05;

      limit = floor(annualIncomeLimitHighPct * min([annualIncome, netWorth]));
      if (annualIncome < annualInvestmentLimit || netWorth < annualInvestmentLimit) {
        limit = max([
          annualInvestmentLimitFloor,
          floor(annualInvestmentLimitLowPct * min([annualIncome, netWorth]))]);
      }
      limit = min([limit, annualInvestmentLimit]);
    }
    return limit;
  }
  @action
  setInvestmentLimitData = () => {
    const userDetail = userDetailsStore.userDetails;
    const investments = {
      netWorth: userDetail.limits.netWorth,
      annualIncome: userDetail.limits.income,
      cfInvestments: userDetail.limits.otherContributions,
    };
    this.INVESTMENT_LIMITS_FORM = Validator
      .setFormData(this.INVESTMENT_LIMITS_FORM, investments);
    this.INVESTMENT_LIMITS_FORM.meta.isValid = true;
  }
}

export default new InvestmentStore();
