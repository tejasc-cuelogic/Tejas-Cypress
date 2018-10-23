import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Card } from 'semantic-ui-react';
import moment from 'moment';
import Loadable from 'react-loadable';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { CAMPAIGN_OFFERING_STATUS } from '../../../../../constants/offering';
import NotFound from '../../../../shared/NotFound';

const navItems = [
  { title: 'Overview', to: 'overview', component: 'Overview' },
  { title: 'Transactions', to: 'transactions', component: 'Transactions' },
  { title: 'Updates', to: 'updates', component: 'Updates' },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
];
@inject('portfolioStore', 'campaignStore')
@observer
class InvestmentDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
    this.props.portfolioStore.getInvestorDetails('ira', this.props.match.params.id).then(() => {
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id, true);
    });
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    const { match, portfolioStore } = this.props;
    const { getInvestor, investmentDetails } = portfolioStore;
    const { campaign } = this.props.campaignStore;

    const summaryDetails = {
      accountType: 'individual',
      url: 'https://www.nextseed.com/offerings/chapman-kirby/',
      businessName: 'The Brewers Table',
      summary: [
        {
          title: 'Total invested amount', content: getInvestor && getInvestor.totalRaisedAmount, type: 1, info: 'Your Total invested amount as of today',
        },
        {
          title: 'Status', content: campaign && campaign.offeringStatus ? CAMPAIGN_OFFERING_STATUS[campaign.offeringStatus] : 'NA', info: 'Your Status as of today',
        },
        {
          title: 'Date', content: getInvestor && moment(getInvestor.fundedDate).format('ll'), info: 'Date of investment started',
        },
        {
          title: 'Net Payments Received', content: getInvestor && getInvestor.netPaymentsReceived, type: 1, info: 'Your Net Payments Received till date',
        },
        {
          title: 'Net Annualied Returns', content: getInvestor && getInvestor.netAnnualizedReturn, info: 'Your Net Annualied Returns till date',
        },
      ],
    };
    const getModule = component => Loadable({
      loader: () => import(`../components/portfolio/${component}`),
      loading() {
        return <InlineLoader />;
      },
    });
    if (investmentDetails && investmentDetails.data &&
      !investmentDetails.data.getInvestmentDetailsOverview) {
      return <NotFound />;
    }
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
