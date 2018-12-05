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
    const activeAccLength = signupStatus.activeAccounts.length;
    return (
      <Route
        component={(activeAccLength === 0
          || (signupStatus.isMigratedFullAccount
            && (!isBasicVerDoneForMigratedFullUser
            || !signupStatus.investorProfileCompleted)
            )) ?
        AccountSetup : Dashboard}
      />);
  }
}
