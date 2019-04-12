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
    return (
      <Route
        component={
<<<<<<< HEAD
           ((processingAccLength === 0 &&
            partialAccLength >= 0 &&
=======
           ((partialAccLength >= 0 &&
>>>>>>> 91789048c4e91f00ee5fb329d72b719bb4a6324d
            activeAccLength === 0) ||
            (signupStatus.isMigratedFullAccount ||
            !isBasicVerDoneForMigratedFullUser ||
            !signupStatus.investorProfileCompleted))
          ? AccountSetup : Dashboard}
      />);
  }
}
