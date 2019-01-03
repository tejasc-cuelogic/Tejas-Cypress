import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { forEach } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getInvestorAccountPortfolio, getInvestorDetailsById, cancelAgreement, getUserAccountSummary, getMonthlyPaymentsToInvestorByOffering } from '../../queries/portfolio';
import { userDetailsStore, userStore, uiStore, offeringCreationStore } from '../../index';
import Helper from '../../../../helper/utility';

export class PortfolioStore {
  @observable investmentLists = null;
  @observable pieChartDataEval = null;
  @observable pieChartData = null;
  @observable accSummary = null;
  @observable currentOfferingId = null;
  @observable isCancelShowLink = false;
  @observable investmentDetails = null;
  @observable canceledInvestmentDetails = null;
  @observable PayOffData = null;
  @observable currentAcccountType = null;

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  resetPiechartValues = () => {
    this.pieChartDataEval = {
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
    };
    this.pieChartData = {
      investmentType: [],
      industry: [],
    };
  }

  @action
  getSummary = () => {
    this.accSummary = graphql({
      client,
      query: getUserAccountSummary,
      variables: { userId: userStore.currentUser.sub },
    });
  }

  @action
  getPayOffData = (accountType) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const account = userDetailsStore.currentActiveAccountDetails;
    this.PayOffData = graphql({
      client,
      query: getMonthlyPaymentsToInvestorByOffering,
      variables: {
        userId: userStore.currentUser.sub,
        accountId: account.details.accountId,
        offeringId: offeringCreationStore.currentOfferingId,
      },
    });
  }
  @action
  calculateInvestmentType() {
    this.resetPiechartValues();
    const investmentData = this.getInvestorAccounts;
    if (investmentData) {
      ['pending', 'active', 'completed'].forEach((field) => {
        investmentData.investments[field].forEach((ele) => {
          if (ele.offering.keyTerms.securities && ele.offering.keyTerms.industry) {
            this.pieChartDataEval.investmentType[ele.offering.keyTerms.securities].value += 1;
            this.pieChartDataEval.industry[ele.offering.keyTerms.industry].value += 1;
          }
        });
      });
    }
    ['investmentType', 'industry'].forEach((field) => {
      forEach(this.pieChartDataEval[field], (data) => {
        if (data.value) {
          this.pieChartData[field].push(data);
        }
      });
    });
  }

  @computed get summary() {
    return (this.accSummary.data && toJS(this.accSummary.data.getUserAccountSummary)) || {};
  }

  getChartData = (type) => {
    const formattedData = [];
    const rawData = type === 'cashMovement' ? this.summary.cashMovement : (this.PayOffData.data && this.PayOffData.data.getMonthlyPaymentsToInvestorByOffering) || [];
    if (rawData) {
      rawData.map((k) => {
        formattedData.push({
          name: moment(k.yearMonth).format('MMM YYYY'), Payment: k.payment, 'Paid to date': k.paidToDate,
        });
        return null;
      });
    }
    return formattedData;
  }

  @computed get summaryLoading() {
    return this.accSummary.loading;
  }

  @computed get getPieChartData() {
    return (this.pieChartData && toJS(this.pieChartData)) || null;
  }

  @action
  getInvestorAccountPortfolio = (accountType) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    this.investmentLists = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: {
        userId: userDetails.id,
        accountId: (account && account.details) ? account.details.accountId : null,
      },
      // fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          this.calculateInvestmentType();
        }
      },
    });
  }

  @computed get getInvestorAccounts() {
    return (this.investmentLists && this.investmentLists.data &&
      this.investmentLists.data.getInvestorAccountPortfolio &&
      toJS(this.investmentLists.data.getInvestorAccountPortfolio)) || null;
  }

  @computed get getInvestorAccountById() {
    const accounts = this.getInvestorAccounts;
    let offering = null;
    if (accounts) {
      offering =
        accounts.investments.pending.find(acc => acc.offering.id === this.currentOfferingId);
    }
    return offering;
  }

  @computed get loading() {
    return this.investmentLists.loading;
  }
  @action
  getInvestorDetails = (accountType, offeringId) => new Promise((resolve) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
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
      this.investmentDetails.data.getInvestmentDetails &&
      toJS(this.investmentDetails.data.getInvestmentDetails)) || null;
  }
  @computed get loadingInvestDetails() {
    return this.investmentDetails.loading;
  }

  @action
  cancelAgreement = (agreementId) => {
    uiStore.setProgress(true);
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: cancelAgreement,
          variables: {
            agreementId,
          },
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: {
              userId: userDetails.id,
              accountId: account.details.accountId,
            },
          }],
        })
        .then(() => {
          this.setInitialLinkValue(true);
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          this.setInitialLinkValue(false);
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  @action
  setInitialLinkValue = (boolValue) => {
    this.isCancelShowLink = boolValue;
  }
  @action
  setInvestmentDetailsForCancelRequest = (detailObject) => {
    this.canceledInvestmentDetails = detailObject;
  }
  @action
  currentAccoutType = (type) => {
    this.currentAcccountType = type;
  }
}

export default new PortfolioStore();
