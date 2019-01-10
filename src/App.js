import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter, Switch, Route, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import './assets/semantic/semantic.min.css';
import DevPassProtected from './modules/auth/containers/DevPassProtected';
import { DevBanner, Spinner } from './theme/shared';
import Layout from './theme/layout/Layout';
import Private from './modules/private';
import Public from './modules/public';
import SecureGateway from './modules/public/shared/SecureGateway';
import { authActions, activityActions } from './services/actions';
/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore', 'uiStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    const { authStore, location, history } = this.props;
    this.props.authStore.setFieldvalue('isOfferPreviewUrl', location.pathname.includes('preview'));
    if (authStore.devPasswdProtection && location.pathname !== '/password-protected') {
      history.push('/password-protected');
    }
    authActions.verifySession()
      .then(() => {
        if (this.props.uiStore.redirectURL) {
          history.push(this.props.uiStore.redirectURL);
        }
        if (this.props.userStore.currentUser) {
          this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
        }
      });
  }

  componentDidMount() {
    if (this.props.uiStore.devBanner) {
      activityActions.log({ action: 'APP_LOAD', status: 'SUCCESS' });
    }
  }

  componentDidUpdate(prevProps) {
    const isLoggingOut = prevProps.authStore.isUserLoggedIn && !this.props.authStore.isUserLoggedIn;
    const isLoggingIn = !prevProps.authStore.isUserLoggedIn && this.props.authStore.isUserLoggedIn;
    const calculations = {
      topVisible: true,
      direction: 'up',
      bottomPassed: true,
      isMoveTop: true,
    };
    if (isLoggingIn) {
      this.props.history.push(this.props.uiStore.redireURL);
    } else if (isLoggingOut) {
      this.props.uiStore.clearRedirectURL();
      this.props.authStore.setUserLoggedIn(false);
    }
    window.scrollTo(0, 0);
    this.props.navStore.setNavStatus(calculations);
  }

  playDevBanner = () => this.props.uiStore.toggleDevBanner();
  render() {
    const { location } = this.props;
    if (matchPath(location.pathname, { path: '/secure-gateway' })) {
      return (
        <Route path="/secure-gateway" component={SecureGateway} />
      );
    }
    if (this.props.authStore.hasSession && this.props.uiStore.appLoader) {
      return (
        <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
      );
    }
    return (
      <Aux>
        {this.props.authStore.devPasswdProtection ?
          <Route exact path="/password-protected" component={DevPassProtected} /> : (
            <Layout>
              <Switch>
                <Route exact path="/app/*" component={Private} />
                <Route path="/" component={Public} />
              </Switch>
            </Layout>
          )
        }
        <ToastContainer className="toast-message" />
        {this.props.uiStore.devBanner &&
          <DevBanner toggle={this.playDevBanner} />
        }
      </Aux>
    );
  }
}

export default App;
