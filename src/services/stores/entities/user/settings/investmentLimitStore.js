import { observable, action, computed, toJS } from 'mobx';
import { mapValues, filter, find, get, isEqual } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore, userDetailsStore, campaignStore, investmentStore } from '../../../index';
import { INVESTMENT_LIMIT } from '../../../../constants/investmentLimit';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { updateInvestmentLimits, getInvestorInvestmentLimit, getInvestNowHealthCheck, getInvestorTotalAmountInvested } from '../../../queries/investmentLimits';
import Helper from '../../../../../helper/utility';
import { userDetailsQuery } from '../../../queries/users';

export class InvestmentLimitStore {
  @observable INVESTMENT_LIMIT_META = Validator.prepareFormObject(INVESTMENT_LIMIT);

  @observable investmentLimit = {};

  @observable currentLimit = 0;

  @observable investorInvestmentLimit = {};

  @observable activeAccounts = null;

  @observable currentAccountType = null;

  @observable currentAccountId = null;

  @observable entityCurrentLimit = 0;

  @observable individualIRACurrentLimit = 0;

  @observable investedAmount = 0;

  @observable investNowHealthCheckDetails = {};

  @observable investNowError = false;

  @observable investorTotalAmountInvested = 0;

  @observable calculatedCFLimitDetails = {};

  @observable isLimitAmountInputChange = false;

