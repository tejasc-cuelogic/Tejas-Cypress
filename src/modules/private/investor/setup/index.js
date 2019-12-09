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
    const activeAccLength = signupStatus.activeAccounts.length;
    const processingAccLength = signupStatus.processingAccounts.length;
    const frozenAccLength = signupStatus.frozenAccounts.length;
    const inActivAccLength = signupStatus.inActiveAccounts.length;
    return (
      <Route
        component={
           ((processingAccLength === 0
            && partialAccLength >= 0
            && frozenAccLength === 0
            && activeAccLength === 0
            && inActivAccLength !== 0)
            || (signupStatus.isMigratedFullAccount
            && !isBasicVerDoneForMigratedFullUser)
            || !signupStatus.investorProfileCompleted
           )
             ? AccountSetup : Dashboard}
      />
    );
  }
}