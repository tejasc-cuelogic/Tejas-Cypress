import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import IdentityVerification from './identityVerification';

export default class AccountSetup extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props} P5={<StickyNotification />}>
        <h3>Progress of your account creation</h3>
        <ProgressCard />
        <Switch>
          <Route exact path={`${match.url}/identity-verification/:step`} component={IdentityVerification} />
        </Switch>
      </PrivateLayout>
    );
  }
}
