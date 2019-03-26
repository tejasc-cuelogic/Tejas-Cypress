import React from 'react';
import { toJS } from 'mobx';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch, withRouter } from 'react-router-dom';
import { authActions } from '../../services/actions';
import { privateRoutes } from '../../modules/routes';
import { InlineLoader } from '../../theme/shared';
import SidebarLeftOverlay from './../../theme/layout/SidebarLeftOverlay';
import NotFound from '../shared/NotFound';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore', 'accountStore')
@withRouter
@observer
export default class Private extends React.Component {
  componentDidMount() {
    if (window.analytics) {
      window.analytics.page();
    }
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/auth/login');
    }
  }

  getPrivateRoutes = (roles) => {
    const routes = [];
    this.props.navStore.myRoutes.forEach((item) => {
      if (item.path) {
        routes[`${item.path}_${item.to}`] = (
          <Route
            path={`/app/${item.to}`}
            component={Loadable({
              loader: () => import(`./${typeof item.path === 'object' && roles ? item.path[roles[0]] :
              item.path}`),
              loading() {
                return <InlineLoader />;
              },
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
    const { signupStatus, userDetails } = this.props.userDetailsStore;
    const { info } = userDetails;
    const { match } = this.props;
    const UserInfo = {
      firstName: get(userDetails, 'info.firstName'),
      lastName: get(userDetails, 'info.lastName'),
      avatarUrl: info ? info.avatar ? info.avatar.url : '' : '',
      roles: toJS(User.roles),
    };
    const routes = this.getPrivateRoutes(UserInfo.roles);
    const { INVESTMENT_ACC_TYPES } = this.props.accountStore;
    if (this.props.authStore.isUserLoggedIn) {
      return (
        <SidebarLeftOverlay
          match={match}
          UserInfo={UserInfo}
          handleLogOut={this.handleLogOut}
          signupStatus={signupStatus}
          accForm={INVESTMENT_ACC_TYPES}
        >
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
