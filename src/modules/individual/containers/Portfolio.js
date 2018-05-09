import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';

export default class Portfolio extends Component {
  render() {
    const { match } = this.props;
    return (
      <Aux>
        <SummaryHeader />
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
