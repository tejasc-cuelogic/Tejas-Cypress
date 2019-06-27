import React from 'react';
import { Route, withRouter, Switch, matchPath } from 'react-router-dom';
import Login from './containers/Login';
import SignupInitial from './containers/SignupInitial';
import InvestorSignup from './containers/InvestorSignup';
import ConfirmEmailAddress from './containers/ConfirmEmailAddress';
import EmailWelcomeScreen from './containers/EmailWelcomeScreen';
import ChangePassword from './containers/ChangePassword';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import NotFound from '../shared/NotFound';

@withRouter
export default class Auth extends React.Component {
  render() {
    const allowed = ['login', 'register', 'register-investor', 'confirm-email', 'change-password', 'reset-password', 'forgot-password', 'welcome-email'];
    const { location } = this.props;
    return (
      <>
        {(allowed.find(item => matchPath(location.pathname, { path: `/auth/${item}` })))
        && <section className="modalbg-banner" />}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register/:type?" component={SignupInitial} />
          <Route path="/register-investor" component={InvestorSignup} />
          <Route path="/welcome-email" component={EmailWelcomeScreen} />
          <Route path="/confirm-email" component={ConfirmEmailAddress} />
          <Route path="/change-password" component={ChangePassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }
}
