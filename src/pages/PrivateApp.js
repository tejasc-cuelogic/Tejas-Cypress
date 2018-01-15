import React from 'react';
import { inject, observer } from 'mobx-react';
// import { Switch, Router, withRouter, BrowserRouter } from 'react-router-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
// import { privateRoutes } from './pages';

import { privateRoutes } from './pages';
// import Header from '../components/common/Header';

@inject('adminStore', 'commonStore', 'userStore')
@withRouter
@observer
export default class PrivateApp extends React.Component {
  render() {
    const { adminHome } = privateRoutes;
    return (
      <div>
        <Switch>
          {/* eslint-disable react/no-array-index-key */}
          <Route
            path={adminHome.path}
            component={
              (adminHome.auth) ?
              adminHome.auth(adminHome.component, this.props) :
              adminHome.component}
          >
            {privateRoutes.adminRoutes.map((route, index) => (
              <Route
                path={route.path}
                component={(route.auth) ? route.auth(route.component, this.props) : route.component}
                key={index}
              />
            ))}
          </Route>
        </Switch>
      </div>
    );
  }
}
