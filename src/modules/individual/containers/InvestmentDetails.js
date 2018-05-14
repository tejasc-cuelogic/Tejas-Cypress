import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Modal, Card } from 'semantic-ui-react';
import Loadable from 'react-loadable';
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
  { title: 'Transactions', to: 'transactions', component: 'Transactions' },
  { title: 'Updates', to: 'updates', component: 'Updates' },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
];

const getModule = component => Loadable({
  loader: () => import(`../components/portfolio/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

class InvestmentDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    const { match } = this.props;
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal}>
        <Modal.Content className="transaction-detials">
          <SummaryHeader details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={getModule(navItems[0].component)} />
              {
                navItems.map(item => (
                  <Route path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
