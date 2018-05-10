import React, { Component } from 'react';
import { Modal, Card } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';

const summaryDetails = {
  accountType: 'individual',
  businessName: 'The Brewers Table',
  summary: [
    {
      title: 'Total invested amount', content: 3810, type: 1, info: 'Your Total invested amount as of today',
    },
    {
      title: 'Status', content: 'Funded', info: 'Your Status as of today',
    },
    {
      title: 'Date', content: 'May 5th, 2018', info: 'Date of investment started',
    },
    {
      title: 'Net Payments Received', content: 6500, type: 1, info: 'Your Net Payments Received till date',
    },
    {
      title: 'Net Annualied Returns', content: '18.23%', info: 'Your Net Annualied Returns till date',
    },
  ],
};

const navItems = [
  { title: 'Transactions', to: 'transactions' },
  { title: 'Updates', to: 'updates' },
  { title: 'Bonus Rewards', to: 'bonus-rewards' },
];

class InvestmentDetails extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal}>
        <Modal.Content className="transaction-detials">
          <SummaryHeader details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={this.props.match} navItems={navItems} />
            <div className="table-wrapper">
              content goes here !!
            </div>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
