import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import AccountSetup from '../accountSetup/containers/AccountSetup';
import Dashboard from './containers/Dashboard';

@inject('userDetailsStore')
@observer
export default class Summary extends Component {
  render() {
    const { signupStatus, isBasicVerDoneForMigratedFullUser } = this.props.userDetailsStore;
    const partialAccLength = signupStatus.partialAccounts.length;
    return (
      <Route
        component={
          (signupStatus.isMigratedFullAccount
            && (partialAccLength > 0 &&
            (!isBasicVerDoneForMigratedFullUser
            || !signupStatus.investorProfileCompleted)
            )) ?
        AccountSetup : Dashboard}
      />);
  }
}
