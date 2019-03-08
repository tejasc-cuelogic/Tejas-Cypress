import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Grid, Card, Button } from 'semantic-ui-react';
import SummaryHeader from '../components/portfolio/SummaryHeader';
import PortfolioAllocations from '../components/portfolio/PortfolioAllocations';
import InvestmentList from '../components/portfolio/InvestmentList';
import InvestmentDetails from './InvestmentDetails';
import CancelInvestment from '../components/portfolio/CancelInvestment';
import { InlineLoader } from '../../../../../theme/shared';
import InvestNow from '../../../../public/offering/components/investNow/InvestNow';
import Agreement from '../../../../public/offering/components/investNow/agreement/components/Agreement';
import Congratulation from '../../../../public/offering/components/investNow/agreement/components/Congratulation';
import ChangeInvestmentLimit from '../../../../public/offering/components/investNow/ChangeInvestmentLimit';

@inject('portfolioStore')
@observer
export default class Portfolio extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getInvestorAccountPortfolio(accountType);
    this.props.portfolioStore.calculateInvestmentType();
  }
  render() {
    const { match, portfolioStore } = this.props;
    if (portfolioStore.loading) {
      return <InlineLoader />;
    }
    const { getInvestorAccounts, getPieChartData } = portfolioStore;
    const summaryDetails = {
      accountType: includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: getInvestorAccounts && getInvestorAccounts.totalBalance, type: 1, info: 'Available cash includes funds that are immediately available for investment. This includes pending incoming deposits and investment credits.',
        },
        {
          title: 'Net Deposits', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Deposits made from your external accounts, minus withdrawals.',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.netPayments, type: 1, info: 'Payments received to date from all prior investments, minus NextSeed fees.',
        },
        {
          title: 'TNAR', content: getInvestorAccounts && getInvestorAccounts.tnar, type: 1, info: 'The Total Net Annualized Return (TNAR) approximates the overall financial return on your investment portfolio. See the Education Center [link to Education Center article] for a full explanation of how TNAR is calculated.',
        },
      ],
    };
    return (
      <Aux>
        <SummaryHeader details={summaryDetails} />
        <PortfolioAllocations pieChart={getPieChartData} />
        <Header as="h4">My Investments</Header>
        {getInvestorAccounts && getInvestorAccounts.investments.pending.length ?
          <InvestmentList investments={getInvestorAccounts.investments.pending} listOf="pending" listOfCount={getInvestorAccounts.investments.pending.length} match={match} /> : null
        }
        {getInvestorAccounts && getInvestorAccounts.investments.active.length ?
          <InvestmentList investments={getInvestorAccounts.investments.active} listOf="active" listOfCount={getInvestorAccounts.investments.active.length} match={match} /> : null
        }
        {getInvestorAccounts && getInvestorAccounts.investments.completed.length ?
          <InvestmentList investments={getInvestorAccounts.investments.completed} listOf="completed" listOfCount={getInvestorAccounts.investments.completed.length} match={match} /> : null
        }
        {getInvestorAccounts && !getInvestorAccounts.investments.pending.length &&
        !getInvestorAccounts.investments.active.length &&
        !getInvestorAccounts.investments.completed.length ?
          <Aux>
            <p>No investments or reservations pending.</p>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={4} largeScreen={4} computer={4} tablet={8} mobile={16}>
                  <Card className="form-card" fluid>
                    <Card.Content>
                      <Header as="h4">Browse the latest investment opportunities.</Header>
                      <Button as={Link} to="/offerings" size="medium" color="green">Start investing now</Button>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
      </Aux>
    );
  }
}
