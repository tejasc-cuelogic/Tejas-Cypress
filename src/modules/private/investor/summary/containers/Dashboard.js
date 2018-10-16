import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Header, Card } from 'semantic-ui-react';
import Aux from 'react-aux';
import PrivateLayout from '../../../shared/PrivateLayout';
import CashMovement from '../components/CashMovement';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';
import AccountCreation from './../../accountSetup/containers/accountCreation';

const summaryDetails = {
  accountType: 'individual',
  title: false,
  summary: [
    {
      title: 'Total Invested', content: 40000.0, type: 1, info: 'Total Invested as of today',
    },
    {
      title: 'Pending Investment', content: '-', type: 0, info: 'Pending Investment',
    },
    {
      title: 'Paid to Date', content: 15000.0, type: 1, info: 'Paid to Date',
    },
    {
      title: 'Simple Earnings %', content: '3.20 %', type: 0, info: 'Simple Earnings %',
    },
  ],
};

@inject('userDetailsStore')
@observer
export default class Dashboard extends Component {
  render() {
    return (
      <Aux>
        <Route path="/app/summary/account-creation" component={AccountCreation} />
        <PrivateLayout
          {...this.props}
        >
          <Header as="h4">Values Performance</Header>
          <SummaryHeader details={summaryDetails} />
          <Card fluid>
            <Card.Content>
              <Header as="h4">Cash Movement, LTM</Header>
              <CashMovement />
            </Card.Content>
          </Card>
        </PrivateLayout>
      </Aux>
    );
  }
}
