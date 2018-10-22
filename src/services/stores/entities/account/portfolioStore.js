import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class TransactionStore {
  @observable investmentList = null;
  @observable filters = false;

  @action
  getInvestorAccountPortfolio = (accountType) => {
    const accountStatus = userDetailsStore.signupStatus;
    console.log(accountType, accountStatus);
    this.investmentList = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: { },
    });
  }

  @computed get getInvestorAccountPortfolio() {
    return (this.investmentList && this.investmentList.data.getInvestorAccountPortfolio &&
        toJS(this.investmentList.data.getInvestorAccountPortfolio)) || null;
  }

  @computed get loading() {
    return this.investmentList.loading;
  }
}

export default new TransactionStore();
