import React, { Component } from 'react';
import { withRouter, Switch, Route, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import queryString from 'query-string';
import IdleTimer from 'react-idle-timer';
import './assets/semantic/semantic.min.css';
import DevPassProtected from './modules/auth/containers/DevPassProtected';
import { DevBanner, Spinner } from './theme/shared';
import Layout from './theme/layout/Layout';
import Private from './modules/private';
import Public from './modules/public';
import SecureGateway from './modules/public/shared/SecureGateway';
import { authActions, activityActions } from './services/actions';
import MetaTagGenerator from './modules/shared/MetaTagGenerator';
import { userIdleTime, NEXTSEED_BOX_URL } from './constants/common';
import { DataFormatter } from './helper';
/**
 * Main App
 */

const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Gain access to exclusive investments in local businesses. Join investors from all over the country and build a portfolio with this alternative asset class.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'website' },
  { type: 'ogTag', property: 'og:title', content: 'NextSeed | Build an Investment Portfolio With Local Businesses' },
  { type: 'ogTag', property: 'og:description', content: 'Gain access to exclusive investments in local businesses. Join investors from all over the country and build a portfolio with this alternative asset class.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'og:image', content: `https://${window.location.hostname}/og-image_A.jpg` },
  { type: 'ogTag', property: 'og:image:secure_url', content: `https://${window.location.hostname}/og-image_A.jpg` },
  { type: 'ogTag', property: 'og:image:width', content: '1369' },
  { type: 'ogTag', property: 'og:image:height', content: '1027' },
  { type: 'ogTag', property: 'fb:app_id', content: '1806635959569619' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Gain access to exclusive investments in local businesses. Join investors from all over the country and build a portfolio with this alternative asset class.' },
  { type: 'meta', name: 'twitter:title', content: 'Gain access to exclusive investments in local businesses. Join investors from all over the country and build a portfolio with this alternative asset class.' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: `https://${window.location.hostname}/og-image_A.jpg` },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];
const isMobile = document.documentElement.clientWidth < 768;
const restictedScrollToTopPathArr = ['offerings', '/business/funding-options/', '/education-center/investor/', '/education-center/business/', '/resources/insights/category/', '/app/resources/knowledge-base/'];
@inject('userStore', 'authStore', 'uiStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class App extends Component {
  state = {
    authChecked: false,
  };

  constructor(props) {
    super(props);
    window.addEventListener('resize', this.handleResize);
    this.props.uiStore.setFieldvalue('responsiveVars', this.getSizes());
    const urlParameter = queryString.parse(this.props.location.search);
    if (urlParameter) {
      let tags = DataFormatter.createEligibleTagsObj(urlParameter);
      if (!isEmpty(tags)) {
        const existingTags = JSON.parse(window.localStorage.getItem('tags'));
        tags = !isEmpty(existingTags) ? { ...existingTags, ...tags } : tags;
        window.localStorage.setItem('tags', JSON.stringify(tags));
      }
    }
  }

  componentDidMount() {
    const { location, history } = this.props;
    this.props.authStore.setFieldvalue('isOfferPreviewUrl', location.pathname.includes('preview'));
    if (location.pathname.endsWith('/') && !this.props.location.hash) { // resolved trailing slash issue with this...
      history.push(location.pathname.replace(/\/+$/, ''));
    }
    this.checkForPasswordProtect();
    authActions.verifySession()
      .then(() => {
        this.checkUserIdleStatus();
        if (this.props.uiStore.redirectURL) {
          history.push(this.props.uiStore.redirectURL);
        }
        if (this.props.userStore.currentUser) {
          this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
        }
      })
      .catch((err) => {
        console.log('Catch error in app.js verifySession. ', err);
      }).finally(() => {
        this.setState({ authChecked: true });
      });
    if (this.props.uiStore.devBanner) {
      activityActions.log({ action: 'APP_LOAD', status: 'SUCCESS' });
    }
    if (window.analytics) {
      window.analytics.page();
    }
  }

  componentDidUpdate(prevProps) {
    this.checkForPasswordProtect();
    if (isMobile) {
      document.activeElement.blur();
    }
    authActions.getUserSession().then((session) => {
      if (session && !session.isValid()) {
        this.onIdle();
        this.props.authStore.setUserLoggedIn(true);
      }
    }).catch((err) => {
      if (err && (get(err, 'code') === 'NotAuthorizedException' || get(err, 'code') === 'Refresh Token has been revoked' || get(err, 'code') === 'Access Token has been revoked')) {
        this.onIdle();
      }
      this.props.authStore.setUserLoggedIn(false);
      localStorage.removeItem('lastActiveTime');
      console.log('error in app.js - getUserSession', err);
    });
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged({ oldLocation: prevProps.location, newLocation: this.props.location });
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // console.log('Browser tab is hidden');
      } else if (this.props.authStore.isUserLoggedIn && !window.localStorage.getItem('jwt')) {
        authActions.forceLogout('timeout').then(() => {
          this.props.history.push('/login');
        });
      }
    });

    this.checkUserIdleStatus();
    const isLoggingOut = prevProps.authStore.isUserLoggedIn && !this.props.authStore.isUserLoggedIn;
    const isLoggingIn = !prevProps.authStore.isUserLoggedIn && this.props.authStore.isUserLoggedIn;
    const currentLocation = this.props.location.pathname;
    if (isLoggingIn) {
      this.props.history.push(this.props.uiStore.redireURL);
    } else if (isLoggingOut) {
      this.props.uiStore.clearRedirectURL();
      this.props.authStore.setUserLoggedIn(false);
    }
    if ((!this.checkPathRestictedForScrollTop(restictedScrollToTopPathArr, currentLocation)) || ((!this.props.location.hash || this.props.location.hash === '') && currentLocation.includes('overview'))) {
      window.scrollTo(0, 0);
    }
    if (currentLocation === '/') {
      const calculations = {
        topVisible: true,
        direction: 'down',
        bottomPassed: false,
        isMoveTop: true,
      };
      this.props.navStore.setNavStatus(calculations, 'main');
    }

    if ((sessionStorage.getItem('isBoxFirewalled') !== 'true' && !this.props.authStore.isBoxApiChecked)) {
      sessionStorage.setItem('isBoxFirewalled', false);
      this.isBoxFirewalled().catch(() => {
        sessionStorage.setItem('isBoxFirewalled', true);
      });
      this.props.authStore.setFieldvalue('isBoxApiChecked', true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getSizes = () => ({
    isMobile: document.documentElement.clientWidth < 768,
    isTablet: document.documentElement.clientWidth >= 768
      && document.documentElement.clientWidth < 992,
    isTabletLand: document.documentElement.clientWidth >= 768
    && document.documentElement.clientWidth < 1025,
    isSmallScreen: document.documentElement.clientWidth >= 1024
    && document.documentElement.clientWidth < 1200,
  });

  handleResize = () => {
    this.props.uiStore.setFieldvalue('responsiveVars', this.getSizes());
  }

  isBoxFirewalled = () => new Promise((resolve, reject) => {
    const testURL = NEXTSEED_BOX_URL;
    const myInit = {
      method: 'HEAD',
      mode: 'no-cors',
    };
    const myRequest = new Request(testURL, myInit);
    fetch(myRequest).catch(() => {
      reject();
    });
  });

  onIdle = () => {
    if (this.props.authStore.isUserLoggedIn) {
      authActions.logout('timeout').then(() => {
        if (this.props.location.pathname.includes('/app/')) {
          this.props.history.push('/login');
        }
      });
    }
  }

  onRouteChanged = ({ oldLocation, newLocation }) => {
    if (window.analytics) {
      window.analytics.page(document.title, {
        path: newLocation.pathname,
        referrer: `https://${window.location.hostname}${oldLocation.pathname}`,
      });
    }
  }

  checkForPasswordProtect = () => {
    const { authStore, location, history } = this.props;
    if (authStore.devPasswdProtection && location.pathname !== '/password-protected') {
      const setUrl = `${location.pathname}${location.search && location.search !== '' ? location.search : ''}`;
      this.props.uiStore.setFieldvalue('passwordPreviewURL', setUrl);
      history.push('/password-protected');
    }
  }

  checkUserIdleStatus = () => {
    if (this.props.authStore.isUserLoggedIn && localStorage.getItem('lastActiveTime')) {
      const idleTime = (new Date().getTime() - localStorage.getItem('lastActiveTime'));
      if (idleTime >= userIdleTime) {
        this.onIdle();
      }
    } else if (this.props.authStore.isUserLoggedIn && !localStorage.getItem('lastActiveTime') && this.props.authStore.idleTimer) {
      localStorage.setItem('lastActiveTime', this.props.authStore.idleTimer.getLastActiveTime());
    }
  }

  checkPathRestictedForScrollTop = (paths, pathname) => paths.some(val => pathname.includes(val));

  playDevBanner = () => this.props.uiStore.toggleDevBanner();

  render() {
    const { location } = this.props;
    const { authChecked } = this.state;
    const { isTablet } = this.props.uiStore.responsiveVars;
    if (matchPath(location.pathname, { path: '/secure-gateway' })) {
      return (
        <Route path="/secure-gateway" component={SecureGateway} />
      );
    }
    if (this.props.uiStore.appLoader || !authChecked) {
      return (
        <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
      );
    }
    return (
      <div className={(!matchPath(location.pathname, { path: '/app' })) ? 'public-pages' : ''}>
        {this.props.authStore.isUserLoggedIn
          && (
            <IdleTimer
              ref={(ref) => { this.props.authStore.idleTimer = ref; }}
              element={document}
              events={['mousedown', 'touchmove', 'MSPointerMove', 'MSPointerDown']}
              onIdle={this.onIdle}
              onAction={() => {
                if (this.props.authStore.idleTimer) {
                  localStorage.setItem('lastActiveTime', this.props.authStore.idleTimer.getLastActiveTime());
                }
              }}
              debounce={250}
              timeout={userIdleTime}
              stopOnIdle
            />
          )
        }
        <MetaTagGenerator pathName={location.pathname} isTablet={isTablet} metaTagsData={metaTagsData} />
        {this.props.authStore.devPasswdProtection
          ? <Route exact path="/password-protected" component={DevPassProtected} /> : (
            <Layout>
              <Switch>
                <Route exact path="/app/*" component={Private} />
                <Route exact path="/app" component={Private} />
                <Route path="/" component={Public} />
              </Switch>
            </Layout>
          )
        }
        <ToastContainer className="toast-message" />
        {this.props.uiStore.devBanner
          && <DevBanner toggle={this.playDevBanner} />
        }
      </div>
    );
  }
}

export default App;
