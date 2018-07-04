import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import IdentityVerification from './identityVerification';
import EstablishProfile from './establishProfile';
import AccountCreation from './accountCreation';

export default class AccountSetup extends Component {
  renderStep = (step) => {
    if (step === 0) {
      this.props.history.push(`${this.props.match.url}/identity-verification/0`);
    } else if (step === 1) {
      this.props.history.push(`${this.props.match.url}/establish-profile`);
    } else if (step === 2) {
      this.props.history.push(`${this.props.match.url}/account-types`);
    }
  };

  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props} P5={<StickyNotification />}>
        <h3>Progress of your account creation</h3>
        <ProgressCard
          renderStep={this.renderStep}
        />
        <Switch>
          <Route exact path={`${match.url}/identity-verification/:step`} component={IdentityVerification} />
          <Route exact path={`${match.url}/establish-profile`} component={EstablishProfile} />
          <Route exact path={`${match.url}/account-types`} component={AccountCreation} />
        </Switch>
      </PrivateLayout>
    );
  }
}
