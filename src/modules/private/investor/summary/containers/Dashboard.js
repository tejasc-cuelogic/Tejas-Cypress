import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Header, Card } from 'semantic-ui-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../theme/shared';
import PrivateLayout from '../../../shared/PrivateLayout';
import CashMovement from '../components/CashMovement';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';
import AccountCreation from './../../accountSetup/containers/accountCreation';

const summaryDetails = ({
  totalInvested, pendingInvestments, paidToDate, tnar,
}) => {
  console.log(tnar);
  return {
    accountType: 'individual',
    title: false,
    summary: [
      {
        title: 'Total Invested', content: totalInvested, type: 1, info: 'Total Invested as of today',
      },
      {
        title: 'Pending Investment', content: pendingInvestments, type: 1, info: 'Pending Investment',
      },
      {
        title: 'Paid to Date', content: paidToDate, type: 1, info: 'Paid to Date',
      },
      {
        title: 'Simple Earnings %', content: `${tnar} %`, type: 0, info: 'Simple Earnings %',
      },
    ],
  };
};

@inject('userDetailsStore', 'portfolioStore')
@observer
export default class Dashboard extends Component {
  componentWillMount() {
    this.props.portfolioStore.getSummary();
  }
  render() {
    const { summaryLoading, summary } = this.props.portfolioStore;
    if (summaryLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Route path="/app/summary/account-creation" component={AccountCreation} />
        <PrivateLayout
          {...this.props}
        >
          <Header as="h4">Values Performance</Header>
          <SummaryHeader details={summaryDetails(summary)} />
          <Card fluid>
            <Card.Content>
              <Header as="h4">Cash Movement, LTM</Header>
              <CashMovement data={summary.cashMovement} />
            </Card.Content>
          </Card>
        </PrivateLayout>
      </Aux>
    );
  }
}
