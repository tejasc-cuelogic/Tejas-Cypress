import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import './assets/semantic/semantic.min.css';
import Layout from './theme/layout/Layout';
import Private from './containers/common/Private';
import Public from './containers/common/Public';
import authActions from './actions/auth';
import Spinner from './theme/ui/Spinner';
import ListErrors from './theme/common/ListErrors';
/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    authActions.verifySession()
      .then(() => {
        if (this.props.uiStore.redirectURL) {
          this.props.history.push(this.props.uiStore.redirectURL);
        }
        this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
      })
      .then(() => this.props.uiStore.clearRedirectURL());
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
        <Layout>
          <Switch>
            <Route exact path="/app/*" component={Private} />
            <Route path="/" component={Public} />
          </Switch>
        </Layout>
        <ToastContainer className="toast-message" />
        <ListErrors errors={this.props.uiStore.errors} />
      </Aux>
    );
  }
}

export default App;
