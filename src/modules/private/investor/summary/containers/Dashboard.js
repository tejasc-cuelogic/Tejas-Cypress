import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { Header, Card, Button, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../theme/shared';
import PrivateLayout from '../../../shared/PrivateLayout';
import CashMovement from '../components/CashMovement';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';
import AccountCreation from './../../accountSetup/containers/accountCreation';
import IdentityVerification from './../../accountSetup/containers/identityVerification';
import EstablishProfile from './../../accountSetup/containers/establishProfile';
import Helper from '../../../../../helper/utility';

const summaryDetails = ({
  totalInvested, pendingInvestments, paidToDate, tnar,
}) => {
  console.log(tnar);
  return {
    accountType: 'individual',
    title: false,
    summary: [
      {
        title: 'Total Invested', content: totalInvested || '', type: 1, info: 'Includes all investments made in successfully closed offerings. Does not include reservations or commitments in live offerings.',
      },
      {
        title: 'Pending Investment', content: pendingInvestments || '', type: 1, info: 'Includes amounts reserved or committed in live offerings.',
      },
      {
        title: 'Paid to Date', content: paidToDate || '', type: 1, info: 'Net payments received to date from all prior investments.',
      },
      {
        title: 'TNAR', content: tnar ? `${tnar}%` : '', type: 0, info: <span>Net Annualized Return (&quot;NAR&quot;) measures the current financial return of each investment in your portfolio. Per investment, NAR is calculated as an annualized measure of the rate of return on the principal invested over the life of that investment, calculated based on actual cash payments received each month. We offer different types of debt investments, and NAR is calculated differently for each investment product to better reflect the underlying characteristics. Total Net Annualized Return (&quot;TNAR&quot;) approximates the overall financial return on your investment portfolio. TNAR is a weighted average of NARS on all current investments in your portfolio. See <Link to="/resources/education-center">Education Center</Link> to learn more about how NAR and TNAR are calculated.</span>,
      },
    ],
  };
};

@inject('userDetailsStore', 'portfolioStore')
@observer
export default class Dashboard extends Component {
  componentWillMount() {
    // TODO change to regex
    if (!Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/])) {
      this.props.portfolioStore.getSummary();
    }
  }
  render() {
    const { summaryLoading, summary, getChartData } = this.props.portfolioStore;
    const cashMovementData = getChartData('cashMovement');
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
          P4={
            <Button secondary as={Link} to="/offerings" content="Invest Now" />
          }
        >
          <Header as="h4">Portfolio Summary</Header>
          <SummaryHeader details={summaryDetails(summary)} />
          {
              cashMovementData && cashMovementData.length ?
                <Aux>
                  <Card fluid>
                    <Card.Content>
                      <Header as="h4">Cash Movement from Inception</Header>
                      <CashMovement data={cashMovementData} />
                    </Card.Content>
                  </Card>
                </Aux>
              :
                <Aux>
                  <Card>
                    <Card.Content>
                      <Header as="h4" className="mt-10">Browse the latest investment opportunities.</Header>
                      <Button fluid as={Link} compact to="/offerings" size="large" color="green" className="mb-10">Start investing now</Button>
                      <Divider hidden />
                    </Card.Content>
                  </Card>
                </Aux>
            }
        </PrivateLayout>
      </Aux>
    );
  }
}
