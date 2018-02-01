import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'; // Redirect
import { inject, observer } from 'mobx-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from './theme/layout/Layout';
import Routes from './modules/routes';

/**
 * Main App
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
class App extends Component {
  render() {
    const routes = (
      <Switch>
        {Routes.map(route => (
          <Route
            exact={route.exact ? route.exact : false}
            path={route.path}
            component={(route.auth) ? route.auth(route.component, this.props) : route.component}
            key={route.path}
          />
        ))}
      </Switch>
    );

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

export default App;
