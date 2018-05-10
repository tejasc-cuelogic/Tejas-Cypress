import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';

const summaryDetails = {
  accountType: 'individual',
  className: 'investment-summary',
  summary: [
    {
      title: 'Total Balance', content: 400.0, type: 1, info: 'Your Total Balance as of today',
    },
    {
      title: 'Total Deposit', content: 250.0, type: 1, info: 'Your Total Deposit as of today',
    },
    {
      title: 'Net Payments', content: 100.0, type: 1, info: 'Your Net Payments as of today',
    },
    {
      title: 'TNAR', content: 50.0, type: 1, info: 'Your TNAR as of today',
    },
  ],
};

export default class Portfolio extends Component {
  render() {
    const { match } = this.props;
    return (
      <Aux>
        <SummaryHeader details={summaryDetails} />
        <PortfolioAllocations />
        <Header as="h3">My Investments</Header>
        <InvestmentList listOf="pending" match={match} />
        <InvestmentList listOf="active" match={match} />
        <InvestmentList listOf="completed" match={match} />
        <Route exact path={`${match.url}/investment-details/:id`} component={InvestmentDetails} />
      </Aux>
    );
  }
}
