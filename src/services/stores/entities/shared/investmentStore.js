import { observable, action, computed, toJS } from 'mobx';
import { capitalize, orderBy, mapValues, get, includes } from 'lodash';
import { Calculator } from 'amortizejs';
import money from 'money-math';
import { INVESTMENT_LIMITS, INVESTMENT_INFO, INVEST_ACCOUNT_TYPES, TRANSFER_REQ_INFO, AGREEMENT_DETAILS_INFO, PREFERRED_EQUITY_INVESTMENT_INFO } from '../../../constants/investment';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { uiStore, userDetailsStore, campaignStore, portfolioStore, investmentLimitStore } from '../../index';
import { investNowSubmit, investNowGeneratePurchaseAgreement } from '../../queries/investNow';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';

export class InvestmentStore {
  @observable INVESTMONEY_FORM = Validator.prepareFormObject(INVESTMENT_INFO);

  @observable TRANSFER_REQ_FORM = Validator.prepareFormObject(TRANSFER_REQ_INFO);

  @observable AGREEMENT_DETAILS_FORM = Validator.prepareFormObject(AGREEMENT_DETAILS_INFO);

  @observable INVESTMENT_LIMITS_FORM = Validator.prepareFormObject(INVESTMENT_LIMITS);

  @observable PREFERRED_EQUITY_INVESTMONEY_FORM = Validator.prepareFormObject(PREFERRED_EQUITY_INVESTMENT_INFO);

  @observable agreementDetails = null;

  @observable investAccTypes = { ...INVEST_ACCOUNT_TYPES };

  @observable stepToBeRendered = 0;

  @observable offeringMetaData = {
    campaignType: 0,
    rate: 5,
    rateMin: 1.5,
    annualReturn: 1000,
    targetTerm: 5000,
  }

  @observable estReturnVal = '-';

  @observable disableNextbtn = true;

  @observable isValidInvestAmtInOffering = false;

  @observable byDefaultRender = true;

  @observable showTransferRequestErr = false;

  @observable investmentFlowErrorMessage = null;

  @observable isGetTransferRequestCall = false;

  @observable equityInvestmentAmount = '$ 0';

  @observable investmentFlowEquityErrorMessage = null;

  @observable isUpdateLimitReflect = false;

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
    const userAmountDetails = investmentLimitStore.getCurrentInvestNowHealthCheck;
    if (userAmountDetails && !money.isZero(this.investmentAmount)) {
      const getPreviousInvestedAmount = (userAmountDetails && userAmountDetails.previousAmountInvested) || '0';
      const differenceResult = money.subtract(
        this.investmentAmount,
        getPreviousInvestedAmount,
      );
      return differenceResult;
    }
    return 0;
    // const oldLimit = parseFloat((portfolioStore.getInvestorAccountById &&
    //   portfolioStore.getInvestorAccountById.investedAmount) || 0, 2);
    // const currentLimit = parseFloat(this.INVESTMONEY_FORM.fields.investmentAmount.value, 2);

