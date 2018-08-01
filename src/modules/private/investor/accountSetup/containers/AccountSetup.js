import React, { Component } from 'react';
import { findKey } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import IdentityVerification from './identityVerification';
import EstablishProfile from './establishProfile';
import AccountCreation from './accountCreation';
import {
  INVESTMENT_ACCOUNT_TYPES,
} from '../../../../../constants/account';
@inject('userDetailsStore', 'accountStore')
@observer
export default class AccountSetup extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails(this.props.accountStore.investmentAccType);
    const { signupStatus, validAccTypes } = this.props.userDetailsStore;
    if (signupStatus.inActiveAccounts.length !== 3) {
      this.props.accountStore.setInvestmentAccTypeValues(validAccTypes);
    }
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
    const { signupStatus, currentUser, getStepStatus } = this.props.userDetailsStore;

    return (
      <PrivateLayout
        {...this.props}
        P5={!signupStatus.finalStatus ? !currentUser.loading ?
          <StickyNotification signupStatus={signupStatus} /> : 'Loading...' : ''}
      >
        <Header as="h4">{!signupStatus.finalStatus ? 'Complete your account setup' : ''}</Header>
        {!currentUser.loading ?
          <ProgressCard
            {...this.props}
            signupStatus={signupStatus}
            getStepStatus={getStepStatus}
            navToAccTypes={this.navToAccTypes}
          /> : 'Loading...'
        }
        <Switch>
          <Route exact path={`${match.url}/identity-verification/:step`} component={IdentityVerification} />
          <Route path={`${match.url}/establish-profile`} component={EstablishProfile} />
          <Route path={`${match.url}/account-creation`} component={AccountCreation} />
        </Switch>
      </PrivateLayout>
    );
  }
}
