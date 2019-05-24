import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { forEach, sortBy, get, times } from 'lodash';
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
  @observable isAdmin = false;
  @observable portfolioError = false;
  @observable apiCall = false;

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
        OFFICE: { name: 'Office', value: 0 },
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
  getSummary = (isAdmin = false) => {
    const { getDetailsOfUser } = userDetailsStore;
    const userId = isAdmin ? getDetailsOfUser.id : userStore.currentUser.sub;
    this.accSummary = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getUserAccountSummary,
      variables: { userId },
    });
  }

  @action
  getPayOffData = (accountType, isAdmin = false) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const accountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const investorUserDetails = userDetailsStore.getDetailsOfUser;
    const account = isAdmin ? accountDetails : userDetailsStore.currentActiveAccountDetails;
    const userDetailsId = isAdmin ? investorUserDetails.id : userStore.currentUser.sub;
    this.PayOffData = graphql({
      client,
      query: getMonthlyPaymentsToInvestorByOffering,
      variables: {
        userId: userDetailsId,
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
          if (get(ele, 'offering.keyTerms.securities') && get(ele, 'offering.keyTerms.industry')) {
            this.pieChartDataEval.investmentType[ele.offering.keyTerms.securities].value += 1;
            this.pieChartDataEval.industry[ele.offering.keyTerms.industry].value += 1;
          }
        });
      });
    }
    ['investmentType', 'industry'].forEach((field) => {
      forEach(this.pieChartDataEval[field], (data, key) => {
        if (data.value) {
          this.pieChartData[field].push({ ...data, key });
        }
      });
    });
  }

  @computed get summary() {
    const summary = get(this.accSummary, 'data.getUserAccountSummary');
    return summary ? toJS(summary) : {};
  }

  getChartData = (type) => {
    const formattedData = [];
    const newFormattedData = [];
    const rawData = type === 'cashMovement' ? this.summary.cashMovement : (this.PayOffData.data && this.PayOffData.data.getMonthlyPaymentsToInvestorByOffering) || [];
    if (rawData) {
      sortBy(rawData, ['yearMonth']).map((k) => {
        formattedData.push({
          name: moment(k.yearMonth).format('MMM YYYY'),
          payment: k.payment ? parseFloat(k.payment) : 0,
          invested: k.invested ? parseFloat(k.invested) : 0,
          paidToDate: k.paidToDate ? parseFloat(k.paidToDate) : 0,
          yearMonth: k.yearMonth,
        });
        return null;
      });
    }
    // moment(new Date("2019-01-01")).add(1,'M').format('YYYY-MM-DD');
    sortBy(formattedData, ['yearMonth']).map((k, i) => {
      newFormattedData.push({
        name: moment(k.yearMonth).format('MMM YYYY'),
        Payment: k.payment ? parseFloat(k.payment) : 0,
        Invested: k.invested ? parseFloat(k.invested) : 0,
        'Paid to date': k.paidToDate ? parseFloat(k.paidToDate) : 0,
      });

      const j = i + 1;
      if (formattedData[j]) {
        const d1 = moment(k.yearMonth).format('YYYY-MM-DD');
        const d2 = moment(formattedData[j].yearMonth).format('YYYY-MM-DD');
        const mDiff = moment(d2).diff(d1, 'months', true);
        if (mDiff > 1) {
          times(mDiff, (m) => {
            const index = m + 1;
            const nextMonth = moment(d1).add(index, 'M').format('YYYY-MM-DD');
            if (index <= mDiff && nextMonth < d2) {
              newFormattedData.push({
                name: moment(nextMonth).format('MMM YYYY'),
                Payment: 0,
                Invested: 0,
                'Paid to date': 0,
              });
            }
          });
        }
      }
      return null;
    });

    return newFormattedData;
  }

  @computed get summaryLoading() {
    return get(this.accSummary, 'loading') || false;
  }

  @computed get getPieChartData() {
    return (this.pieChartData && toJS(this.pieChartData)) || null;
  }

  @action
  getInvestorAccountPortfolio = (accountType) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const account = this.isAdmin ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers :
      userDetailsStore.currentActiveAccountDetails;
    const { userDetails, getDetailsOfUser } = userDetailsStore;
    this.investmentLists = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: {
        userId: this.isAdmin ? getDetailsOfUser.id : userDetails.id,
        accountId: (account && account.details) ? account.details.accountId : null,
      },
      // fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && this.investmentLists && !this.investmentLists.loading) {
          this.calculateInvestmentType();
          this.portfolioError = false;
        }
        this.setFieldValue('apiCall', true);
      },
      onError: () => {
        this.portfolioError = true;
      },
    });
  }

  @action
  setPortfolioError = (val) => {
    this.portfolioError = val;
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
  getInvestorDetails = (accountType, offeringId, isAdmin = false) => new Promise((resolve) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const investorAccountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const investorDetails = userDetailsStore.getDetailsOfUser;
    const account = isAdmin ? investorAccountDetails : userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    const investorUserId = isAdmin ? investorDetails.id : userDetails.id;
    if (uiStore.inProgress !== 'portfolioDirect') {
      uiStore.setProgress('portfolio');
    }
    this.investmentDetails = graphql({
      client,
      query: getInvestorDetailsById,
      variables: {
        // userId: userDetails.id,
        userId: investorUserId,
        accountId: account.details.accountId,
        offeringId,
      },
      onFetch: () => {
        if (!this.investmentDetails.loading) {
          uiStore.setProgress(false);
          resolve();
        }
      },
      onError: () => {
        uiStore.setProgress(false);
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
  @action
  resetPortfolioData = () => {
    this.setFieldValue('investmentLists', null);
  }
}

export default new PortfolioStore();
