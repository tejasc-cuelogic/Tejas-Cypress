import React from 'react';
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { forEach, sortBy, get, times, capitalize } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator } from '../../../../helper';
import { CANCEL_INVESTMENT, INVESTMENT_SUMMARY_META } from '../../../constants/investment';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_EQUITY_CLASS } from '../../../../constants/offering';
import { getInvestorAccountPortfolio, getInvestmentDetails, investNowCancelAgreement, getUserAccountSummary, getMonthlyPaymentsToInvestorByOffering } from '../../queries/portfolio';
import { userDetailsStore, uiStore, offeringCreationStore, campaignStore } from '../../index';
import Helper from '../../../../helper/utility';
import HtmlEditor from '../../../../modules/shared/HtmlEditor';
import { DateTimeFormat } from '../../../../theme/shared';

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

  @observable CANCEL_INVESTMENT_FRM = Validator.prepareFormObject(CANCEL_INVESTMENT);

  @observable overviewSummaryMeta = [];

  @action
  getSecurityTitle = (securities) => {
    const { campaign } = campaignStore;
    const equityClass = get(campaign, 'keyTerms.equityClass');
    let text = CAMPAIGN_KEYTERMS_SECURITIES[securities] || 'N/A';
    if (securities === 'EQUITY' && equityClass === 'PREFERRED') {
      text = CAMPAIGN_KEYTERMS_SECURITIES.PREFERRED_EQUITY_506C;
    } else if (securities === 'EQUITY' && equityClass === 'LLC_MEMBERSHIP_UNITS') {
      text = CAMPAIGN_KEYTERMS_SECURITIES.REAL_ESTATE;
    } else if (securities === 'EQUITY' && ['CLASS_A_SHARES', 'CLASS_B_SHARES'].includes(equityClass)) {
      text = CAMPAIGN_KEYTERMS_EQUITY_CLASS[equityClass] || 'N/A';
    }
    return text;
  };

  @action
  getOverviewSummaryData = (data) => {
    const { campaign } = campaignStore;
    const summaryData = { ...data };
    switch (data.key) {
      case 'securities':
        summaryData.value = this.getSecurityTitle(get(campaign, data.value));
        break;
      case 'expectedOpsDate':
        summaryData.value = get(campaign, data.value) && <DateTimeFormat isCSTFormat datetime={get(campaign, data.value)} />;
        break;
      case 'maturity':
        summaryData.value = get(campaign, 'keyTerms.startupPeriod') ? `${get(campaign, data.value)} months, including a ${get(campaign, 'keyTerms.startupPeriod')}-month startup period for ramp up` : `${get(campaign, data.value)} months`;
        break;
      case 'multiple':
        summaryData.value = (
        <>{get(campaign, data.value)}x <br />
          {get(campaign, 'keyTerms.investmentMultipleSummary')
          && (
          <HtmlEditor
            readOnly
            content={(get(campaign, 'keyTerms.investmentMultipleSummary')
              && get(campaign, 'keyTerms.investmentMultipleSummary'))}
          />
        )}</>
        );
        break;
      case 'priceCalculation':
        summaryData.label = `${capitalize(get(campaign, 'keyTerms.equityUnitType'))} Price`;
        summaryData.value = Helper.CurrencyFormat(get(campaign, data.value));
        break;
      case 'premoneyValuation':
        summaryData.value = Helper.CurrencyFormat(get(campaign, data.value), 0);
        break;
      case 'interestRate':
        summaryData.value = `${get(campaign, data.value)}%`;
        break;
      case 'revSharePercentage':
        summaryData.value = `${get(campaign, data.value)}%`;
        break;
      case 'securitiesOwnershipPercentage':
        summaryData.value = `${get(campaign, data.value)}% equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities.`;
        break;
        case 'hardCloseDate':
        summaryData.value = get(campaign, data.value) && <DateTimeFormat isCSTFormat datetime={get(campaign, data.value)} />;
        break;
      default:
        summaryData.value = get(campaign, data.value);
        break;
    }
    return summaryData;
  }

  @action
  setOverviewSummaryData = (type) => {
    const overviewSummaryMetaData = [];
    INVESTMENT_SUMMARY_META.map((data) => {
      if (data.for.includes(type)) {
        overviewSummaryMetaData.push(this.getOverviewSummaryData(data));
      }
      return overviewSummaryMetaData;
    });
    this.overviewSummaryMeta = overviewSummaryMetaData;
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  resetPiechartValues = () => {
    this.pieChartDataEval = {
      investmentType: {
        EQUITY: { name: 'Equity', value: 0 },
        TERM_NOTE: { name: 'Term Note', value: 0 },
        REVENUE_SHARING_NOTE: { name: 'Rev Share', value: 0 },
        CONVERTIBLE_NOTES: { name: 'Convertible Notes', value: 0 },
        SAFE: { name: 'SAFE', value: 0 },
        FUNDS: { name: 'Funds - Limited Partner Interest', value: 0 },
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
    const userId = isAdmin ? getDetailsOfUser.id : null;
    this.accSummary = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getUserAccountSummary,
      variables: userId ? { userId } : { },
    });
  }

  @action
  formChange = (e, result, form) => {
    if (result && (result.type === 'checkbox')) {
      this[form].fields[result.name].value = result.checked;
      // this[form] = Validator.onChange(
      //   this[form],
      //   { name: result.name, value: result.checked },
      //   'checkbox',
      //   true,
      //   result.checked,
      // );
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }
  }

  @action
  getPayOffData = (accountType, isAdmin = false) => {
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const accountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const investorUserDetails = userDetailsStore.getDetailsOfUser;
    const account = isAdmin ? accountDetails : userDetailsStore.currentActiveAccountDetails;
    let variables = {
      accountId: account.details.accountId,
      offeringId: offeringCreationStore.currentOfferingId,
    };
    variables = isAdmin ? { ...variables, userId: investorUserDetails.id } : { ...variables };
    this.PayOffData = graphql({
      client,
      query: getMonthlyPaymentsToInvestorByOffering,
      variables,
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
            if (this.pieChartDataEval.investmentType[ele.offering.keyTerms.securities]) {
              this.pieChartDataEval.investmentType[ele.offering.keyTerms.securities].value += 1;
            }
            if (this.pieChartDataEval.industry[ele.offering.keyTerms.industry]) {
              this.pieChartDataEval.industry[ele.offering.keyTerms.industry].value += 1;
            }
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
    formattedData.map((k, i) => {
      newFormattedData.push({
        name: moment(k.yearMonth).format('MMM YYYY'),
        Payment: k.payment ? parseFloat(k.payment) : 0,
        Invested: k.invested ? parseFloat(k.invested) : 0,
        'Paid to date': k.paidToDate ? parseFloat(k.paidToDate) : 0,
      });

      if (formattedData[i + 1]) {
        const d1 = moment(k.yearMonth).format('YYYY-MM-DD');
        const d2 = moment(formattedData[i + 1].yearMonth).format('YYYY-MM-DD');
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
    const account = this.isAdmin ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers
      : userDetailsStore.currentActiveAccountDetails;
    const { getDetailsOfUser } = userDetailsStore;
    let variables = {
      accountId: (account && account.details) ? account.details.accountId : null,
    };
    variables = this.isAdmin ? { ...variables, userId: getDetailsOfUser.id } : { ...variables };
    this.investmentLists = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables,
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
    return (this.investmentLists && this.investmentLists.data
      && this.investmentLists.data.getInvestorAccountPortfolio
      && toJS(this.investmentLists.data.getInvestorAccountPortfolio)) || null;
  }

  @computed get getInvestorAccountById() {
    const accounts = this.getInvestorAccounts;
    let offering = null;
    if (accounts) {
      offering = accounts.investments.pending.find(acc => acc.offering.id === this.currentOfferingId);
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
    let variables = {
      accountId: account.details.accountId,
      offeringId,
    };
    variables = isAdmin ? { ...variables, userId: investorDetails.id } : { ...variables };
    if (uiStore.inProgress !== 'portfolioDirect') {
      uiStore.setProgress('portfolio');
    }
    this.investmentDetails = graphql({
      client,
      query: getInvestmentDetails,
      variables,
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
    return (this.investmentDetails && this.investmentDetails.data
      && this.investmentDetails.data.getInvestmentDetails
      && toJS(this.investmentDetails.data.getInvestmentDetails)) || null;
  }

  @computed get loadingInvestDetails() {
    return get(this.investmentDetails, 'loading');
  }

  @action
  cancelAgreement = (agreementId, isAdmin = false) => {
    const investorAccountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const investorDetails = userDetailsStore.getDetailsOfUser;
    const account = isAdmin ? investorAccountDetails : userDetailsStore.currentActiveAccountDetails;
    const investorUserId = isAdmin ? investorDetails.id : null;
    let variables = {
      agreementId: agreementId ? parseInt(agreementId, 10) : null,
    };
    if (isAdmin) {
      const cancelAgreementData = Validator.evaluateFormData(toJS(this.CANCEL_INVESTMENT_FRM.fields));
      variables = {
        ...variables,
        userId: investorUserId,
        voidReason: cancelAgreementData.voidReason,
        voidType: cancelAgreementData.voidType,
        sendNotification: cancelAgreementData.sendNotification || false,
      };
    }
    let reetchVariable = {
      accountId: account.details.accountId,
    };
    reetchVariable = investorUserId ? { ...reetchVariable, userId: investorUserId } : { ...reetchVariable };
    uiStore.setProgress(true);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: investNowCancelAgreement,
          variables,
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: reetchVariable,
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

  @action
  getPortfolioDetailsAfterInvestment = portfolioObj => new Promise((resolve, reject) => {
    this.investmentLists = graphql({
      client,
      query: getInvestorAccountPortfolio,
      variables: portfolioObj,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && this.investmentLists && !this.investmentLists.loading) {
          resolve(true);
        }
      },
      onError: () => {
        reject();
      },
    });
  });
}

export default new PortfolioStore();
