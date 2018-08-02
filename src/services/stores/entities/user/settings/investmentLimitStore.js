import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { mapValues, filter, find } from 'lodash';
// import { GqlClient as client } from '../../../../../api/gqlApi';
import { GqlClient as client2 } from '../../../../../api/gcoolApi';
import { uiStore, userDetailsStore } from '../../../index';
import { INVESTEMENT_LIMIT } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';
import { finLimit, updateFinLimit } from '../../../queries/investementLimits';
import Helper from '../../../../../helper/utility';

export class InvestmentLimitStore {
  @observable INVESTEMENT_LIMIT_META = Validator.prepareFormObject(INVESTEMENT_LIMIT);
  @observable investmentLimit = {};
  @observable currentLimit = 0;
  @observable activeAccounts = null;

  @computed get fLoading() {
    return this.investmentLimit.loading;
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

  @action
  setInvestmentLimitInfo = (accountType) => {
    // set form values accountwise
    if (accountType === 'entity') {
      this.currentLimit = this.INVESTEMENT_LIMIT_META.fields.currentLimitEntity.value;
    } else {
      this.currentLimit = this.INVESTEMENT_LIMIT_META.fields.currentLimitIndividualOrIra.value;
    }
    console.log(accountType);
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
 getInvestmentLimit = () => {
   this.activeAccounts = userDetailsStore.getActiveAccounts;
   const activeAccountList = this.getActiveAccountList;
   console.log(activeAccountList);
   this.investmentLimit = graphql({
     client: client2,
     query: finLimit,
     onFetch: (data) => {
       Object.keys(this.INVESTEMENT_LIMIT_META.fields).map((f) => {
         this.INVESTEMENT_LIMIT_META.fields[f].value = data.FinancialLimits[f];
         return this.INVESTEMENT_LIMIT_META.fields[f];
       });
       Validator.onChange(this.INVESTEMENT_LIMIT_META);
       this.INVESTEMENT_LIMIT_META.fields.currentLimitIndividualOrIra.value = 35000;
       this.INVESTEMENT_LIMIT_META.fields.currentLimitEntity.value = 50000;
     },
   });
 }

  @action
  updateFinInfo = () => {
    const data = mapValues(this.INVESTEMENT_LIMIT_META.fields, f => parseInt(f.value, 10));
    const currentLimit = Helper.getInvestmentLimit(data);
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
      .then(() => Helper.toast('Updated Financial Info!', 'success'))
      .catch(error => Helper.toast(`Error while updating Financial Info- ${error}`, 'warn'))
      .finally(() => uiStore.setProgress(false));
  }
}
export default new InvestmentLimitStore();
