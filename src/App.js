import React, { Component } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from './theme/layout/Layout';
import Home from './modules/home/containers/Home';

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
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
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
