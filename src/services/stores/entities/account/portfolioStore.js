import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { find } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class PortfolioStore {
  @observable investmentLists = null;

  @action
  getInvestorAccountPortfolio = (accountType) => {
    const activeAccounts = userDetailsStore.getActiveAccounts;
    const { userDetails } = userDetailsStore;
    const account = find(activeAccounts, acc => acc.name === accountType);
    this.investmentLists = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: {
        userId: userDetails.id,
        accountId: account.details.accountId,
      },
      fetchPolicy: 'network-only',
    });
  }

  @computed get getInvestorAccounts() {
    return (this.investmentLists && this.investmentLists.data &&
      this.investmentLists.data.getInvestorAccountPortfolio &&
        toJS(this.investmentLists.data.getInvestorAccountPortfolio)) || null;
  }

  @computed get loading() {
    return this.investmentLists.loading;
  }
}

export default new PortfolioStore();
