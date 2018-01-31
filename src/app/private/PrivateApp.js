import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';

import routes from './routes';
import authActions from './../../actions/auth';

@inject('adminStore', 'authStore', 'commonStore', 'userStore')
@withRouter
@observer
export default class PrivateApp extends React.Component {
  componentWillMount() {
    authActions.verifySession();
  }

  render() {
    if (this.props.userStore.currentUser) {
      return (
        <div>
          <Switch>
            {/* eslint-disable react/no-array-index-key */}
            {routes.map((route, index) => (
              <Route
                path={route.path}
                component={
                  route.auth
                    ? route.auth(route.component, this.props)
                    : route.component
                }
                key={index}
              />
            ))}
          </Switch>
        </div>
      );
    }
    return null;
  }
}
