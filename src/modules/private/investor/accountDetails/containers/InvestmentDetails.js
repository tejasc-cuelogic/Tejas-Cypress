import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Card } from 'semantic-ui-react';
import moment from 'moment';
import Loadable from 'react-loadable';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const navItems = [
  { title: 'Overview', to: 'overview', component: 'Overview' },
  { title: 'Transactions', to: 'transactions', component: 'Transactions' },
  { title: 'Updates', to: 'updates', component: 'Updates' },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
];
@inject('portfolioStore')
@observer
class InvestmentDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
      this.props.portfolioStore.getInvestorDetails('ira', this.props.match.params.id);
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    const { getInvestor } = this.props.portfolioStore;
    const summaryDetails = {
      accountType: 'individual',
      url: 'https://www.nextseed.com/offerings/chapman-kirby/',
      businessName: 'The Brewers Table',
      summary: [
        {
          title: 'Total invested amount', content: getInvestor && getInvestor.totalRaisedAmount, type: 1, info: 'Your Total invested amount as of today',
        },
        {
          title: 'Status', content: 'Funded', info: 'Your Status as of today',
        },
        {
          title: 'Date', content: getInvestor && moment(getInvestor.fundedDate).format('ll'), info: 'Date of investment started',
        },
        {
          title: 'Net Payments Received', content: 1762.5, type: 1, info: 'Your Net Payments Received till date',
        },
        {
          title: 'Net Annualied Returns', content: '23.5%', info: 'Your Net Annualied Returns till date',
        },
      ],
    };
    const getModule = component => Loadable({
      loader: () => import(`../components/portfolio/${component}`),
      loading() {
        return <InlineLoader />;
      },
    });
    const { match } = this.props;
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <SummaryHeader details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={getModule(navItems[0].component)} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
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