    // return currentLimit - oldLimit;
  }

  @computed get getSelectedAccountTypeId() {
    const accType = this.investAccTypes.value;
    userDetailsStore.setFieldValue('currentActiveAccount', accType);
    const selectedAccount = userDetailsStore.currentActiveAccountDetails;
    return (selectedAccount && selectedAccount.details)
      ? selectedAccount.details.accountId : null;
  }

  @computed get getTransferRequestAmount() {
    const userAmountDetails = investmentLimitStore.getCurrentInvestNowHealthCheck;
    const getCurrCashAvailable = (userAmountDetails && userAmountDetails.availableCash) || '0';
    const getrewardBalanceAvailable = (userAmountDetails && userAmountDetails.rewardBalance) || '0';
    // const getPreviousCreditAvailable =
    // (userAmountDetails && userAmountDetails.previousInvestmentCredit) || '0';
    // const getCurrCreditAvailable =
    //   money.add(getrewardBalanceAvailable, getPreviousCreditAvailable);
    const cashAndCreditBalance = money.add(getCurrCashAvailable, getrewardBalanceAvailable);
    const getPreviousInvestedAmount = (userAmountDetails && userAmountDetails.previousAmountInvested) || '0';
    const transferAmount = money.subtract(
      this.investmentAmount,
      money.add(cashAndCreditBalance, getPreviousInvestedAmount),
    );
    return money.isNegative(transferAmount) || money.isZero(transferAmount) ? '0' : transferAmount;
    // return transferAmount < '0' ? '0' : transferAmount;
  }

  @computed get getSpendCreditValue() {
    const userAmountDetails = investmentLimitStore.getCurrentInvestNowHealthCheck;
    const getCurrCashAvailable = (userAmountDetails && userAmountDetails.availableCash) || '0';
    const getCurrCreditAvailable = (userAmountDetails && userAmountDetails.rewardBalance) || '0';
    let spendAmount = 0;
    if (getCurrCashAvailable < this.investmentAmount) {
      const lowValue = money.subtract(this.investmentAmount, getCurrCashAvailable);
      if (getCurrCreditAvailable < lowValue) {
        spendAmount = money.subtract(lowValue, getCurrCreditAvailable);
      }
    }
    return parseFloat(spendAmount, 2);
  }

  @action
  setStepToBeRendered = (step) => {
    this.stepToBeRendered = step;
  }

  @action
  investMoneyChange = (values, field, isPreferredEquiry = false) => {
    this.INVESTMONEY_FORM = Validator.onChange(this.INVESTMONEY_FORM, {
      name: field,
      value: values.floatValue,
    });
    if (!isPreferredEquiry) {
      this.calculateEstimatedReturn();
    }
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
  resetAccTypeChanged = () => {
    this.investAccTypes = { ...INVEST_ACCOUNT_TYPES };
  }

  @action
  prepareAccountTypes = (UserAccounts) => {
    if (this.investAccTypes.values.length === 0 && UserAccounts.length) {
      UserAccounts.map((acc) => {
        const label = acc === 'ira' ? 'IRA' : capitalize(acc);
        this.investAccTypes.values.push({ label, value: acc });
        return null;
      });
      const val = this.investAccTypes.values[0].value;
      this.investAccTypes.value = this.investAccTypes.value || val;
    }
    if (this.investAccTypes.values.length === 0) {
      this.setFieldValue('disableNextbtn', false);
    }
  }

  @action
  setCheckbox = (e, res) => {
    this.AGREEMENT_DETAILS_FORM = Validator.onChange(this.AGREEMENT_DETAILS_FORM, Validator.pullValues(e, res), 'checkbox');
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
    return money.floatToAmount(val || 0);
  }

  @computed get investmentLimitsChecked() {
    return this.AGREEMENT_DETAILS_FORM.fields.checkboxesLeft.value.includes('4');
  }

  @computed get notePurchaseAgrChecked() {
    return this.AGREEMENT_DETAILS_FORM.fields.checkboxesRight.value.includes('5');
  }

  @computed get calculateTotalPaymentTermLoan() {
    return Math.round(((((this.offeringMetaData.annualReturn / 100.0) / 12)
      * this.investmentAmount)
      / (1 - ((1 + ((this.offeringMetaData.annualReturn / 100.0) / 12))
        ** (((-1) * this.offeringMetaData.targetTerm))))) * this.offeringMetaData.targetTerm);
  }

  @action
  calculateEstimatedReturn = () => {
    const { campaign } = campaignStore;
    const { getInvestorAccountById } = portfolioStore;
    let offeringSecurityType = '';
    let interestRate = '';
    let investmentMultiple = '';
    let loanTerm = '';
    if (campaign && campaign.keyTerms) {
      offeringSecurityType = get(campaign, 'keyTerms.securities');
      interestRate = get(campaign, 'keyTerms.interestRate') && get(campaign, 'keyTerms.interestRate') !== null ? get(campaign, 'keyTerms.interestRate') : '0';
      investmentMultiple = get(campaign, 'closureSummary.keyTerms.multiple') || '0';
      loanTerm = parseFloat(get(campaign, 'keyTerms.maturity'));
    } else {
      offeringSecurityType = get(getInvestorAccountById, 'offering.keyTerms.securities');
      interestRate = get(getInvestorAccountById, 'offering.keyTerms.interestRate') && get(getInvestorAccountById, 'offering.keyTerms.interestRate') !== null ? get(getInvestorAccountById, 'offering.keyTerms.interestRate') : '0';
      investmentMultiple = get(getInvestorAccountById, 'offering.closureSummary.keyTerms.multiple') || '0';
      loanTerm = parseFloat(get(getInvestorAccountById, 'offering.keyTerms.maturity'));
    }
    const investAmt = this.investmentAmount;
    if (investAmt >= 100) {
      if (offeringSecurityType === 'TERM_NOTE') {
        const data = {
          method: 'mortgage',
          apr: parseFloat(interestRate) || 0,
          balance: parseFloat(investAmt) || 0,
          loanTerm: loanTerm || 0,
        };
        const { totalPayment } = Calculator.calculate(data);
        const finalAmtM = money.floatToAmount(Math.floor(totalPayment) || '');
        //
        // const interestRate_f = parseFloat(interestRate);
        // const num = (interestRate_f / 100.0) / 12 * parseFloat(investAmt);
        // const denom = 1 - Math.pow((1 + (interestRate_f / 100.0) / 12), (-1 * targetTerm)));
        // const finalAmt = (num/denom)*;
        //
        // const finalAmt_m = money.floatToAmount(finalAmt);
        const estReturnMIN = Helper.CurrencyFormat(finalAmtM, 0, 0);
        this.estReturnVal = estReturnMIN;
        return this.estReturnVal;
      }
      const formatedInvestmentMultiple = money.floatToAmount(investmentMultiple);
      const estReturnMIN = Helper.CurrencyFormat(money.mul(formatedInvestmentMultiple, investAmt), 0);
      this.estReturnVal = estReturnMIN;
      return this.estReturnVal;
    } if (investAmt <= 100) {
      this.setFieldValue('estReturnVal', '-');
      return this.estReturnVal;
    }
    return this.estReturnVal;
  }

  @action
  validateInvestmentAmountInOffering = () => new Promise((resolve, reject) => {
    uiStore.setProgress();
    if (this.investmentAmount) {
      const { campaign } = campaignStore;
      const offeringSecurityType = get(campaign, 'keyTerms.securities') || '0';
      if (this.checkLockinPeriod()) {
        this.setFieldValue('isValidInvestAmtInOffering', false);
        this.setFieldValue('disableNextbtn', false);
        this.INVESTMONEY_FORM.fields.investmentAmount.error = 'The campaign is currently within the last 48 hours of closing. Your investment cannot be reduced or canceled at this time.';
        this.INVESTMONEY_FORM.meta.isValid = false;
        uiStore.setProgress(false);
        resolve();
      } else if (!includes(['PREFERRED_EQUITY_506C'], offeringSecurityType) && !this.isValidMultipleAmount(this.investmentAmount)) {
        this.setFieldValue('isValidInvestAmtInOffering', false);
        this.setFieldValue('disableNextbtn', false);
        this.setFieldValue('investmentFlowErrorMessage', 'Investments must be in increments of $100');
        this.INVESTMONEY_FORM.fields.investmentAmount.error = 'Investments must be in increments of $100';
        this.INVESTMONEY_FORM.meta.isValid = false;
        uiStore.setProgress(false);
        resolve();
      } else {
        client
          .mutate({
            mutation: investNowGeneratePurchaseAgreement,
            variables: {
              investmentAmount: this.investmentAmount.toString(),
              offeringId: campaignStore.getOfferingId || portfolioStore.currentOfferingId,
              accountId: this.getSelectedAccountTypeId,
              transferAmount: this.isGetTransferRequestCall ? this.getTransferRequestAmount.toString() : '0',
              // creditToSpend: this.getSpendCreditValue,
              callbackUrl: `${window.location.origin}/secure-gateway`,
            },
          })
          .then(action((resp) => {
            const { status, message, flag } = resp.data.investNowGeneratePurchaseAgreement;
            this.setFieldValue('isValidInvestAmtInOffering', status);
            this.setFieldValue('disableNextbtn', status);
            if (flag !== 1) {
              this.INVESTMONEY_FORM.fields.investmentAmount.error = !status ? message : undefined;
              this.INVESTMONEY_FORM.meta.isValid = status;
            }
            // Validated investment amount fields:
            if (flag === 1) {
              this.isGetTransferRequestCall = true;
            } else {
              const errorMessage = !status ? message : null;
              this.setFieldValue('investmentFlowErrorMessage', errorMessage);
            }

            if (includes(['PREFERRED_EQUITY_506C'], offeringSecurityType)) {
              const errorMessage = !status ? message : null;
              this.setFieldValue('investmentFlowEquityErrorMessage', errorMessage);
            }

            if (!resp.data.investNowGeneratePurchaseAgreement) {
              this.setShowTransferRequestErr(true);
            }
            this.setFieldValue('agreementDetails', resp.data.investNowGeneratePurchaseAgreement);
            resolve({ isValid: status, flag });
          }))
          .catch((error) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            this.setShowTransferRequestErr(true);
            uiStore.setErrors(error.message);
            reject();
          })
          .finally(() => {
            uiStore.setProgress(false);
          });
      }
    } else {
      resolve();
    }
  });

  checkLockinPeriod = () => {
    let resultToReturn = false;
    const offeringDetails = portfolioStore.getInvestorAccountById;
    if (offeringDetails) {
      const isLokcinPeriod = (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(offeringDetails, 'offering.closureSummary.processingDate') || null, true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(offeringDetails, 'offering.closureSummary.processingDate') || null, true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(offeringDetails, 'offering.closureSummary.processingDate') || null, true, true).isLokinPeriod;
      // const isLokcinPeriod = DataFormatter.getDateDifferenceInHoursOrMinutes(offeringDetails && offeringDetails.offering
      //   && offeringDetails.offering.closureSummary
      //   && offeringDetails.offering.closureSummary.processingDate
      //   ? offeringDetails.offering.closureSummary.processingDate : null, true, true).value < 48;
      if (isLokcinPeriod) {
        const alreadyInvestedAmount = offeringDetails.investedAmount;
        resultToReturn = money.cmp(this.investmentAmount, alreadyInvestedAmount) < 0;
      }
    }
    return resultToReturn;
  }

  @action
  investNowSubmit = () => {
    const offeringIdToUpdate = campaignStore.getOfferingId
      ? campaignStore.getOfferingId : portfolioStore.currentOfferingId;
    if (this.agreementDetails && offeringIdToUpdate) {
      const variables = {
        accountId: this.getSelectedAccountTypeId,
        offeringId: offeringIdToUpdate,
        investmentAmount: this.investmentAmount.toString(),
        agreementId: this.agreementDetails.agreementId,
        transferAmount: this.isGetTransferRequestCall ? this.getTransferRequestAmount.toString() : '0',
      };
      uiStore.setProgress();
      return new Promise((resolve) => {
        client
          .mutate({
            mutation: investNowSubmit,
            variables,
            refetchQueries: [{
              query: getInvestorAccountPortfolio,
              variables: {
                accountId: this.getSelectedAccountTypeId,
              },
            }],
          })
          .then((data) => {
            const { status, message, flag } = data.data.investNowSubmit;
            if (flag === 1) {
              this.isGetTransferRequestCall = true;
            } else {
              const errorMessage = !status ? message : null;
              this.setFieldValue('investmentFlowErrorMessage', errorMessage);
            }
            resolve(status);
            campaignStore.getCampaignDetails(campaignStore.getOfferingSlug, false, true);
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

  @computed get validBonusRewards() {
    const { campaign } = campaignStore;
    let bonusRewards = [];
    let matchedTierAmount = 0;
    if (campaign && campaign.bonusRewards && campaign.bonusRewards.length) {
      campaign.bonusRewards.map((reward) => {
        // const tiersArray = orderBy(reward.tiers, ['amount'], ['asc']);
        const tiersArray = orderBy(reward.tiers);
        tiersArray.map((tier) => {
          if (this.investmentAmount >= tier
            && (matchedTierAmount === 0 || tier === matchedTierAmount)) {
            matchedTierAmount = tier;
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

  investmentBonusRewards = (investedAmount) => {
    const { campaign } = campaignStore;
    const offeringInvestedAmount = typeof investedAmount === 'string' ? parseFloat(investedAmount || '0.00') : (investedAmount || 0);
    let rewardsTiers = [];
    if (campaign && campaign.bonusRewards) {
      campaign.bonusRewards.map((reward) => {
        rewardsTiers = reward.tiers.concat(rewardsTiers);
        return false;
      });
    }
    rewardsTiers = [...new Set(toJS(rewardsTiers))].sort((a, b) => b - a);
    const matchTier = rewardsTiers ? rewardsTiers.find(t => offeringInvestedAmount >= t) : 0;
    let bonusRewards = [];
    bonusRewards = campaign && campaign.bonusRewards && campaign.bonusRewards
      .filter(reward => reward.tiers.includes(matchTier));
    return bonusRewards;
  }

  @action
  updateInvestmentLimits = offeringId => new Promise((resolve) => {
    const data = mapValues(this.INVESTMENT_LIMITS_FORM.fields, f => parseInt(f.value, 10));
    investmentLimitStore
      .updateInvestmentLimits(
        data, this.getSelectedAccountTypeId, true, offeringId,
      )
      .then(() => resolve());
  })

  @action
  resetData = () => {
    this.overrideMultipleValidationForInvestment(true);
    Validator.resetFormData(this.INVESTMONEY_FORM);
    Validator.resetFormData(this.INVESTMENT_LIMITS_FORM);
    Validator.resetFormData(this.AGREEMENT_DETAILS_FORM);
    Validator.resetFormData(this.PREFERRED_EQUITY_INVESTMONEY_FORM, ['shares']);
    this.setByDefaultRender(true);
    this.setFieldValue('equityInvestmentAmount', '$ 0');
    this.setFieldValue('investmentFlowEquityErrorMessage', null);
    investmentLimitStore.setInvestNowErrorStatus(false);
    // accreditationStore.resetAccreditationObject();
    this.setFieldValue('isGetTransferRequestCall', false);
    this.setFieldValue('estReturnVal', '-');
  }

  @action
  resetForm = (form) => {
    Validator.resetFormData(form);
  }

  @computed get changedInvestmentLimit() {
    const data = mapValues(this.INVESTMENT_LIMITS_FORM.fields, f => parseInt(f.value, 10));
    return investmentLimitStore
      .getInvestmentLimit(data, investmentLimitStore.investorTotalAmountInvested);
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

  @action
  validateMaskedInputForAmount = () => {
    if (this.investmentAmount > 0 && !money.isZero(this.investmentAmount)
      && this.isValidMultipleAmount(this.investmentAmount)) {
      this.setFieldValue('disableNextbtn', true);
    } else {
      this.setFieldValue('disableNextbtn', false);
    }
  }

  @action
  resetFormErrors = (form) => {
    this[form].fields.investmentAmount.error = undefined;
    this[form].meta.isValid = true;
    this.setFieldValue('investmentFlowErrorMessage', undefined);
  }

  isValidMultipleAmount = (amount) => {
    const formatedAmount = parseFloat(amount) || 0;
    return formatedAmount >= 100 && formatedAmount % 100 === 0;
  }

  @action
  investMoneyChangeForEquity = (values, field) => {
    this.PREFERRED_EQUITY_INVESTMONEY_FORM = Validator.onChange(this.PREFERRED_EQUITY_INVESTMONEY_FORM, {
      name: field,
      value: values.floatValue,
    });
    this.calculatedInvestmentAmountForPreferredEquity();
  }

  @action
  calculatedInvestmentAmountForPreferredEquity = () => {
    const { campaign } = campaignStore;
    this.setFieldValue('investmentFlowEquityErrorMessage', null);
    const pricePerShare = money.floatToAmount(this.PREFERRED_EQUITY_INVESTMONEY_FORM.fields.shares.value || 0);
    const priceCalculation = get(campaign, 'closureSummary.keyTerms.priceCalculation') || '0';
    const sharePrice = money.floatToAmount(priceCalculation || 0);
    const resultAmount = money.mul(sharePrice, pricePerShare);
    const investedAmount = money.isZero(resultAmount) ? '0' : resultAmount;
    this.investMoneyChange({ floatValue: investedAmount }, 'investmentAmount', true);
    const formatedInvestedAmount = Helper.CurrencyFormat(investedAmount);
    this.setFieldValue('equityInvestmentAmount', formatedInvestedAmount);
    if (this.investmentAmount > 0 && !money.isZero(this.investmentAmount)) {
      this.setFieldValue('disableNextbtn', true);
    } else {
      this.setFieldValue('disableNextbtn', false);
    }
  }

  @action
  overrideMultipleValidationForInvestment = (isReset = false) => {
    if (!isReset) {
      this.INVESTMONEY_FORM.fields.investmentAmount.rule = 'required';
    } else {
      this.INVESTMONEY_FORM.fields.investmentAmount.rule = 'required|hundreds';
    }
  }

  @action
  equityCalculateShareAmount = () => {
    const { campaign } = campaignStore;
    const prefferedEquityLabel = get(campaign, 'keyTerms.equityUnitType');
    const offeringMinInvestmentAmount = Helper.CurrencyFormat((get(campaign, 'keyTerms.minInvestAmt') || '0'), 0);
    const priceCalculation = get(campaign, 'closureSummary.keyTerms.priceCalculation') || '0';
    const offeringMinInvestment = get(campaign, 'keyTerms.minInvestAmt') || '0';
    const formatedUnitPrice = money.floatToAmount(priceCalculation || 0);
    const formatedMinInvestment = money.floatToAmount(offeringMinInvestment || 0);
    const result = Math.ceil(money.div(formatedMinInvestment, formatedUnitPrice));
    const dynamicLabel = result <= 1 ? `${prefferedEquityLabel}` : `${prefferedEquityLabel}s`;
    const returnStatement = `*Minimum investment amount: ${result} ${dynamicLabel} = ${offeringMinInvestmentAmount}`;
    return returnStatement;
  }
}

export default new InvestmentStore();
