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

  @computed get getActiveAccountList() {
    let isIndividualAccount = false;
    const accList = filter(this.activeAccounts, (account) => {
      isIndividualAccount = account.accountType === 'individual' ? true : isIndividualAccount;
      return account.accountType === 'individual' ? !find(this.activeAccounts, acc => acc.accountType === 'ira') : true;
    });
    return toJS({ accountList: accList, isIndAccExist: isIndividualAccount });
  }

  //  Reference: https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_crowdfundingincrease
  getInvestmentLimit = (data) => {
    let limit = 0;
    const maxLimit = 107000;
    const annualIncomeOrNetWorth = data.annualIncome > data.netWorth ?
      data.netWorth : data.annualIncome;
    if (data.annualIncome >= 30000 && data.netWorth >= 80000) {
      if ((data.annualIncome >= maxLimit) && (data.netWorth >= maxLimit)) {
        const calculatedLimit = (annualIncomeOrNetWorth * 10) / 100;
        limit = (maxLimit > calculatedLimit) ? calculatedLimit : maxLimit;
      } else if ((data.annualIncome < maxLimit) || (data.netWorth < maxLimit)) {
        const calculatedLimit = (annualIncomeOrNetWorth * 5) / 100;
        limit = (calculatedLimit < 2200) ? 2200 : calculatedLimit;
      }
    }
    return limit;
  }

  @action
  investmentCalculate = () => {
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.currentLimit = this.getInvestmentLimit(data);
    const limitField = (this.currentAccountType === 'entity') ? 'currentLimitEntity' : 'currentLimitIndividualOrIra';
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
    const limitField = (accountType === 'entity') ? 'currentLimitEntity' : 'currentLimitIndividualOrIra';
    const fieldVal = {};
    fieldVal.otherInvestments = 0;
    fieldVal.annualIncome = (accountType === 'entity') ? accountData.accountDetails.cfInvestment.amount : accountData.accountDetails.annualIncome;
    fieldVal.netWorth = (accountType === 'entity') ? accountData.accountDetails.netAssets : accountData.accountDetails.netWorth;
    ['annualIncome', 'netWorth', 'otherInvestments'].forEach((field) => {
      this.INVESTEMENT_LIMIT_META = Validator.onChange(
        this.INVESTEMENT_LIMIT_META,
        { name: field, value: fieldVal[field] ? fieldVal[field] : 0 },
      );
    });
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
