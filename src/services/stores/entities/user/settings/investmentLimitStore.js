import { observable, action, computed, toJS } from 'mobx';
import { mapValues, filter, find, map } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import money from 'money-math';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore, userDetailsStore, campaignStore } from '../../../index';
import { INVESTEMENT_LIMIT } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';
import { updateInvestmentLimits, getInvestorInvestmentLimit, getInvestNowHealthCheck, getInvestorAmountInvested } from '../../../queries/investementLimits';
import Helper from '../../../../../helper/utility';
import { userDetailsQuery } from '../../../queries/users';

export class InvestmentLimitStore {
  @observable INVESTEMENT_LIMIT_META = Validator.prepareFormObject(INVESTEMENT_LIMIT);
  @observable investmentLimit = {};
  @observable currentLimit = 0;
  @observable investorInvestmentLimit = null;
  @observable activeAccounts = null;
  @observable currentAccountType = null;
  @observable currentAccountId = null;
  @observable entityCurrentLimit = 0;
  @observable individualIRACurrentLimit = 0;
  @observable investedAmount = 0;
  @observable investNowHealthCheckDetails = null;

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @computed get getActiveAccountList() {
    let isIndividualAccount = false;
    const accList = filter(this.activeAccounts, (account) => {
      isIndividualAccount = account.name === 'individual' ? true : isIndividualAccount;
      return account.name === 'individual' ? !find(this.activeAccounts, acc => acc.name === 'ira') : true;
    });
    return toJS({ accountList: accList, isIndAccExist: isIndividualAccount });
  }

  @action
  getInvestorInvestmentLimit = accountId => new Promise((resolve) => {
    this.investorInvestmentLimit = graphql({
      client,
      query: getInvestorInvestmentLimit,
      variables: {
        userId: userDetailsStore.currentUserId,
        accountId,
      },
      onFetch: (data) => {
        if (data && !this.investorInvestmentLimit.loading) {
          resolve(data);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  getInvestNowHealthCheck = (accountId, offeringId) => new Promise((resolve) => {
    this.investNowHealthCheckDetails = graphql({
      client,
      query: getInvestNowHealthCheck,
      variables: {
        userId: userDetailsStore.currentUserId,
        accountId,
        offeringId,
      },
      onFetch: (data) => {
        if (data && !this.investNowHealthCheckDetails.loading) {
          resolve(data);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get getCurrentLimitForAccount() {
    return (this.investorInvestmentLimit && this.investorInvestmentLimit.data &&
      this.investorInvestmentLimit.data.getInvestorInvestmentLimit) || 0;
  }

  @computed get getCurrentInvestNowHealthCheck() {
    return (this.investNowHealthCheckDetails && this.investNowHealthCheckDetails.data &&
      this.investNowHealthCheckDetails.data.investNowHealthCheck) || null;
  }

  //  Reference: https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_crowdfundingincrease
  getInvestmentLimit = (data) => {
    let limit = 2200;
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

    const remainingAmount = limit - (data.cfInvestments || 0 + parseFloat(this.investedAmount));
    let remaining = Math.max(0, remainingAmount);
    if ((this.investedAmount + data.cfInvestments) >= maxLimit) {
      remaining = 0;
    }

    remaining -= remaining % 100;
    return remaining;
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
  setAccountsLimits = () => {
    const { accountList } = this.getActiveAccountList;
    accountList.forEach((account) => {
      this.getInvestorInvestmentLimit(account.details.accountId).then((data) => {
        if (account.name === 'entity') {
          this.setFieldValue('entityCurrentLimit', data.getInvestorInvestmentLimit);
        } else {
          this.setFieldValue('individualIRACurrentLimit', data.getInvestorInvestmentLimit);
        }
      });
    });
  }

  @action
  setInvestmentLimitInfo = (accountType, accountId = null) => {
    // set form values accountwise
    const { userDetails } = userDetailsStore;
    this.currentAccountType = accountType;
    this.currentAccountId = accountId;
    const { accountList } = this.getActiveAccountList;
    const accountData = find(accountList, account => account.name === accountType);
    const limitField = (accountType === 'entity') ? 'currentLimitEntity' : 'currentLimitIndividualOrIra';
    const fieldVal = {};
    fieldVal.cfInvestments = (accountType === 'entity') ? accountData.details.limits.otherContributions : (userDetails && userDetails.limits && userDetails.limits.otherContributions) || 0;
    fieldVal.annualIncome = (accountType === 'entity') ? accountData.details.limits.income : (userDetails && userDetails.limits && userDetails.limits.income) || 0;
    fieldVal.netWorth = (accountType === 'entity') ? accountData.details.limits.netWorth : (userDetails && userDetails.limits && userDetails.limits.netWorth) || 0;
    ['annualIncome', 'netWorth', 'cfInvestments'].forEach((field) => {
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
      this.setInvestmentLimitInfo(account.name);
    });
  }

  @action
  updateInvestmentLimit = () => new Promise((resolve) => {
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.updateInvestmentLimits(data, this.currentAccountId).then(() => resolve());
  })

  @action
  updateInvestmentLimits = (data, accountId, userId = null, resetProgress = true) => {
    uiStore.setProgress();
    const { campaign } = campaignStore;
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: updateInvestmentLimits,
          variables: {
            userId: userId || userDetailsStore.currentUserId,
            accountId,
            annualIncome: data.annualIncome,
            netWorth: data.netWorth,
            otherRegCfInvestments: data.cfInvestments,
          },
          refetchQueries: [{
            query: getInvestNowHealthCheck,
            variables: {
              userId: userDetailsStore.currentUserId,
              accountId,
              offeringId: campaign.id,
            },
          },
          {
            query: userDetailsQuery,
            variables: {
              userId: userId || userDetailsStore.currentUserId,
            },
          }],
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        })
        .finally(() => {
          if (resetProgress) {
            uiStore.setProgress(false);
          }
        });
    });
  }

  @action
  getInvestedAmount = () => {
    const { accountList, isIndAccExist } = this.getActiveAccountList;
    const dateFilterStart = moment().subtract(1, 'y').toISOString();
    const dateFilterStop = moment().toISOString();

    accountList.forEach((account) => {
      if (account.name === this.currentAccountType) {
        this.getInvestorAmountInvested(
          account.details.accountId,
          dateFilterStart,
          dateFilterStop,
        ).then((data) => {
          this.setFieldValue('investedAmount', money.floatToAmount(data.getInvestorAmountInvested || 0));
        });
      }
    });
    if (isIndAccExist && this.currentAccountType === 'ira') {
      const individualAccount = find(this.activeAccounts, acc => acc.name === 'individual');
      this.getInvestorAmountInvested(
        individualAccount.details.accountId,
        dateFilterStart,
        dateFilterStop,
      ).then((data) => {
        const investedAmount = money.floatToAmount(data.getInvestorAmountInvested || 0) +
        this.investedAmount;
        this.setFieldValue('investedAmount', investedAmount);
      });
    }
  }

  getInvestorAmountInvested =
  (accountId, dateFilterStart, dateFilterStop) => new Promise((resolve) => {
    this.investorInvestmentLimit = graphql({
      client,
      query: getInvestorAmountInvested,
      variables: {
        userId: userDetailsStore.currentUserId,
        accountId,
        dateFilterStart,
        dateFilterStop,
      },
      onFetch: (data) => {
        if (data && !this.investorInvestmentLimit.loading) {
          resolve(data);
        }
      },
    });
  });
}
export default new InvestmentLimitStore();
