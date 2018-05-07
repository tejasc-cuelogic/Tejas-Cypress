import React from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { privateRoutes } from '../../modules/routes';
import SidebarLeftOverlay from './../../theme/layout/SidebarLeftOverlay';

@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Private extends React.Component {
  componentDidMount() {
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/login');
    }
  }

  render() {
    const User = { ...this.props.userStore.currentUser };
    const UserInfo = { fullname: `${User.givenName} ${User.familyName}`, avatarKey: User.sub, roles: toJS(User.roles) };
    if (this.props.authStore.isUserLoggedIn) {
      return (
        <div>
          <SidebarLeftOverlay UserInfo={UserInfo}>
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
          </SidebarLeftOverlay>
        </div>
      );
    }
    return null;
  }
}
