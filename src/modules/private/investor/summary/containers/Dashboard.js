import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Header, Card } from 'semantic-ui-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../theme/shared';
import PrivateLayout from '../../../shared/PrivateLayout';
import CashMovement from '../components/CashMovement';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';
import AccountCreation from './../../accountSetup/containers/accountCreation';
import IdentityVerification from './../../accountSetup/containers/identityVerification';
import EstablishProfile from './../../accountSetup/containers/establishProfile';

const summaryDetails = ({
  totalInvested, pendingInvestments, paidToDate, tnar,
}) => {
  console.log(tnar);
  return {
    accountType: 'individual',
    title: false,
    summary: [
      {
        title: 'Total Invested', content: totalInvested, type: 1, info: 'Includes all investments made in successfully closed offerings. Does not include reservations or commitments in live offerings.',
      },
      {
        title: 'Pending Investment', content: pendingInvestments, type: 1, info: 'Includes amounts reserved or committed in live offerings.',
      },
      {
        title: 'Paid to Date', content: paidToDate, type: 1, info: 'Net payments received to date from all prior investments.',
      },
      {
        title: 'TNAR', content: `${tnar} %`, type: 0, info: 'Net Annualized Return ("NAR") measures the current financial return of each investment in your portfolio. Per investment, NAR is calculated as an annualized measure of the rate of return on the principal invested over the life of that investment, calculated based on actual cash payments received each month. We offer different types of debt investments, and NAR is calculated differently for each investment product to better reflect the underlying characteristics. Total Net Annualized Return ("TNAR") approximates the overall financial return on your investment portfolio. TNAR is a weighted average of NARS on all current investments in your portfolio. See Education Center to learn more about how NAR and TNAR are calculated.',
      },
    ],
  };
};

@inject('userDetailsStore', 'portfolioStore')
@observer
export default class Dashboard extends Component {
  componentWillMount() {
    this.props.portfolioStore.getSummary();
  }
  render() {
    const { summaryLoading, summary, cashMovement } = this.props.portfolioStore;
    if (summaryLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Route path="/app/summary/account-creation" component={AccountCreation} />
        <Route exact path="/app/summary/identity-verification/:step" component={IdentityVerification} />
        <Route path="/app/summary/establish-profile" component={EstablishProfile} />
        <PrivateLayout
          {...this.props}
        >
          <Header as="h4">Values Performance</Header>
          <SummaryHeader details={summaryDetails(summary)} />
          <Card fluid>
            <Card.Content>
              <Header as="h4">Cash Movement, LTM</Header>
              <CashMovement data={cashMovement()} />
            </Card.Content>
          </Card>
        </PrivateLayout>
      </Aux>
    );
  }
}
