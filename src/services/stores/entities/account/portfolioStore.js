import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { find } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio, getInvestorDetailsById } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class PortfolioStore {
  @observable investmentLists = null;
  @observable investmentDetails = null;

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
  @action
  getInvestorDetails = (accountType, offeringId) => {
    const activeAccounts = userDetailsStore.getActiveAccounts;
    const { userDetails } = userDetailsStore;
    const account = find(activeAccounts, acc => acc.name === accountType);
    this.investmentDetails = graphql({
      client,
      query: getInvestorDetailsById,
      variables: {
        userId: userDetails.id,
        accountId: account.details.accountId,
        offeringId,
      },
    });
  }
  @computed get getInvestor() {
    return (this.investmentDetails && this.investmentDetails.data &&
        this.investmentDetails.data.getInvestmentDetailsOverview &&
        toJS(this.investmentDetails.data.getInvestmentDetailsOverview)) || null;
  }
  @computed get loadingInvestDetails() {
    return this.investmentDetails.loading;
  }
}

export default new PortfolioStore();
