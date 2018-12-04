import React from 'react';
import Aux from 'react-aux';
import { Route, withRouter, Switch, matchPath } from 'react-router-dom';
import Login from './containers/Login';
import SignupInitial from './containers/SignupInitial';
import InvestorSignup from './containers/InvestorSignup';
import ConfirmEmailAddress from './containers/ConfirmEmailAddress';
import ChangePassword from './containers/ChangePassword';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import NotFound from '../shared/NotFound';

@withRouter
export default class Auth extends React.Component {
  render() {
    const allowed = ['login', 'register', 'register-investor', 'confirm-email', 'change-password', 'reset-password', 'forgot-password'];
    const { location } = this.props;
    return (
      <Aux>
        {(allowed.find(item => matchPath(location.pathname, { path: `/auth/${item}` }))) &&
        <section className="modalbg-banner" />}
        <Switch>
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={SignupInitial} />
          <Route path="/auth/register-investor" component={InvestorSignup} />
          <Route path="/auth/confirm-email" component={ConfirmEmailAddress} />
          <Route path="/auth/change-password" component={ChangePassword} />
          <Route path="/auth/reset-password" component={ResetPassword} />
          <Route path="/auth/forgot-password" component={ForgotPassword} />
          <Route component={NotFound} />
        </Switch>
      </Aux>
    );
  }
}
