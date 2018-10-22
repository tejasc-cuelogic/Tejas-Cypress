import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio, getInvestorDetailsById } from '../../queries/portfolio';
import { userDetailsStore } from '../../index';

export class PortfolioStore {
  @observable investmentList = null;
  @observable filters = false;
  @observable investmentDetails = null;

  @action
  getInvestorAccountPortfolio = (accountType) => {
    const accountStatus = userDetailsStore.signupStatus;
    console.log(accountType, accountStatus);
    this.investmentList = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: {},
    });
  }
  @computed get getInvestorAccountPortfolio() {
    return (this.investmentList && this.investmentList.data.getInvestorAccountPortfolio &&
      toJS(this.investmentList.data.getInvestorAccountPortfolio)) || null;
  }

  @computed get loading() {
    return this.investmentList.loading;
  }
  @action
  getInvestorDetails = (userId, accountId, offeringId) => {
    this.investmentDetails = graphql({
      client,
      query: getInvestorDetailsById,
      variables: { userId, accountId, offeringId },
    });
  }
  @computed get getInvestorDetails() {
    return (this.investmentDetails && this.investmentDetails.data.getInvestmentDetailsOverview &&
      toJS(this.investmentDetails.data.getInvestmentDetailsOverview)) || null;
  }
}

export default new PortfolioStore();
