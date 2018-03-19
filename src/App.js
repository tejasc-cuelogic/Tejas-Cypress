import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
// import 'semantic-ui-css/semantic.min.css';
import { ToastContainer } from 'react-toastify';
import './assets/semantic/semantic.min.css';
// import './assets/app.css';
import Layout from './theme/layout/Layout';
import Private from './containers/common/Private';
import Public from './containers/common/Public';
import authActions from './actions/auth';
import Spinner from './theme/ui/Spinner';
import SuccessMessage from './components/common/SuccessMessage';
import ListErrors from './components/common/ListErrors';
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
    if (this.props.authStore.hasSession && this.props.uiStore.appLoader) {
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
        <ToastContainer />
        <ListErrors errors={this.props.uiStore.errors} />
        <SuccessMessage success={this.props.uiStore.success} />
      </div>
    );
  }
}

export default App;
