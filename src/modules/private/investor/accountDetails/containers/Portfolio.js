import React, { PureComponent } from 'react';
import moment from 'moment';
import { includes, orderBy, get, filter } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Link, Switch } from 'react-router-dom';
import { Header, Card, Button } from 'semantic-ui-react';
import money from 'money-math';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import SummaryTerms from '../components/portfolio/SummaryTerms';
import { DataFormatter } from '../../../../../helper';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';
import CancelInvestment from '../components/portfolio/CancelInvestment';
import { InlineLoader, IframeModal } from '../../../../../theme/shared';
import InvestNow from '../../../../public/offering/components/investNow/InvestNow';
// import Agreement from '../../../../public/offering/components/investNow/agreement/components/Agreement';
import AgreementTemplate from '../../../../shared/campaign/AgreementTemplate';
import Congratulation from '../../../../public/offering/components/investNow/agreement/components/Congratulation';
import ChangeInvestmentLimit from '../../../../public/offering/components/investNow/ChangeInvestmentLimit';
import AccountHeader from '../../../admin/userManagement/components/manage/accountDetails/AccountHeader';
import HtmlEditor from '../../../../shared/HtmlEditor';
import StickyNotification from '../../setup/components/stickyNotification';

const isTablet = document.documentElement.clientWidth < 992;
@inject('portfolioStore', 'transactionStore', 'userDetailsStore', 'uiStore', 'campaignStore', 'referralsStore', 'investmentStore', 'accreditationStore')
@observer
export default class Portfolio extends PureComponent {
  state = {
    open: false,
    embedUrl: '',
    inActiveItems: [],
    showSticky: true,
  };

  constructor(props) {
    super(props);
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { setFieldValue } = this.props.userDetailsStore;
    setFieldValue('currentActiveAccount', accountType);
    this.props.investmentStore.accTypeChanged(null, { value: accountType });
    this.props.accreditationStore.changeShowAccountListFlag(false);
    if (!this.props.isAdmin && !this.props.accreditationStore.accreditationData.ira) {
      this.props.accreditationStore.getUserAccreditation().then(() => {
        this.props.accreditationStore.initiateAccreditation();
      });
    }
    this.props.portfolioStore.setFieldValue('isAdmin', this.props.isAdmin);
    if (!this.props.isAdmin
      || (this.props.isAdmin && !this.props.portfolioStore.apiCall)) {
      this.props.portfolioStore.getInvestorAccountPortfolio(accountType);
    }
    this.props.portfolioStore.calculateInvestmentType();
    window.addEventListener('message', this.docuSignListener);
    this.props.portfolioStore.setPortfolioError(false);
  }

  docuSignListener = (e) => {
    if (e.data === 'viewing_complete') {
      this.setState({ open: false });
    }
  };

