import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';

import routes from './routes';

@inject('adminStore', 'commonStore', 'userStore')
@withRouter
@observer
export default class PrivateApp extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/* eslint-disable react/no-array-index-key */}
          {routes.map((route, index) => (
            <Route
              path={route.path}
              component={route.component}
              key={index}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
