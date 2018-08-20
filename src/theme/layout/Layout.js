import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, withRouter, Switch } from 'react-router-dom';
import Header from './Header';
import { authActions } from '../../services/actions';
import Login from '../../modules/auth/containers/Login';
import SignupInitial from '../../modules/auth/containers/SignupInitial';
import InvestorSignup from '../../modules/auth/containers/InvestorSignup';
import ConfirmEmailAddress from '../../modules/auth/containers/ConfirmEmailAddress';
import ChangePassword from '../../modules/auth/containers/ChangePassword';
import ForgotPassword from '../../modules/auth/containers/ForgotPassword';
import ResetPassword from '../../modules/auth/containers/ResetPassword';
import Helper from '../../helper/utility';

@inject('userStore', 'uiStore', 'navStore', 'businessAppStore')
@withRouter
@observer
class Layout extends Component {
  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }
  preQualSubmit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessPreQualificationFormSumbit(true).then(() => {
      const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
      Helper.toast('Business pre-qualification request submitted!', 'success');
      this.props.history.push(`/business-application/${url}`);
    });
  }

  render() {
    const { location } = this.props;
    const { BUSINESS_APP_FRM, isPrequalQulify } = this.props.businessAppStore;
    const { isValid } = BUSINESS_APP_FRM.meta;
    const { inProgress } = this.props.uiStore;
    return (
      <Aux>
        {(!this.props.userStore.currentUser || !location.pathname.startsWith('/app')) &&
          <Header
            location={location}
            navStatus={this.props.navStore.navStatus}
            currentUser={this.props.userStore.currentUser}
            handleLogOut={this.handleLogOut}
            canSubmitApp={isValid}
            isPrequalQulify={isPrequalQulify}
            preQualSubmit={this.preQualSubmit}
            loading={inProgress}
          />
        }
        {this.props.children}
        {location.pathname.startsWith('/auth') &&
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/register" component={SignupInitial} />
            <Route path="/auth/register-investor" component={InvestorSignup} />
            <Route path="/auth/confirm-email" component={ConfirmEmailAddress} />
            <Route path="/auth/change-password" component={ChangePassword} />
            <Route path="/auth/reset-password" component={ResetPassword} />
            <Route path="/auth/forgot-password" component={ForgotPassword} />
          </Switch>
        }
      </Aux>
    );
  }
}

export default Layout;
