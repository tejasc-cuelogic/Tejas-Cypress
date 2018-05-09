import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';

export default class Portfolio extends Component {
  render() {
    return (
      <Aux>
        <SummaryHeader />
        <PortfolioAllocations />
        <Header as="h3">My Investments</Header>
        <InvestmentList listOf="pending" />
        <InvestmentList listOf="active" />
        <InvestmentList listOf="completed" />
      </Aux>
    );
  }
}
