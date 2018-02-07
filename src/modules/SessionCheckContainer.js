import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { privateRoutes } from '../modules/routes';
import SidebarLeftOverlay from './../theme/layout/SidebarLeftOverlay';
@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class SessionCheckContainer extends React.Component {
  componentDidMount() {
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/login');
    }
  }

  render() {
    if (this.props.authStore.isUserLoggedIn) {
      return (
        <div>
          <SidebarLeftOverlay />
          <Switch>
            {privateRoutes.map(route => (
              <Route
                exact={route.exact ? route.exact : false}
                path={route.path}
                component={(route.auth) ?
                  route.auth(route.component, this.props) : route.component}
                key={route.path}
              />
            ))}
          </Switch>
        </div>
      );
    }
    return null;
  }
}
