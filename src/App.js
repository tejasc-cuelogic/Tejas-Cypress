import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from './theme/layout/Layout';
import Private from './containers/common/Private';
import Public from './containers/common/Public';
import authActions from './actions/auth';
import Spinner from './theme/ui/Spinner';
/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore', 'uiStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    authActions.verifySession()
      .then(() => {
        if (this.props.uiStore.redirectURL) {
          this.props.history.push(this.props.uiStore.redirectURL);
        }
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
    if (this.props.authStore.hasSession && this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <Layout>
          <Switch>
            <Route exact path="/app/*" component={Private} />
            <Route path="/" component={Public} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
