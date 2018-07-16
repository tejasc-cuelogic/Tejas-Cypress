import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { find } from 'lodash';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import ProgressCard from '../components/ProgressCard';
import IdentityVerification from './identityVerification';
import EstablishProfile from './establishProfile';
import AccountCreation from './accountCreation';

@inject('userDetailsStore', 'accountStore')
@observer
export default class AccountSetup extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails();
    const validPanes = [];
    const { inActiveAccounts } = this.props.userDetailsStore.signupStatus;
    const accTypesValues = this.props.accountStore.investmentAccTypes.fields.accType.values;
    inActiveAccounts.map((key) => {
      const acc = find(accTypesValues, { accType: key });
      if (acc) {
        validPanes.push(acc);
      }
      return validPanes;
    });
    if (inActiveAccounts.length !== 3) {
      this.props.accountStore.setInvestmentAccTypeValues(validPanes);
    }
  }

  navToAccTypes = (step) => {
    if (step) {
      this.props.history.push(`${this.props.match.url}/account-creation/${step}`);
    } else {
      this.props.history.push(`${this.props.match.url}/account-creation`);
    }
  }

  renderStep = (step) => {
    if (step === 0) {
      this.props.history.push(`${this.props.match.url}/identity-verification/0`);
    } else if (step === 1) {
      this.props.history.push(`${this.props.match.url}/establish-profile`);
    } else if (step === 2) {
      this.props.history.push(`${this.props.match.url}/account-creation`);
    }
  };

  render() {
    const { match } = this.props;
    const { signupStatus, currentUser, getStepStatus } = this.props.userDetailsStore;

    return (
      <PrivateLayout {...this.props} P5={<StickyNotification signupStatus={signupStatus} />}>
        <h3>Progress of your account creation</h3>
        {!(currentUser.data && currentUser.data.user) ? 'Loading..' : (
          <ProgressCard
            renderStep={this.renderStep}
            signupStatus={signupStatus}
            getStepStatus={getStepStatus}
            navToAccTypes={this.navToAccTypes}
          />
          )
        }
        <Switch>
          <Route exact path={`${match.url}/identity-verification/:step`} component={IdentityVerification} />
          <Route exact path={`${match.url}/establish-profile`} component={EstablishProfile} />
          <Route path={`${match.url}/account-creation`} component={AccountCreation} />
        </Switch>
      </PrivateLayout>
    );
  }
}
