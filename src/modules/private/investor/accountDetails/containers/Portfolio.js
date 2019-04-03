import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { includes, orderBy, get, filter } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Card, Button } from 'semantic-ui-react';
import money from 'money-math';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import { DataFormatter } from '../../../../../helper';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';
import CancelInvestment from '../components/portfolio/CancelInvestment';
import { InlineLoader, IframeModal } from '../../../../../theme/shared';
import InvestNow from '../../../../public/offering/components/investNow/InvestNow';
import Agreement from '../../../../public/offering/components/investNow/agreement/components/Agreement';
import Congratulation from '../../../../public/offering/components/investNow/agreement/components/Congratulation';
import ChangeInvestmentLimit from '../../../../public/offering/components/investNow/ChangeInvestmentLimit';
import AccountHeader from '../../../admin/userManagement/components/manage/accountDetails/AccountHeader';

@inject('portfolioStore', 'transactionStore', 'userDetailsStore', 'uiStore', 'campaignStore')
@observer
export default class Portfolio extends Component {
  state = {
    open: false,
    embedUrl: '',
    inActiveItems: [],
  };
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { setFieldValue } = this.props.userDetailsStore;
    setFieldValue('currentActiveAccount', accountType);
    this.props.portfolioStore.setFieldValue('isAdmin', this.props.isAdmin);
    this.props.portfolioStore.getInvestorAccountPortfolio(accountType);
    this.props.portfolioStore.calculateInvestmentType();
    window.addEventListener('message', this.docuSignListener);
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
  toggleAccordion = (of) => {
    const { inActiveItems } = this.state;
    const updatedList = inActiveItems.includes(of) ? inActiveItems.filter(i => i !== of) :
      [...inActiveItems, of];
    this.setState({ inActiveItems: updatedList });
  }
  handleViewInvestment = (id) => {
    if (id) {
      const redirectURL = `${this.props.match.url}/investment-details/${id}`;
      this.props.history.push(redirectURL);
    }
  }
  handleInvestNowOnChangeClick = (e, id) => {
    const redirectURL = `${this.props.match.url}/${id}/invest-now`;
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(redirectURL);
  }
  render() {
    const { match, portfolioStore, userDetailsStore } = this.props;
    const isUserAccountFrozen = userDetailsStore.isAccountFrozen;
    if (portfolioStore.loading) {
      return <InlineLoader />;
    }
    const { getInvestorAccounts, getPieChartData } = portfolioStore;
    const tnarValue = get(getInvestorAccounts, 'tnar');
    const summaryDetails = {
      isAccountFrozen: isUserAccountFrozen,
      accountType: includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: getInvestorAccounts && getInvestorAccounts.totalBalance, type: 1, info: 'Total Balance includes funds that are immediately available for investment. This includes pending incoming deposits, but excludes investment credits and pending investments.',
        },
        {
          title: 'Net Deposits', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Deposits made from your external accounts, minus withdrawals.',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.netPayments, type: 1, info: 'Payments received to date from all prior investments, minus NextSeed fees.',
        },
        {
          title: 'TNAR', content: tnarValue && !money.isZero(tnarValue) ? tnarValue : 'N/A', type: 1, info: <span>The Total Net Annualized Return (TNAR) approximates the overall financial return on your investment portfolio. See the <Link target="_blank" to="/resources/education-center">Education Center</Link> for a full explanation of how TNAR is calculated.</span>,
        },
      ],
    };
    const pendingSorted = getInvestorAccounts && getInvestorAccounts.investments.pending.length ? orderBy(getInvestorAccounts.investments.pending, o => get(o, 'offering.closureSummary.processingDate') && DataFormatter.diffDays(get(o, 'offering.closureSummary.processingDate')), ['asc']) : [];
    const activeSorted = getInvestorAccounts && getInvestorAccounts.investments.active.length ? orderBy(getInvestorAccounts.investments.active, o => get(o, 'offering.closureSummary.processingDate') && moment(new Date(o.offering.closureSummary.processingDate)).unix(), ['desc']) : [];
    let completedSorted = getInvestorAccounts && getInvestorAccounts.investments.completed.length ? orderBy(getInvestorAccounts.investments.completed, o => get(o, 'offering.closureSummary.processingDate') && moment(new Date(o.offering.closureSummary.processingDate)).unix(), ['desc']) : [];
    completedSorted = filter(completedSorted, o => get(o, 'offering.stage') !== 'TERMINATED');
    return (
      <Aux>
        {this.props.isAdmin &&
          <AccountHeader module="Investments" pathname={this.props.location.pathname} />
        }
        <SummaryHeader isAdmin={this.props.isAdmin} details={summaryDetails} />
        {(getPieChartData.investmentType.length || getPieChartData.industry.length) ?
          <PortfolioAllocations pieChart={getPieChartData} /> : ''
        }
        <Header as="h4">My Investments</Header>
        {pendingSorted.length ?
          <InvestmentList handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} viewAgreement={this.viewLoanAgreement} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={pendingSorted} listOf="pending" listOfCount={getInvestorAccounts.investments.pending.length} match={match} /> : null
        }
        {activeSorted.length ?
          <InvestmentList handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={activeSorted} listOf="active" listOfCount={getInvestorAccounts.investments.active.length} match={match} /> : null
        }
        {completedSorted.length ?
          <InvestmentList handleInvestNowClick={this.handleInvestNowOnChangeClick} handleViewInvestment={this.handleViewInvestment} isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={completedSorted} listOf="completed" listOfCount={getInvestorAccounts.investments.completed.length} match={match} /> : null
        }
        {getInvestorAccounts && !getInvestorAccounts.investments.pending.length &&
        !getInvestorAccounts.investments.active.length &&
        !getInvestorAccounts.investments.completed.length ?
          <Aux>
            <p>No investments or reservations pending.</p>
            <Card>
              <Card.Content>
                <Header as="h4">Browse the latest investment opportunities.</Header>
                <Button as={Link} to="/offerings" className={isUserAccountFrozen ? 'disabled' : ''} size="medium" color="green">Start investing now</Button>
              </Card.Content>
            </Card>
          </Aux> : null
        }
        <Route
          path={`${match.url}/investment-details/:id`}
          render={props => <InvestmentDetails refLink={match.url} {...props} />}
        />
        <Route
          path={`${match.url}/:offeringId/invest-now`}
          render={props => <InvestNow changeInvest refLink={match.url} {...props} />}
        />
        <Route path={`${match.url}/:offeringId/agreement`} render={() => <Agreement changeInvestment refLink={match.url} />} />
        <Route path={`${match.url}/:offeringId/congratulation`} render={() => <Congratulation changeInvestment />} />
        <Route path={`${match.url}/:offeringId/agreement/change-investment-limit`} render={props => <ChangeInvestmentLimit changeInvestment refLink={`${match.url}`} {...props} />} />
        <Route
          path={`${match.url}/cancel-investment/:id`}
          render={props => <CancelInvestment accType={includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity'} refLink={match.url} {...props} />}
        />
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
      </Aux>
    );
  }
}