  @observable isUpdateLimitActionActive = false;

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  setInvestNowErrorStatus = (status) => {
    this.investNowError = status;
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
  getInvestorInvestmentLimit = (accountId, isLoaderConsider = true) => new Promise((resolve) => {
    this.investorInvestmentLimit = graphql({
      client,
      query: getInvestorInvestmentLimit,
      variables: {
        accountId,
      },
      onFetch: (data) => {
        if (data && !isLoaderConsider) {
          resolve(data);
        } else if (data && !this.investorInvestmentLimit.loading) {
          resolve(data);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  getInvestNowHealthCheck = (accountId, offeringId) => new Promise((resolve, reject) => {
    uiStore.setProgress();
    this.investNowHealthCheckDetails = graphql({
      client,
      query: getInvestNowHealthCheck,
      variables: {
        accountId,
        offeringId,
      },
      onFetch: (data) => {
        if (data && this.investNowHealthCheckDetails && !this.investNowHealthCheckDetails.loading) {
          uiStore.setProgress(false);
          resolve(data);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        uiStore.setProgress(false);
        this.setInvestNowErrorStatus(true);
        reject();
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get getInvestorAmountInvestedValue() {
    return (this.investorInvestmentLimit && this.investorInvestmentLimit.data
      && this.investorInvestmentLimit.data.getInvestorTotalAmountInvested) || 0;
  }

  @computed get getInvestorAmountInvestedLoading() {
    return this.investorInvestmentLimit.loading;
  }

  @computed get getCurrentInForAccount() {
    return (this.investorInvestmentLimit && this.investorInvestmentLimit.data
      && this.investorInvestmentLimit.data.getInvestorInvestmentLimit) || 0;
  }

  @computed get getCurrentInvestNowHealthCheck() {
    return (this.investNowHealthCheckDetails && this.investNowHealthCheckDetails.data
      && this.investNowHealthCheckDetails.data.investNowHealthCheck) || null;
  }

  //  Reference: https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_crowdfundingincrease
  getInvestmentLimit = (data, investedAmount = false) => {
    const investedAmtFloat = parseFloat(investedAmount ? investedAmount.replace(/,/g, '') : this.investedAmount);
    const limitFloor = 2200;
    const maxLimit = 107000;
    const limitLowPCT = 0.05;
    let limit = Math.floor(0.10 * Math.min(data.annualIncome || 0, data.netWorth || 0));
    // const annualIncomeOrNetWorth = data.annualIncome > data.netWorth ?
    // data.netWorth : data.annualIncome;
    // if (data.annualIncome >= 30000 && data.netWorth >= 80000) {
    //   if ((data.annualIncome >= maxLimit) && (data.netWorth >= maxLimit)) {
    //     const calculatedLimit = (annualIncomeOrNetWorth * 10) / 100;
    //     limit = (maxLimit > calculatedLimit) ? calculatedLimit : maxLimit;
    //   } else
    if (((data.annualIncome || 0) < maxLimit) || ((data.netWorth || 0) < maxLimit)) {
      // const calculatedLimit = (annualIncomeOrNetWorth * 5) / 100;
      // limit = (calculatedLimit < 2200) ? 2200 : calculatedLimit;
      limit = Math
        .max(limitFloor, Math.floor(limitLowPCT
          * Math.min((data.annualIncome || 0), data.netWorth || 0)));
    }
    // }
    limit = Math.min(limit, maxLimit);
    const remainingAmount = limit
      - ((data.cfInvestments || 0) + investedAmtFloat);
    let remaining = Math.max(0, remainingAmount);
    if ((investedAmtFloat + data.cfInvestments || 0) >= maxLimit) {
      remaining = 0;
    }
    // remaining -= remaining % 100;
    return remaining;
  }

  @action
  investmentCalculate = () => {
    const data = mapValues(this.INVESTMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.currentLimit = this.getInvestmentLimit(data);
    const limitField = (this.currentAccountType === 'entity') ? 'currentLimitEntity' : 'currentLimitIndividualOrIra';
    this.INVESTMENT_LIMIT_META = Validator.onChange(
      this.INVESTMENT_LIMIT_META,
      { name: limitField, value: this.currentLimit },
    );
  }

  @action
  calculateCfLimit = (form = null) => new Promise((resolve, reject) => {
    uiStore.setProgress();
    const { INVESTMENT_LIMITS_FORM, getSelectedAccountTypeId } = investmentStore;
    const investmentLimitForm = form ? this[form] : INVESTMENT_LIMITS_FORM;
    const formData = mapValues(investmentLimitForm.fields, f => parseInt(f.value, 10));
    const accountId = this.currentAccountId || getSelectedAccountTypeId;
    const { limits } = userDetailsStore.userDetails;
    const investments = {
      netWorth: limits.netWorth,
      annualIncome: limits.income,
      cfInvestments: limits.otherContributions,
    };
    const formDataInvestments = {
      netWorth: formData.netWorth,
      annualIncome: formData.annualIncome,
      cfInvestments: formData.cfInvestments,
    };
    const isValuesEqual = isEqual(investments, formDataInvestments);
    if ((formData.annualIncome || formData.annualIncome === 0) && (formData.netWorth || formData.netWorth === 0) && (formData.cfInvestments || formData.cfInvestments === 0) && !isValuesEqual && this.isLimitAmountInputChange) {
      const variables = { accountId, limits: { income: formData.annualIncome, netWorth: formData.netWorth, otherContributions: formData.cfInvestments } };
      this.calculatedCFLimitDetails = graphql({
        client,
        query: getInvestorInvestmentLimit,
        variables,
        onFetch: (data) => {
          if (get(data, 'getInvestorInvestmentLimit') && !this.calculatedCFLimitDetails.loading) {
            uiStore.setProgress(false);
            this.setFieldValue('currentLimit', data.getInvestorInvestmentLimit);
            this.setFieldValue('isLimitAmountInputChange', false);
            this.setFieldValue('isUpdateLimitActionActive', true);
            resolve();
          }
        },
        onError: () => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setProgress(false);
          this.setFieldValue('isLimitAmountInputChange', false);
          reject();
        },
        fetchPolicy: 'network-only',
      });
    } else {
      uiStore.setProgress(false);
      if (isValuesEqual) {
        const helthCheckLimit = get(this.getCurrentInvestNowHealthCheck, 'investmentLimit') || 0;
        const currentInvestLimit = form ? this.currentAccountType === 'entity' ? this.entityCurrentLimit : this.individualIRACurrentLimit : helthCheckLimit;
        this.setFieldValue('currentLimit', currentInvestLimit);
      }
      this.setFieldValue('isLimitAmountInputChange', false);
      resolve();
    }
  });

  // @action
  // setAccountsLimits = () => {
  //   const { accountList } = this.getActiveAccountList;
  //   accountList.forEach((account) => {
  //     this.getInvestorInvestmentLimit(account.details.accountId).then((data) => {
  //       if (data.getInvestorInvestmentLimit === '0.00') {
  //         this.setInvestmentLimitInfo(account.name, account.details.accountId);
  //       } else {
  //         this.setFieldValue('currentLimit', data.getInvestorInvestmentLimit);
  //       }
  //       if (account.name === 'entity') {
  //         this.setFieldValue('entityCurrentLimit', this.currentLimit);
  //       } else {
  //         this.setFieldValue('individualIRACurrentLimit', this.currentLimit);
  //       }
  //     });
  //   });
  // }

  @action
  setAccountsLimits = () => {
    const { accountList } = this.getActiveAccountList;
    const isLoaderConsider = !(accountList.length > 1);
    accountList.forEach((account) => {
      this.getInvestorInvestmentLimit(account.details.accountId, isLoaderConsider).then((data) => {
        if (data.getInvestorInvestmentLimit === '0.00') {
          this.setInvestmentLimitInfo(account.name, account.details.accountId);
        }
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
      this.INVESTMENT_LIMIT_META = Validator.onChange(
        this.INVESTMENT_LIMIT_META,
        { name: field, value: fieldVal[field] ? fieldVal[field] : 0 },
      );
    });
    // const data = mapValues(this.INVESTMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    // this.currentLimit = this.getInvestmentLimit(data);
    this.currentLimit = (accountType === 'entity') ? this.entityCurrentLimit : this.individualIRACurrentLimit;
    this.INVESTMENT_LIMIT_META = Validator.onChange(
      this.INVESTMENT_LIMIT_META,
      { name: limitField, value: this.currentLimit },
    );
  }

  @action
  maskingFieldChange = (values, field) => {
    this.INVESTMENT_LIMIT_META = Validator.onChange(
      this.INVESTMENT_LIMIT_META,
      { name: field, value: values.floatValue },
    );
    this.setFieldValue('isLimitAmountInputChange', true);
    this.setFieldValue('isUpdateLimitActionActive', false);
  };

  /*
  Financial Limits
  */
  @action
  initiateInvestmentLimit = () => {
    this.activeAccounts = userDetailsStore.getActiveAccounts;
    // const activeAccountList = this.getActiveAccountList;
    // map(activeAccountList.accountList, (account) => {
    //   this.setInvestmentLimitInfo(account.name);
    // });
  }

  @action
  initiateInvestmentLimitOfSelectedUser = () => {
    this.activeAccounts = userDetailsStore.getActiveAccountsOfSelectedUsers;
    // const activeAccountList = this.getActiveAccountList;
    // map(activeAccountList.accountList, (account) => {
    //   this.setInvestmentLimitInfo(account.name);
    // });
  }

  @action
  updateInvestmentLimit = () => new Promise((resolve) => {
    const data = mapValues(this.INVESTMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    this.updateInvestmentLimits(data, this.currentAccountId).then(() => resolve());
  })

  @action
  updateInvestmentLimits = (
    data, accountId, resetProgress = true, offeringId = undefined,
  ) => {
    console.log(resetProgress);
    uiStore.setProgress();
    const { campaign } = campaignStore;
    const offeringDetailId = offeringId || campaign.id;
    return new Promise((resolve) => {
      client
        .mutate({
          mutation: updateInvestmentLimits,
          variables: {
            accountId,
            annualIncome: data.annualIncome,
            netWorth: data.netWorth,
            otherRegCfInvestments: data.cfInvestments,
          },
          refetchQueries: [{
              query: userDetailsQuery,
            }],
        })
        .then(() => {
          if (offeringDetailId) {
            this.getInvestNowHealthCheck(accountId, offeringDetailId)
              .then(() => {
                uiStore.setProgress(false);
                resolve();
              }).catch((err) => {
                console.log('Error :: getInvestNowHealthCheck', err);
                uiStore.setProgress(false);
                resolve();
              });
          } else {
            uiStore.setProgress(false);
            resolve();
          }
        })
        .catch((error) => {
          uiStore.setProgress(false);
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        });
        /* .finally(() => {
          if (resetProgress) {
            uiStore.setProgress(false);
          }
        }); */
    });
  }

  @action
  getInvestedAmount = () => {
    const { accountList, isIndAccExist } = this.getActiveAccountList;
    const closeDateinCST = DataFormatter.getCurrentCSTMoment().subtract(1, 'y');
    const closeDateinCSTFilter = moment(closeDateinCST).format('YYYY-MM-DD HH:mm:ss');
    accountList.forEach((account) => {
      if (account.name === this.currentAccountType) {
        this.getInvestorTotalAmountInvested(
          account.details.accountId,
          closeDateinCSTFilter,
        ).then((data) => {
          this.setFieldValue('investedAmount', parseFloat(data.getInvestorTotalAmountInvested.replace(/,/g, '') || 0));
        });
      }
    });
    // test
    if (isIndAccExist && this.currentAccountType === 'ira') {
      const individualAccount = find(this.activeAccounts, acc => acc.name === 'individual');
      this.getInvestorTotalAmountInvested(
        individualAccount.details.accountId,
        closeDateinCSTFilter,
      ).then((data) => {
        const investedAmount = parseFloat(data.getInvestorTotalAmountInvested.replace(/,/g, '') || 0)
          + this.investedAmount;
        this.setFieldValue('investedAmount', investedAmount);
      });
    }
  }

  @action
  getInvestorTotalAmountInvested =
    (accountId, closeDateFilter = moment().subtract(1, 'y').toISOString()) => new Promise((resolve) => {
      this.investorInvestmentLimit = graphql({
        client,
        query: getInvestorTotalAmountInvested,
        variables: {
          accountId,
          closeDateFilter,
          includeTx: false,
        },
        fetchPolicy: 'network-only',
        onFetch: (data) => {
          if (data && data.getInvestorTotalAmountInvested) {
            resolve(data);
          }
        },
      });
    });
}
export default new InvestmentLimitStore();
