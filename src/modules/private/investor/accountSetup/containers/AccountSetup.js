import React, { Component } from 'react';
import { findKey } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import ConfirmPhoneNumber from '../../../../auth/containers/ConfirmPhoneNumber';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import EstablishProfile from './establishProfile';
import AccountCreation from './accountCreation';
import { InlineLoader } from '../../../../../theme/shared';
import CipVerification from './cipVerification/index';
import {
  INVESTMENT_ACCOUNT_TYPES,
} from '../../../../../constants/account';

const isMobile = document.documentElement.clientWidth < 768;
@inject('userDetailsStore', 'accountStore', 'portfolioStore', 'investorProfileStore', 'uiStore', 'userStore')
@observer
export default class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.setUserAccDetails(this.props.accountStore.investmentAccType);
    const { signupStatus, validAccTypes } = this.props.userDetailsStore;
    if (signupStatus.inActiveAccounts.length !== 3) {
      this.props.accountStore.setInvestmentAccTypeValues(validAccTypes);
    }
    if (signupStatus.activeAccounts.length !== 0
      && signupStatus.investorProfileCompleted) {
      this.props.portfolioStore.getSummary();
    }
    this.props.uiStore.clearErrors();
  }

  navToAccTypes = (step) => {
    if (step) {
      const accValue = findKey(INVESTMENT_ACCOUNT_TYPES, val => val === step);
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
    const { isInvestor } = this.props.userStore;
    return (
      <>
      {currentUser.loading
      ? <InlineLoader />
      : (
      <PrivateLayout
        {...this.props}
        forceTitle="Setup"
        P5={!signupStatus.finalStatus
          ? (
            <StickyNotification
              isInvestor={isInvestor}
              signupStatus={signupStatus}
              userDetailsStore={this.props.userDetailsStore}
            />
          ) : ''}
      >
        <Header as={isMobile ? 'h5' : 'h4'} className={isMobile ? 'mb-30 center-align' : 'mt-80 mb-30'}>{!signupStatus.finalStatus ? 'Complete your account setup' : ''}</Header>
        <ProgressCard
          {...this.props}
          isBasicVerDoneForMigratedFullUser={isBasicVerDoneForMigratedFullUser}
          signupStatus={signupStatus}
          getStepStatus={getStepStatus}
          navToAccTypes={this.navToAccTypes}
        />
        <Switch>
          <Redirect from="*/identity-verification/0" to="/dashboard/setup/cip" />
          <Route path={`${match.url}/cip`} component={CipVerification} />
          <Route exact path={`${match.url}/phone-verification`} component={ConfirmPhoneNumber} />
          <Route path={`${match.url}/establish-profile`} component={EstablishProfile} />
          <Route path={`${match.url}/account-creation`} component={AccountCreation} />
        </Switch>
      </PrivateLayout>
      )}
      </>
    );
  }
}
