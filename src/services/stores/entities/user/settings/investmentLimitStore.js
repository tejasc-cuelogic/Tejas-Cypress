import { observable, action, computed, toJS } from 'mobx';
import { mapValues, filter, find, map } from 'lodash';
import { GqlClient as client2 } from '../../../../../api/gcoolApi';
import { uiStore, userDetailsStore } from '../../../index';
import { INVESTEMENT_LIMIT } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';
import { updateFinLimit } from '../../../queries/investementLimits';
import Helper from '../../../../../helper/utility';

export class InvestmentLimitStore {
  @observable INVESTEMENT_LIMIT_META = Validator.prepareFormObject(INVESTEMENT_LIMIT);
  @observable investmentLimit = {};
  @observable currentLimit = 0;
  @observable activeAccounts = null;
  @observable currentAccountType = null;

  @computed get fLoading() {
    return this.getActiveAccountList.loading;
  }

  @computed get getActiveAccountList() {
    let isIndividualAccount = false;
    const accList = filter(this.activeAccounts, (account) => {
      let status;
      if (account.accountType === 'individual') {
        isIndividualAccount = true;
        status = !find(this.activeAccounts, acc => acc.accountType === 'ira');
      } else {
        status = true;
      }
      return status;
    });
    return toJS({ accountList: accList, isIndAccExist: isIndividualAccount });
  }

  // Reference: https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_crowdfundingincrease
  getInvestmentLimit = (data) => {
    let limit = 0;
    const refAmount = 107000;
    const referThis = data.annualIncome > data.netWorth ? data.netWorth : data.annualIncome;
    if ((data.annualIncome >= refAmount) && (data.netWorth >= refAmount)) {
      const referThis2 = (referThis * 10) / 100;
      limit = (refAmount > referThis2) ? referThis2 : refAmount;
    } else if ((data.annualIncome < refAmount) || (data.netWorth < refAmount)) {
      const referThis2 = (referThis * 5) / 100;
      limit = (referThis2 < 2200) ? 2200 : referThis2;
    }
    return limit;
  }

  @action
  investmentCalculate = () => {
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.currentLimit = this.getInvestmentLimit(data);
    let limitField = 'currentLimitIndividualOrIra';
    if (this.currentAccountType === 'entity') {
      limitField = 'currentLimitEntity';
    }
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: limitField, value: this.currentLimit },
    );
  }

  @action
  setInvestmentLimitInfo = (accountType) => {
    // set form values accountwise
    this.currentAccountType = accountType;
    const { accountList } = this.getActiveAccountList;
    const accountData = find(accountList, account => account.accountType === accountType);
    let aIncome; let nWorth; let limitField;
    const otherInvestments = 0;
    if (accountType === 'entity') {
      limitField = 'currentLimitEntity';
      aIncome = accountData.accountDetails.cfInvestment.amount;
      nWorth = accountData.accountDetails.netAssets;
    } else {
      limitField = 'currentLimitIndividualOrIra';
      aIncome = accountData.accountDetails.annualIncome;
      nWorth = accountData.accountDetails.netWorth;
    }
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: 'annualIncome', value: aIncome },
    );
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: 'netWorth', value: nWorth },
    );
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: 'otherInvestments', value: otherInvestments },
    );
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.currentLimit = this.getInvestmentLimit(data);
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: limitField, value: this.currentLimit },
    );
  }

  @action
  maskingFieldChange = (values, field) => {
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: field, value: values.floatValue },
    );
  };

  /*
  Financial Limits
  */
  @action
  initiateInvestmentLimit = () => {
    this.activeAccounts = userDetailsStore.getActiveAccounts;
    const activeAccountList = this.getActiveAccountList;
    map(activeAccountList.accountList, (account) => {
      this.setInvestmentLimitInfo(account.accountType);
    });
  }

  @action
  updateInvestmentLimit = () => new Promise((resolve) => {
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    const currentLimit = parseInt(this.getInvestmentLimit(data), 10);
    uiStore.setProgress();
    client2
      .mutate({
        mutation: updateFinLimit,
        variables: {
          annualIncome: data.annualIncome,
          netWorth: data.netWorth,
          otherInvestments: data.otherInvestments,
          currentLimit,
        },
      })
      .then(() => {
        Helper.toast('Updated Financial Info!', 'success');
        resolve();
      })
      .catch(error => Helper.toast(`Error while updating Financial Info- ${error}`, 'error'))
      .finally(() => uiStore.setProgress(false));
  })
}
export default new InvestmentLimitStore();
