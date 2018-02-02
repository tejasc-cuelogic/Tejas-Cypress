import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from './theme/layout/Layout';
import Routes from './modules/routes';
// import SessionCheckContainer from './modules/SessionCheckContainer';
import authActions from './actions/auth';
/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore', 'uiStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    authActions.verifySession();
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
    console.log(this.props.userStore.currentUser);
    return (
      <div>
        <Layout>
          <Switch>
            {Routes.map(route => (
              <Route
                exact={route.exact ? route.exact : false}
                path={route.path}
                component={(route.auth) ?
                  route.auth(route.component, this.props) : route.component}
                key={route.path}
              />
            ))}
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
