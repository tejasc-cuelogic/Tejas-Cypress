/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header } from 'semantic-ui-react';
import { FillTable } from '../../../../../../theme/table/NSTable';

const TERMNOTEMETA = {
  columns: [
    { title: 'Month', field: 'index', textAlign: 'center' },
    { title: 'Loan Amount', field: 'loanAmount', textAlign: 'center' },
    { title: 'Payment', field: 'monthlyPayment', textAlign: 'center' },
    { title: 'Principal', field: 'principalAmount', textAlign: 'center' },
    { title: 'Interest', field: 'interestAmount', textAlign: 'center' },
    // { title: 'Principal', field: 'principalPercentage', textAlign: 'center' },
    // { title: 'Interest', field: 'interestPercentage', textAlign: 'center' },
    { title: 'Balance', field: 'balanceAmount', textAlign: 'center' },
  ],
  rows: null,
};
const REVENUESHARINGMETA = {
  columns: [
    { title: 'Year', field: 'yearAmount', textAlign: 'center' },
    { title: 'Expected Annual Revenue', field: 'annualRevenue', textAlign: 'center' },
    { title: 'Revenue Sharing Percentage', field: 'revenueSharingPercentage', textAlign: 'center' },
    { title: 'Payment Amount', field: 'paymentAmount', textAlign: 'center' },
    { title: 'Cumulative Payments', field: 'cumulativePayments', textAlign: 'center' },
  ],
  rows: null,
};
@inject('businessAppReviewStore')
@observer
export default class PaymentChart extends Component {
  render() {
    const { revenueSharing, paymentChart, offerStructure } = this.props.businessAppReviewStore;
    const payment = offerStructure === 'TERM_NOTE' ? paymentChart() : revenueSharing();
    if (offerStructure === 'TERM_NOTE') {
      TERMNOTEMETA.rows = payment;
    } else {
      REVENUESHARINGMETA.rows = payment;
    }
    return (
      <Aux>
        <Header as="h4">{offerStructure === 'TERM_NOTE' ? 'Amortization Schedule Example' : 'Revenue Share Repayment Example'}</Header>
        <div className="table-wrapper-vertical">
          <FillTable result={offerStructure === 'TERM_NOTE' ? TERMNOTEMETA : REVENUESHARINGMETA} />
        </div>
      </Aux>
    );
  }
}
