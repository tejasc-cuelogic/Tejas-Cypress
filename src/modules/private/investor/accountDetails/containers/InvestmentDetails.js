import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Card, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { includes, get } from 'lodash';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import Documents from '../../../../public/offering/components/campaignDetails/documents';
import { SuspenseBoundary, lazyRetry, InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import NotFound from '../../../../shared/NotFound';
import { DataFormatter } from '../../../../../helper';


const getModule = component => lazyRetry(() => import(`../components/portfolio/${component}`));
@inject('portfolioStore', 'campaignStore', 'uiStore', 'offeringCreationStore', 'updateStore')
@observer
class InvestmentDetails extends PureComponent {
  componentDidMount() {
    const { portfolioStore, uiStore, isAdmin } = this.props;
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    if (this.props.offeringCreationStore.currentOfferingSlug !== this.props.match.params.offeringSlug
      || portfolioStore.currentAcccountType !== accountType) {
      if (uiStore.inProgress !== 'portfolio') {
        this.props.uiStore.setProgress('portfolioDirect');
      }
      this.props.campaignStore.getCampaignDetails(this.props.match.params.offeringSlug).then((res) => {
        this.props.offeringCreationStore.setCurrentOfferingId(res.id);
        this.props.offeringCreationStore.setFieldValue('currentOfferingSlug', this.props.match.params.offeringSlug);
        portfolioStore.currentAccoutType(accountType);
        portfolioStore.getInvestorDetails(accountType, res.id, isAdmin).then(() => this.props.uiStore.setProgress(false));
      });
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.updateStore.setFieldValue('isApiHit', false);
    this.props.offeringCreationStore.resetOfferingId();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    const { match, portfolioStore } = this.props;
    const { getInvestor, loadingInvestDetails } = portfolioStore;
    let navItems = [
      { title: 'Overview', to: 'overview', component: 'Overview' },
      { title: 'Transactions', to: 'transactions', component: 'Transactions' },
      { title: 'Updates', to: 'updates', component: 'Updates' },
      { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
      { title: 'Documents', to: 'documents', component: Documents, load: false },
    ];
    const { campaign, details, dataRoomDocs } = this.props.campaignStore;
    const { responsiveVars } = this.props.uiStore;
    let filterLabel;
    const hardCloseDate = moment(new Date(`${get(campaign, 'closureSummary.hardCloseDate')} 23:59:59`)).format('MM/DD/YYYY HH:mm:ss');
    const summaryDetails = {
      accountType: 'individual',
      url: 'https://www.nextseed.com/offerings/chapman-kirby/',
      businessName: campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName,
      summary: [
        {
          title: 'Total Raised Amount', content: get(getInvestor, 'totalRaisedAmount') || 'N/A', type: 1, fraction: false,
        },
        {
          title: 'Close Date', content: get(campaign, 'closureSummary.hardCloseDate') ? DataFormatter.getDateAsPerTimeZone(hardCloseDate, true, true, false) : 'NA',
        },
        {
          title: 'My Investment', content: get(getInvestor, 'myInvestment') || 'N/A', type: 1, fraction: false,
        },
        {
          title: 'Net Payments Received', content: get(getInvestor, 'netPaymentsReceived') || 'N/A', type: 1, info: 'Payments received to date from this investment, minus NextSeed fees.',
        },
        {
          title: 'Principal Remaining', content: get(getInvestor, 'remainingPrincipal') || 'N/A',
        },
        {
          title: 'Payments Remaining', content: get(getInvestor, 'remainingPayment') || 'N/A',
        },
      ],
    };

    if (details && details.data && !details.data.getOfferingDetailsBySlug) {
      return <NotFound />;
    }
    if (dataRoomDocs.length === 0) {
      navItems = navItems.filter(f => f.title !== 'Documents');
    }

    if (![details.loading, loadingInvestDetails, get(details, 'data')].includes(undefined) && (!details.loading || !loadingInvestDetails)) {
      const { securities } = get(details, 'data.getOfferingDetailsBySlug.keyTerms');
      filterLabel = securities === 'TERM_NOTE' ? 'Payments Remaining' : securities === 'REVENUE_SHARING_NOTE' ? 'Principal Remaining' : undefined;
      summaryDetails.summary = summaryDetails.summary.filter(sum => (filterLabel === undefined
        ? !['Principal Remaining', 'Payments Remaining'].includes(sum.title)
        : filterLabel !== sum.title));
    }

    return (
      <Modal closeOnDimmerClick={false} closeIcon={!responsiveVars.isMobile} size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        {responsiveVars.isMobile && (
          <div className="mob-header">
            <Icon className="ns-close-circle" color="grey" onClick={this.handleCloseModal} />
          </div>
        )}
        <Modal.Content className={`${responsiveVars.isMobile ? 'mt-30' : ''} transaction-details`}>
          {[details.loading, loadingInvestDetails].includes(undefined) || details.loading || loadingInvestDetails ? <InlineLoader /> : (
            <>
              <SummaryHeader details={summaryDetails} loading={details.loading || loadingInvestDetails} />
              <Card fluid className={responsiveVars.isMobile ? 'mt-0' : ''}>
                {!responsiveVars.isMobile
                  && <SecondaryMenu match={match} navItems={navItems} />
                }
                <SuspenseBoundary>
                  <Switch>
                    <Route
                      exact
                      path={match.url}
                      render={(props) => {
                        const FirstComponent = getModule(navItems[0].component);
                        return (<FirstComponent {...props} refMatch={JSON.parse(JSON.stringify(match))} MobileNavItems={navItems} />);
                      }}
                    />
                    {
                      navItems.map((item) => {
                        const CurrentModule = item.load === false
                          ? item.component : getModule(item.component);
                        return (
                          <Route
                            key={item.to}
                            path={`${match.url}/${item.to}`}
                            render={props => (
                              <CurrentModule
                                isAdmin={this.props.isAdmin}
                                portfolioSection
                                {...props}
                                MobileNavItems={navItems}
                                refMatch={JSON.parse(JSON.stringify(match))}
                              />
                            )
                            }
                          />
                        );
                      })
                    }
                  </Switch>
                </SuspenseBoundary>
              </Card>
            </>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
