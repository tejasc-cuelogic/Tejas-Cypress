import React, { Component } from 'react';
import { findKey, isEmpty } from 'lodash';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Header, Card } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import IdentityVerification from './identityVerification';
import EstablishProfile from './establishProfile';
import AccountCreation from './accountCreation';
import { InlineLoader } from '../../../../../theme/shared';
import {
  INVESTMENT_ACCOUNT_TYPES,
} from '../../../../../constants/account';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';
import CashMovement from '../../summary/components/CashMovement';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
const summaryDetails = ({
  totalInvested, pendingInvestments, paidToDate, tnar,
}) => {
  console.log(tnar);
  return {
    accountType: 'individual',
    title: false,
    summary: [
      {
        title: 'Total Invested', content: totalInvested, type: 1, info: 'Total Invested as of today',
      },
      {
        title: 'Pending Investment', content: pendingInvestments, type: 1, info: 'Pending Investment',
      },
      {
        title: 'Paid to Date', content: paidToDate, type: 1, info: 'Paid to Date',
      },
      {
        title: 'Simple Earnings %', content: `${tnar} %`, type: 0, info: 'Simple Earnings %',
      },
    ],
  };
};
@inject('userDetailsStore', 'accountStore', 'portfolioStore', 'investorProfileStore', 'uiStore')
@observer
export default class AccountSetup extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails(this.props.accountStore.investmentAccType);
    const { signupStatus, validAccTypes } = this.props.userDetailsStore;
    if (signupStatus.inActiveAccounts.length !== 3) {
      this.props.accountStore.setInvestmentAccTypeValues(validAccTypes);
    }
    // TODO change to regex
    if (!Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/])) {
      this.props.portfolioStore.getSummary();
    }
    this.props.uiStore.clearErrors();
  }

  navToAccTypes = (step) => {
    if (step) {
      const accValue =
      findKey(INVESTMENT_ACCOUNT_TYPES, val => val === step);
      this.props.accountStore.setAccTypeChange(accValue);
      this.props.history.push(`${this.props.match.url}/account-creation/${step}`);
    } else {
      this.props.history.push(`${this.props.match.url}/account-creation`);
    }
  }

  render() {
    const { match } = this.props;
    const {
      signupStatus,
      currentUser,
      getStepStatus,
      isBasicVerDoneForMigratedFullUser,
    } = this.props.userDetailsStore;
    const activeAccLength = signupStatus.activeAccounts.length;
    const { summaryLoading, summary } = this.props.portfolioStore;
    return (
      <PrivateLayout
        {...this.props}
        P5={!signupStatus.finalStatus ? !currentUser.loading ?
          <StickyNotification
            signupStatus={signupStatus}
            userDetailsStore={this.props.userDetailsStore}
          /> : <InlineLoader /> : ''}
      >
        <Header as="h4" className={isMobile ? 'mb-20' : ''}>{!signupStatus.finalStatus ? 'Complete your account setup' : ''}</Header>
        {!currentUser.loading ?
          <ProgressCard
            {...this.props}
            isBasicVerDoneForMigratedFullUser={isBasicVerDoneForMigratedFullUser}
            signupStatus={signupStatus}
            getStepStatus={getStepStatus}
            navToAccTypes={this.navToAccTypes}
          /> : <InlineLoader />

        }
        <Switch>
          <Route exact path={`${match.url}/identity-verification/:step`} component={IdentityVerification} />
          <Route path={`${match.url}/establish-profile`} component={EstablishProfile} />
          <Route path={`${match.url}/account-creation`} component={AccountCreation} />
        </Switch>
        {
          activeAccLength !== 0 && signupStatus.investorProfileCompleted ?
            summaryLoading ?
              <InlineLoader /> :
              <Aux>
                <Header as="h4">Values Performance</Header>
                <SummaryHeader details={summaryDetails(summary)} />
                { !isEmpty(summary.cashMovement) &&
                  <Card fluid>
                    <Card.Content>
                      <Header as="h4">Cash Movement from Inception</Header>
                      <CashMovement data={summary.cashMovement} />
                    </Card.Content>
                  </Card>
                }
              </Aux>
          : null
        }
      </PrivateLayout>
    );
  }
}
