import React from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch, withRouter } from 'react-router-dom';
import { authActions } from '../../services/actions';
import { privateRoutes } from '../../modules/routes';
import SidebarLeftOverlay from './../../theme/layout/SidebarLeftOverlay';
import NotFound from '../shared/NotFound';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
export default class Private extends React.Component {
  componentDidMount() {
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/auth/login');
    }
  }

  getPrivateRoutes = (roles) => {
    const routes = [];
    this.props.navStore.myRoutes.forEach((item) => {
      if (item.path) {
        routes[item.path] = (
          <Route
            path={`/app/${item.to}`}
            component={Loadable({
              loader: () => import(`./${typeof item.path === 'object' && roles ? item.path[roles[0]] :
    item.path}`),
              loading: 'loading...',
            })}
            key={item.path}
          />
        );
      }
    });
    return routes;
  }

  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }

  render() {
    const User = { ...this.props.userStore.currentUser };
    const { avatar } = this.props.userDetailsStore.userDetails;
    const { match } = this.props;
    const UserInfo = {
      firstName: User.givenName,
      lastName: User.familyName,
      avatarUrl: avatar ? avatar.url : '',
      roles: toJS(User.roles),
    };
    const routes = this.getPrivateRoutes(UserInfo.roles);
    if (this.props.authStore.isUserLoggedIn) {
      return (
        <SidebarLeftOverlay match={match} UserInfo={UserInfo} handleLogOut={this.handleLogOut}>
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
            {Object.keys(routes).map(route => routes[route])}
            <Route component={NotFound} />
          </Switch>
        </SidebarLeftOverlay>
      );
    }
    return null;
  }
}
