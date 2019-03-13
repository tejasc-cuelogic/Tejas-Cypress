import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Card } from 'semantic-ui-react';
import moment from 'moment';
import { includes, get } from 'lodash';
import Loadable from 'react-loadable';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import NotFound from '../../../../shared/NotFound';

const getModule = component => Loadable({
  loader: () => import(`../components/portfolio/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
const navItems = [
  { title: 'Overview', to: 'overview', component: 'Overview' },
  { title: 'Transactions', to: 'transactions', component: 'Transactions' },
  { title: 'Updates', to: 'updates', component: 'Updates' },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
];
@inject('portfolioStore', 'campaignStore', 'offeringCreationStore')
@observer
class InvestmentDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    if (this.props.offeringCreationStore.currentOfferingId !== this.props.match.params.id ||
      this.props.portfolioStore.currentAcccountType !== accountType) {
      this.props.portfolioStore.getInvestorDetails(accountType, this.props.match.params.id);
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id, true);
      this.props.offeringCreationStore.setCurrentOfferingId(this.props.match.params.id);
      this.props.portfolioStore.currentAccoutType(accountType);
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    const { match, portfolioStore } = this.props;
    const { getInvestor } = portfolioStore;
    const { campaign, details } = this.props.campaignStore;

    const summaryDetails = {
      accountType: 'individual',
      url: 'https://www.nextseed.com/offerings/chapman-kirby/',
      businessName: campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName,
      summary: [
        {
          title: 'Total Raised Amount', content: get(getInvestor, 'totalRaisedAmount') ? get(getInvestor, 'totalRaisedAmount') : 'NA', type: 1,
        },
        {
          title: 'Funded Date', content: get(getInvestor, 'fundedDate') ? moment(get(getInvestor, 'fundedDate')).format('ll') : 'NA', info: 'Date on which funds were disbursed to the issuer.',
        },
        {
          title: 'My Investment', content: get(getInvestor, 'myInvestment') ? get(getInvestor, 'myInvestment') : 'NA', type: 1,
        },
        {
          title: 'Net Payments Received', content: get(getInvestor, 'netPaymentsReceived') ? get(getInvestor, 'netPaymentsReceived') : 'NA', type: 1, info: 'Payments received to date from this investment, minus NextSeed fees.',
        },
        {
          title: 'Net Annualized Returns', content: get(getInvestor, 'netAnnualizedReturn') ? `${get(getInvestor, 'netAnnualizedReturn')}%` : 'NA', info: <span>Net Annualized Return (&quot;NAR&quot;) measures the current financial return of each investment in your portfolio. See the Education Center for a full explanation of how NAR <Link to="/resources/education-center">Education Center</Link> is calculated. </span>,
        },
      ],
    };
    if (!details || details.loading) {
      return <InlineLoader />;
    }
    if (details && details.data && !details.data.getOfferingDetailsById) {
      return <NotFound />;
    }
    return (
      <Modal closeOnDimmerClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <SummaryHeader details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route
                exact
                path={match.url}
                component={getModule(navItems[0].component)}
              />
              {
                navItems.map(item => (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    component={getModule(item.component)}
                  />
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
