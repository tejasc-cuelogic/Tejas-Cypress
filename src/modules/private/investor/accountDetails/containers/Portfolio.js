import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';
import { InlineLoader } from '../../../../../theme/shared';

@inject('portfolioStore')
@observer
export default class Portfolio extends Component {
  componentWillMount() {
    this.props.portfolioStore.getInvestorAccountPortfolio('ira');
  }
  render() {
    const { match, portfolioStore } = this.props;
    if (portfolioStore.loading) {
      return <InlineLoader />;
    }
    const { getInvestorAccounts, calculateInvestmentType } = portfolioStore;
    const summaryDetails = {
      accountType: includes(this.props.location, 'individual') ? 'individual' : includes(this.props.location, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: getInvestorAccounts && getInvestorAccounts.totalBalance, type: 1, info: 'Your Total Balance as of today',
        },
        {
          title: 'Total Deposit', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Your Total Deposit as of today',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.netPayments, type: 1, info: 'Your Net Payments as of today',
        },
        {
          title: 'TNAR', content: getInvestorAccounts && getInvestorAccounts.tnar, type: 1, info: 'Your TNAR as of today',
        },
      ],
    };
    console.log(calculateInvestmentType);
    return (
      <Aux>
        <SummaryHeader details={summaryDetails} />
        <PortfolioAllocations pieChart={calculateInvestmentType} />
        <Header as="h4">My Investments</Header>
        <InvestmentList investments={getInvestorAccounts && getInvestorAccounts.investments.pending} listOf="pending" match={match} />
        <InvestmentList investments={getInvestorAccounts && getInvestorAccounts.investments.active} listOf="active" match={match} />
        <InvestmentList investments={getInvestorAccounts && getInvestorAccounts.investments.completed} listOf="completed" match={match} />
        <Route
          path={`${match.url}/investment-details/:id`}
          render={props => <InvestmentDetails refLink={match.url} {...props} />}
        />
      </Aux>
    );
  }
}
