import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { publicRoutes } from './pages';

@inject('commonStore', 'userStore')
@withRouter
@observer
export default class PublicApp extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/* eslint-disable react/no-array-index-key */}
          {publicRoutes.map((route, index) => (
            <Route
              path={route.path}
              component={(route.auth) ? route.auth(route.component, this.props) : route.component}
              key={index}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
