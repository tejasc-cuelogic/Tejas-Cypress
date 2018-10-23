import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { find } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio, getInvestorDetailsById } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class PortfolioStore {
  @observable investmentLists = null;
  @observable pieChartData = {
    INVESTMENT_TYPE: [
      { name: 'Term Note', value: 0, key: 'TERM_NOTE' },
      { name: 'Rev Share', value: 0, key: 'REVENUE_SHARING_NOTE' },
    ],
    INDUSTRY: [
      { name: 'Fashion and Merchandising', value: 0, key: 'FASHION_AND_MERCHANDISING' },
      { name: 'Beauty and Spa', value: 0, key: 'BEAUTY_AND_SPA' },
      { name: 'Food & Breverage', value: 0, key: 'FOOD_AND_BEVERAGE' },
      { name: 'Real Estate', value: 0, key: 'REAL_ESTATE' },
      { name: 'Fitness and Wellness', value: 0, key: 'FITNESS_AND_WELLNESS' },
      { name: 'Hospitality', value: 0, key: 'HOSPITALITY' },
      { name: 'Technology', value: 0, key: 'TECHNOLOGY' },
      { name: 'Restaurant and Bar', value: 0, key: 'RESTAURANT_AND_BAR' },
      { name: 'Brewery and Brewpub', value: 0, key: 'BREWERY_AND_BREWPUB' },
      { name: 'Health and Wellness', value: 0, key: 'HEALTH_AND_WELLNESS' },
      { name: 'Fitness', value: 0, key: 'FITNESS' },
      { name: 'Fashion and Apparel', value: 0, key: 'FASHION_AND_APPAREL' },
      { name: 'Commercial Real Estate', value: 0, key: 'COMMERCIAL_REAL_ESTATE' },
      { name: 'Other', value: 0, key: 'OTHER' },
    ],
  }
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
  getInvestorDetails = (accountType, offeringId) => new Promise((resolve) => {
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
      onFetch: () => {
        resolve();
      },
      fetchPolicy: 'network-only',
    });
  });
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
