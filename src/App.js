import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import './assets/semantic/semantic.min.css';
import DevPassProtected from './modules/auth/containers/DevPassProtected';
import DevBanner from './theme/common/DevBanner';
import Layout from './theme/layout/Layout';
import Private from './containers/common/Private';
import Public from './containers/common/Public';
import authActions from './actions/auth';
import activityActions from './actions/activity';
import Spinner from './theme/ui/Spinner';
import ListErrors from './theme/common/ListErrors';
/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore', 'uiStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    const { authStore, location, history } = this.props;
    if (authStore.devPasswdProtection && location.pathname !== '/password-protected') {
      history.push('/password-protected');
    }
    authActions.verifySession()
      .then(() => {
        if (this.props.uiStore.redirectURL) {
          history.push(this.props.uiStore.redirectURL);
        }
      })
      .then(() => this.props.uiStore.clearRedirectURL());
  }

  componentDidMount() {
    activityActions.log({ action: 'APP_LOAD', status: 'SUCCESS' });
  }

  componentDidUpdate(prevProps) {
    const isLoggingOut = prevProps.authStore.isUserLoggedIn && !this.props.authStore.isUserLoggedIn;
    const isLoggingIn = !prevProps.authStore.isUserLoggedIn && this.props.authStore.isUserLoggedIn;

    if (isLoggingIn) {
      this.props.history.push(this.props.uiStore.redireURL);
    } else if (isLoggingOut) {
      this.props.uiStore.clearRedirectURL();
      this.props.authStore.setUserLoggedIn(false);
    }
  }

  playDevBanner = () => this.props.uiStore.toggleDevBanner();
  render() {
    if (this.props.authStore.hasSession && this.props.uiStore.appLoader) {
      return (
        <Aux>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </Aux>
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
        <ListErrors errors={this.props.uiStore.errors} />
        {this.props.uiStore.devBanner &&
          <DevBanner toggle={this.playDevBanner} />
        }
      </Aux>
    );
  }
}

export default App;
