import React, { Suspense, lazy } from 'react';
import { toJS } from 'mobx';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { authActions } from '../../services/actions';
import { privateRoutes } from '../routes';
import { InlineLoader, Spinner } from '../../theme/shared';
import SidebarLeftOverlay from '../../theme/layout/SidebarLeftOverlay';
import NsHeader from '../../theme/layout/Header';
import NotFound from '../shared/NotFound';

const isMobile = document.documentElement.clientWidth < 992;

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore', 'accountStore', 'referralsStore')
@withRouter
@observer
export default class Private extends React.Component {
  componentWillMount() {
    this.props.uiStore.setFieldvalue('resizeLoader', true);
  }

  componentDidMount() {
    // if (window.analytics) {
    //   window.analytics.page();
    // }
    setTimeout(() => {
      this.props.uiStore.setFieldvalue('resizeLoader', false);
    }, 500);
    const { userStore, referralsStore, userDetailsStore } = this.props;
    const { currentUser } = userDetailsStore;
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/login');
    } else if (userStore.isInvestor && get(userDetailsStore, 'signupStatus.activeAccounts') && get(userDetailsStore, 'signupStatus.activeAccounts').length) {
      referralsStore.getUserReferralDetails(get(currentUser, 'accessToken.payload.username'), false);
    }
  }

  getPrivateRoutes = (roles) => {
    const routes = [];
    this.props.navStore.myRoutes.forEach((item) => {
      if (item.path) {
        routes[`${item.path}_${item.to}`] = (
          <Route
            path={`/app/${item.to}`}
            component={lazy(() => import(`./${typeof item.path === 'object' && roles ? item.path[roles[0]]
              : item.path}`))}
            key={item.path}
          />
        );
      }
    });
    return routes;
  }

  handleLogOut = () => {
    authActions.logout('user')
      .then(() => {
        this.props.history.push('/');
      });
  }

  render() {
    const User = { ...this.props.userStore.currentUser };
    const { signupStatus, userDetails, userFirstLoad } = this.props.userDetailsStore;
    const { myRoutes } = this.props.navStore;
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
    const { location } = this.props;
    if (userFirstLoad === false || this.props.uiStore.resizeLoader) {
      return <Spinner loaderMessage="Loading..." />;
    }
    if (this.props.authStore.isUserLoggedIn) {
      return (
        <>
        {!isMobile
        && (
          <NsHeader
            location={location}
            stepInRoute={this.props.navStore.stepInRoute}
            currentUser={this.props.userStore.currentUser}
            handleLogOut={this.handleLogOut}
            // canSubmitApp={isValid}
            // isPrequalQulify={isPrequalQulify}
            // preQualSubmit={this.preQualSubmit}
            // loading={inProgress}
          />
        )
        }
        <SidebarLeftOverlay
          match={match}
          UserInfo={UserInfo}
          handleLogOut={this.handleLogOut}
          signupStatus={signupStatus}
          accForm={INVESTMENT_ACC_TYPES}
        >
          <Suspense fallback={<InlineLoader styledAs={{ marginTop: '100px' }} />}>
            <Switch>
              {privateRoutes.map(route => (
                <Route
                  exact={route.exact ? route.exact : false}
                  path={route.path}
                  component={(route.auth)
                    ? route.auth(route.component, this.props) : route.component}
                  key={route.path}
                />
              ))}
              {Object.keys(routes).map(route => routes[route])}
              {myRoutes.length > 0 ? <Route component={NotFound} />
                : <Route component={InlineLoader} />}
            </Switch>
          </Suspense>
        </SidebarLeftOverlay>
        </>
      );
    }
    return null;
  }
}
