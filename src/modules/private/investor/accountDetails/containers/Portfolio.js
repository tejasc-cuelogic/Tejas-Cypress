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

@inject('portfolioStore')
@observer
export default class Portfolio extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location, 'individual') ? 'individual' : includes(this.props.location, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getInvestorAccountPortfolio(accountType);
  }
  render() {
    const { match, portfolioStore } = this.props;
    if (portfolioStore.loading) {
      return <InlineLoader />;
    }
    const { getInvestorAccounts, calculateInvestmentType } = portfolioStore;
    const summaryDetails = {
      accountType: includes(this.props.location, 'individual') ? 'individual' : includes(this.props.location, 'ira') ? 'ira' : 'entity',
      className: 'investment-summary',
      summary: [
        {
          title: 'Total Balance', content: getInvestorAccounts && getInvestorAccounts.totalBalance, type: 1, info: 'Your Total Balance as of today',
        },
        {
          title: 'Total Deposit', content: getInvestorAccounts && getInvestorAccounts.totalDeposit, type: 1, info: 'Your Total Deposit as of today',
        },
        {
          title: 'Net Payments', content: getInvestorAccounts && getInvestorAccounts.netPayments, type: 1, info: 'Your Net Payments as of today',
        },
        {
          title: 'TNAR', content: getInvestorAccounts && getInvestorAccounts.tnar, type: 1, info: 'Your TNAR as of today',
        },
      ],
    };
    console.log(calculateInvestmentType);
    return (
      <Aux>
        <SummaryHeader details={summaryDetails} />
        <PortfolioAllocations pieChart={calculateInvestmentType} />
        <Header as="h4">My Investments</Header>
        {getInvestorAccounts && getInvestorAccounts.investments.pending.length ?
          <InvestmentList investments={getInvestorAccounts.investments.pending} listOf="pending" match={match} /> : null
        }
        {getInvestorAccounts && getInvestorAccounts.investments.active.length ?
          <InvestmentList investments={getInvestorAccounts.investments.active} listOf="active" match={match} /> : null
        }
        {getInvestorAccounts && getInvestorAccounts.investments.completed.length ?
          <InvestmentList investments={getInvestorAccounts.investments.completed} listOf="completed" match={match} /> : null
        }
        {getInvestorAccounts && !getInvestorAccounts.investments.pending.length &&
        !getInvestorAccounts.investments.active.length &&
        !getInvestorAccounts.investments.completed.length ?
          <Aux>
            <p>No investments or reservations pending.</p>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={8} largeScreen={11} computer={13} tablet={16} mobile={16}>
                  <Card className="form-card">
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
          path={`${match.url}/cancel-investment/:id`}
          render={props => <CancelInvestment refLink={match.url} {...props} />}
        />
      </Aux>
    );
  }
}