  viewLoanAgreement = (aggrementId) => {
    this.props.uiStore.setProgress('viewLoanAgreement');
    this.props.transactionStore.getDocuSignViewURL(aggrementId).then((res) => {
      this.setState({
        open: true,
        embedUrl: res,
      });
      this.props.uiStore.setProgress(false);
    });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  onCloseSticky = () => {
    this.setState({ showSticky: false });
    localStorage.setItem('hideNotifications', true);
  }

  toggleAccordion = (of) => {
    const { inActiveItems } = this.state;
    const updatedList = inActiveItems.includes(of) ? inActiveItems.filter(i => i !== of)
      : [...inActiveItems, of];
    this.setState({ inActiveItems: updatedList });
  }

  handleViewInvestment = (id) => {
    if (id) {
      this.props.uiStore.setProgress('portfolio');
      const redirectURL = `${this.props.match.url}/investment-details/${id}`;
      this.props.history.push(redirectURL);
    }
  }

  handleInvestNowOnChangeClick = (e, id, offeringUUID = null) => {
    if (offeringUUID) {
      this.props.campaignStore.setFieldValue('offeringUUID', offeringUUID);
    }
    const redirectURL = `${this.props.match.url}/${id}/invest-now`;
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(redirectURL);
  }

  routesList = () => {
    const { match } = this.props;
    // const AgreementComponent = campaignStore.campaignStatus.isAgreementTemplate ? AgreementTemplate : Agreement;
    return (
      <Switch>
        <Route
          path={`${match.url}/investment-details/:offeringSlug`}
          render={props => <InvestmentDetails refLink={match.url} {...props} />}
        />
        <Route exact path={`${match.url}/:offeringId/invest-now/change-investment-limit`} render={props => <ChangeInvestmentLimit changeInvestment offeringId={match.params.offeringId} refLink={match.url} {...props} />} />
        <Route
          path={`${match.url}/:offeringId/invest-now`}
          render={props => <InvestNow changeInvest refLink={match.url} {...props} />}
        />
        <Route exact path={`${match.url}/:offeringId/agreement`} render={() => <AgreementTemplate changeInvestment refLink={match.url} />} />
        <Route path={`${match.url}/:offeringId/agreement/change-investment-limit`} render={props => <ChangeInvestmentLimit changeInvestment refLink={`${match.url}`} {...props} />} />
        <Route path={`${match.url}/:offeringId/congratulation`} render={() => <Congratulation changeInvestment />} />
        <Route
          path={`${match.url}/cancel-investment/:id`}
          render={props => <CancelInvestment accType={includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity'} refLink={match.url} {...props} />}
        />
      </Switch>
    );
  }

  render() {
    const { match, portfolioStore, userDetailsStore, refLink } = this.props;
    const {
      multipleUserAccounts,
    } = userDetailsStore;
    const isUserAccountFrozen = userDetailsStore.isAccountFrozen;
    // const { referralData } = this.props.referralsStore;
    const { getActiveAccounts } = userDetailsStore;

    if (portfolioStore.loading) {
      return (
        <>
          <InlineLoader />
          {this.routesList()}
        </>
      );
    }
    const { getInvestorAccounts, getPieChartData, portfolioError } = portfolioStore;
    const totalPortfolioBalance = getInvestorAccounts && getInvestorAccounts.availableCash ? !this.props.isAdmin && money.isNegative(getInvestorAccounts.availableCash) ? '0.00' : getInvestorAccounts.availableCash : '0.00';
    const ERROR_MSG = `Sorry, this page is not loading correctly. We've notified the team.<br />
      Please check back again later, and contact us at
      <a href="mailto:support@nextseed.com">support@nextseed.com</a> with any questions.`;

    if (portfolioError) {
      return (
        <div>
          <section className="center-align">
            <h4 style={{ color: '#31333d7d' }}><HtmlEditor readOnly content={ERROR_MSG} /></h4>
          </section>
        </div>
      );
    }
    const notificationCard = {
      message:
  <span>
    <p>
        Are you an accredited investor? Go through the steps to verify your status
        today, and for a limited time, we will add a $100 credit to your account.
    </p>
    <a target="_blank" href="/agreements/Accredited-Investor-Verification-Incentive-Program-Terms-and-Conditions">See Rules</a>
  </span>,
      header: 'Earn $100 by verifying your accredited investor status',
    };
    // const tnarValue = get(getInvestorAccounts, 'tnar');
    const summaryDetails = {
      isAccountFrozen: isUserAccountFrozen,
      accountType: includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: totalPortfolioBalance, type: 1, info: 'Total Balance includes funds that are immediately available for investment. This includes pending incoming deposits, but excludes investment credits and pending investments.',
        },
        {
          title: 'Net Deposits', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Deposits made from your external accounts, minus withdrawals.',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.lifetimePaymentsReceived, type: 1, info: 'Payments received to date from all prior investments, minus NextSeed fees.',
        },
        {
          title: 'Available Credit', content: getInvestorAccounts && getInvestorAccounts.rewardsBalance, type: 1, info: `Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest. ${getActiveAccounts.length > 1 ? 'Referral credits are shared amongst all of your investment accounts.' : ''}`,
        },
        // {
        //   title: 'TNAR', content: tnarValue && !money.isZero(tnarValue) ? tnarValue :
        // 'N/A', type: 1, info: <span>The Total Net Annualized Return (TNAR) approximates
        // the overall financial return on your investment portfolio. See the <Link
        // target="_blank" to="/resources/education-center">Education Center</Link> for a
        // full explanation of how TNAR is calculated.</span>,
        // },
      ],
    };
    /* if (get(referralData, 'availableCredit') !== '0.00') {
      const availableCredit = {
        title: 'Available Credit', content: get(referralData, 'availableCredit'), type: 1, info: `Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest. ${getActiveAccounts.length > 1 ? 'Referral credits are shared amongst all of your investment accounts.' : ''}`,
      };
      summaryDetails.summary.push(availableCredit);
    } */
    const pendingSorted = getInvestorAccounts && getInvestorAccounts.investments.pending.length ? orderBy(getInvestorAccounts.investments.pending, o => get(o, 'offering.closureSummary.processingDate') && DataFormatter.diffDays(get(o, 'offering.closureSummary.processingDate')), ['asc']) : [];
    const activeSorted = getInvestorAccounts && getInvestorAccounts.investments.active.length ? orderBy(getInvestorAccounts.investments.active, o => get(o, 'offering.closureSummary.processingDate') && moment(new Date(o.offering.closureSummary.processingDate)).unix(), ['desc']) : [];
    let completedSorted = getInvestorAccounts && getInvestorAccounts.investments.completed.length ? orderBy(getInvestorAccounts.investments.completed, o => get(o, 'offering.closureSummary.processingDate') && moment(new Date(o.offering.closureSummary.processingDate)).unix(), ['desc']) : [];
    completedSorted = filter(completedSorted, o => !includes(['TERMINATED', 'FAILED', 'REJECTED'], get(o, 'offering.stage')));
    const hideNotifications = localStorage.getItem('hideNotifications');

    return (
      <>
        {this.props.isAdmin
          && <AccountHeader module="Investments" pathname={this.props.location.pathname} />
        }
        {!get(multipleUserAccounts, 'noAccounts') && this.state.showSticky && !hideNotifications
        && (
          <StickyNotification
            {...this.props}
            notificationCard={notificationCard}
            onCloseSticky={this.onCloseSticky}
            multipleAccounts={get(multipleUserAccounts, 'multipleAccounts') || null}
            accountId={get(multipleUserAccounts, 'accountId') || null}
            accountType={get(multipleUserAccounts, 'accountType') || null}
          />
        )
        }
        <SummaryHeader refLink={refLink} isAdmin={this.props.isAdmin} details={summaryDetails} />
        {this.props.isAdmin
          && <SummaryTerms refLink={refLink} isAdmin={this.props.isAdmin} details={getInvestorAccounts} />
        }
        {(getPieChartData.investmentType.length || getPieChartData.industry.length)
          ? <PortfolioAllocations isAdmin={this.props.isAdmin} pieChart={getPieChartData} /> : ''
        }
        <Header as={isTablet ? 'h5' : 'h4'}>My Investments</Header>
        {pendingSorted.length
          ? <InvestmentList isAdmin={this.props.isAdmin} handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} viewAgreement={this.viewLoanAgreement} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={pendingSorted} listOf="pending" listOfCount={pendingSorted.length} match={match} /> : null
        }
        {activeSorted.length
          ? <InvestmentList isAdmin={this.props.isAdmin} handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={activeSorted} listOf="active" listOfCount={activeSorted.length} match={match} /> : null
        }
        {completedSorted.length
          ? <InvestmentList isAdmin={this.props.isAdmin} handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={completedSorted} listOf="completed" listOfCount={completedSorted.length} match={match} /> : null
        }
        {getInvestorAccounts && !getInvestorAccounts.investments.pending.length
          && !getInvestorAccounts.investments.active.length
          && !getInvestorAccounts.investments.completed.length
          ? (
            <>
              <p>No investments or reservations pending.</p>
              <Card>
                <Card.Content>
                  <Header as={isTablet ? 'h5' : 'h4'}>Browse the latest investment opportunities.</Header>
                  <Button as={Link} target="_blank" to="/offerings" className={isUserAccountFrozen ? 'disabled' : ''} size="medium" color="green">Start investing now</Button>
                </Card.Content>
              </Card>
            </>
          ) : null
        }
        {this.routesList()}
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
      </>
    );
  }
}
