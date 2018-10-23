import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { find } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class PortfolioStore {
  @observable investmentLists = null;
  @observable pieChartDataEval = {
    investmentType: {
      TERM_NOTE: { name: 'Term Note', value: 0 },
      REVENUE_SHARING_NOTE: { name: 'Rev Share', value: 0 },
    },
    industry: {
      FASHION_AND_MERCHANDISING: { name: 'Fashion and Merchandising', value: 0 },
      BEAUTY_AND_SPA: { name: 'Beauty and Spa', value: 0 },
      FOOD_AND_BEVERAGE: { name: 'Food & Breverage', value: 0 },
      REAL_ESTATE: { name: 'Real Estate', value: 0 },
      FITNESS_AND_WELLNESS: { name: 'Fitness and Wellness', value: 0 },
      HOSPITALITY: { name: 'Hospitality', value: 0 },
      TECHNOLOGY: { name: 'Technology', value: 0 },
      RESTAURANT_AND_BAR: { name: 'Restaurant and Bar', value: 0 },
      BREWERY_AND_BREWPUB: { name: 'Brewery and Brewpub', value: 0 },
      HEALTH_AND_WELLNESS: { name: 'Health and Wellness', value: 0 },
      FITNESS: { name: 'Fitness', value: 0 },
      FASHION_AND_APPAREL: { name: 'Fashion and Apparel', value: 0 },
      COMMERCIAL_REAL_ESTATE: { name: 'Commercial Real Estate', value: 0 },
      OTHER: { name: 'Other', value: 0 },
    },
  }
  @observable pieChartData = {
    investmentType: [],
    industry: [],
  };

  @computed get calculateInvestmentType() {
    const investmentData = this.getInvestorAccounts;
    if (investmentData) {
      ['pending', 'active', 'completed'].forEach((field) => {
        investmentData.investments[field].forEach((ele) => {
          this.pieChartDataEval.investmentType[ele.offering.keyTerms.securities].value +=
          ele.investedAmount;
          this.pieChartDataEval.industry[ele.offering.keyTerms.industry].value +=
          ele.investedAmount;
        });
      });
      ['investmentType', 'industry'].forEach((field) => {
        toJS(this.pieChartDataEval[field]).forEach((data) => {
          this.pieChartData[field].push(data);
        });
      });
    }
    return this.pieChartData;
  }

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
