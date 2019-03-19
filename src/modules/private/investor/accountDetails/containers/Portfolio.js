import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { includes, orderBy, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Card, Button } from 'semantic-ui-react';
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

@inject('portfolioStore', 'transactionStore', 'userDetailsStore')
@observer
export default class Portfolio extends Component {
  state = {
    open: false,
    embedUrl: '',
    inActiveItems: [],
  };
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
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
    this.props.transactionStore.getDocuSignViewURL(aggrementId).then((res) => {
      this.setState({
        open: true,
        embedUrl: res,
      });
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
  render() {
    const { match, portfolioStore, userDetailsStore } = this.props;
    const isUserAccountFrozen = userDetailsStore.isAccountFrozen;
    if (portfolioStore.loading) {
      return <InlineLoader />;
    }
    const { getInvestorAccounts, getPieChartData } = portfolioStore;
    const summaryDetails = {
      isAccountFrozen: isUserAccountFrozen,
      accountType: includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: getInvestorAccounts && getInvestorAccounts.totalBalance, type: 1, info: 'Available cash includes funds that are immediately available for investment. This includes pending incoming deposits and investment credits but excludes pending investments.',
        },
        {
          title: 'Net Deposits', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Deposits made from your external accounts, minus withdrawals.',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.netPayments, type: 1, info: 'Payments received to date from all prior investments, minus NextSeed fees.',
        },
        {
          title: 'TNAR', content: getInvestorAccounts && getInvestorAccounts.tnar, type: 1, info: <span>The Total Net Annualized Return (TNAR) approximates the overall financial return on your investment portfolio. See the <Link to="/resources/education-center">Education Center</Link> for a full explanation of how TNAR is calculated.</span>,
        },
      ],
    };
    const pendingSorted = getInvestorAccounts && getInvestorAccounts.investments.pending.length ? orderBy(getInvestorAccounts.investments.pending, o => DataFormatter.diffDays(o.offering.offering.launch.terminationDate), ['asc']) : [];
    const activeSorted = getInvestorAccounts && getInvestorAccounts.investments.active.length ? orderBy(getInvestorAccounts.investments.active, o => get(o, 'offering.offering.launch.terminationDate') && moment(new Date(o.offering.offering.launch.terminationDate)).unix(), ['desc']) : [];
    const completedSorted = getInvestorAccounts && getInvestorAccounts.investments.completed.length ? orderBy(getInvestorAccounts.investments.completed, o => get(o, 'offering.offering.launch.terminationDate') && moment(new Date(o.offering.offering.launch.terminationDate)).unix(), ['desc']) : [];
    return (
      <Aux>
        <SummaryHeader details={summaryDetails} />
        {(getPieChartData.investmentType.length || getPieChartData.industry.length) ?
          <PortfolioAllocations pieChart={getPieChartData} /> : ''
        }
        <Header as="h4">My Investments</Header>
        {pendingSorted.length ?
          <InvestmentList isAccountFrozen={isUserAccountFrozen} viewAgreement={this.viewLoanAgreement} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={pendingSorted} listOf="pending" listOfCount={getInvestorAccounts.investments.pending.length} match={match} /> : null
        }
        {activeSorted.length ?
          <InvestmentList isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={activeSorted} listOf="active" listOfCount={getInvestorAccounts.investments.active.length} match={match} /> : null
        }
        {completedSorted.length ?
          <InvestmentList isAccountFrozen={isUserAccountFrozen} inActiveItems={this.state.inActiveItems} toggleAccordion={this.toggleAccordion} investments={completedSorted} listOf="completed" listOfCount={getInvestorAccounts.investments.completed.length} match={match} /> : null
        }
        {getInvestorAccounts && !getInvestorAccounts.investments.pending.length &&
        !getInvestorAccounts.investments.active.length &&
        !getInvestorAccounts.investments.completed.length ?
          <Aux>
            <p>No investments or reservations pending.</p>
            <Card.Group itemsPerRow={4} stackable doubling>
              <Card fluid>
                <Card.Content>
                  <Header as="h4">Browse the latest investment opportunities.</Header>
                  <Button as={Link} to="/offerings" className={userDetailsStore.isAccountFrozen ? 'disabled' : ''} size="medium" color="green">Start investing now</Button>
                </Card.Content>
              </Card>
            </Card.Group>
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
        <Route path={`${match.url}/:offeringId/agreement/change-investment-limit`} render={props => <ChangeInvestmentLimit changeInvestment refLink={`${match.url}/:offeringId/agreement`} {...props} />} />
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
