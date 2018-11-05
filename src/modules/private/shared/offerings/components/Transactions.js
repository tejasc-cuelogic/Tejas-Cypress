import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Divider } from 'semantic-ui-react';
import PaymentPerformance from './transactions/PaymentPerformance';
import PaymentHistory from './transactions/PaymentHistory';

const data = [
  {
    id: 1, month: 'May 2018', status: 'Drafted', grossSale: 1200, payment: 10730, total: 2000, outstanding: 11000,
  },
  {
    id: 1, month: 'May 2018', status: 'Pending', grossSale: 1500, payment: 10730, total: 2000, outstanding: 11000,
  },
  {
    id: 1, month: 'May 2018', status: 'Pending', grossSale: 1600, payment: 10730, total: 2000, outstanding: 11000,
  },
  {
    id: 1, month: 'May 2018', status: 'Complete', grossSale: 1290, payment: 10730, total: 2000, outstanding: 11000,
  },
  {
    id: 1, month: 'May 2018', status: 'Complete', grossSale: 4320, payment: 10730, total: 2000, outstanding: 11000,
  },
];

@inject('offeringCreationStore')
@observer
export default class Transactions extends Component {
  render() {
    return (
      <div className="inner-content-spacer">
        <PaymentPerformance />
        <Divider hidden />
        <Header as="h4">Payment History</Header>
        <PaymentHistory data={data} />
      </div>
    );
  }
}
