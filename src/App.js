import React, { Component } from 'react';
import { withRouter, Switch, Route, matchPath, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import queryString from 'query-string';
import IdleTimer from 'react-idle-timer';
import './assets/semantic/semantic.min.css';
import DevPassProtected from './modules/auth/containers/DevPassProtected';
import { DevBanner, Spinner, NotifyVersionUpdate } from './theme/shared';
import Layout from './theme/layout/Layout';
import Private from './modules/private';
import Public from './modules/public';
import SecureGateway from './modules/public/shared/SecureGateway';
import { authActions, activityActions } from './services/actions';
import MetaTagGenerator from './modules/shared/MetaTagGenerator';
import { userIdleTime, NEXTSEED_BOX_URL } from './constants/common';
import { DataFormatter } from './helper';
import { REDIRECT_META } from './constants/redirect';
/**
 * Main App
 */

const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Gain access to exclusive investments in local businesses. Join investors from all over the country and build a portfolio with this alternative asset class.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'website' },
  { type: 'ogTag', property: 'og:title', content: 'NextSeed | Invest In Small Businesses' },
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
const restictedScrollToTopPathArr = ['offerings', '/business/funding-options/', '/education-center/investor/', '/education-center/business/', '/insights/category/', '/dashboard/resources/knowledge-base/', '/space/'];
@inject('userStore', 'authStore', 'uiStore', 'userDetailsStore', 'navStore', 'referralsStore')
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
    if (!isEmpty(urlParameter)) {
      let tags = DataFormatter.createEligibleTagsObj(urlParameter);
      if (!isEmpty(tags)) {
        const existingTags = JSON.parse(window.localStorage.getItem('tags'));
        tags = !isEmpty(existingTags) ? { ...existingTags, ...tags } : tags;
        window.localStorage.setItem('tags', JSON.stringify(tags));
      }
      const utmCampaign = get(urlParameter, 'utm_campaign') || get(urlParameter, 'campaign') || null;
      const rsCode = get(urlParameter, 'rsCode') || null;
      if (['marketplace', 'saasquatch'].includes(utmCampaign) && rsCode) {
        props.referralsStore.getReferralCreditsInformation(rsCode).then(() => {
          window.localStorage.setItem('SAASQUATCH_REFERRAL_CODE', rsCode);
          const redirectMeta = REDIRECT_META.find(r => r.live && r.rsCode === rsCode);
          if (redirectMeta && redirectMeta.rsRedirect) {
            props.history.push(redirectMeta.rsRedirect);
          }
        });
      }
    }
  }

  componentDidMount() {
    const { location, history } = this.props;
    this.props.authStore.setFieldvalue('isOfferPreviewUrl', location.pathname.includes('preview'));
    if (location.pathname.endsWith('/') && !location.hash) { // resolved trailing slash issue.
      history.push(location.pathname.replace(/\/+$/, location.search));
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
        window.logger('Catch error in app.js verifySession. ', err);
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
      window.logger('error in app.js - getUserSession', err);
    });
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged({ oldLocation: prevProps.location, newLocation: this.props.location });
    }

    document.addEventListener('visibilitychange', () => {
      const { authStore, location, uiStore, history } = this.props;
      if (!document.hidden) {
        if (authStore.isUserLoggedIn && !window.localStorage.getItem('jwt')) {
          authActions.forceLogout('timeout').then(() => {
            uiStore.setAuthRef(location.pathname, location.hash);
            if (location.pathname.includes('/dashboard/')) {
              history.push('/login');
            }
          });
        } else if (window.localStorage.getItem('jwt') && location.pathname === '/login' && uiStore.authRef.includes('/dashboard')) {
          window.location = uiStore.authRef || '/';
        } else if (window.localStorage.getItem('jwt') && !authStore.isUserLoggedIn) {
          window.location.reload();
        } else {
          const swAppVersionL = localStorage.getItem('swAppVersion'); // from local storage
          const swAppVersionS = sessionStorage.getItem('swAppVersion'); // from session storage
          if (moment(swAppVersionL).isValid() && moment(swAppVersionS).isValid() && swAppVersionL !== swAppVersionS && uiStore.appUpdated) {
            window.location.reload();
          }
        }
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

    if ((sessionStorage.getItem('isBoxFirewalled') !== 'true') && !this.props.authStore.isBoxApiChecked) {
      this.isBoxFirewalled()
      .then(() => sessionStorage.setItem('isBoxFirewalled', false))
      .catch(() => sessionStorage.setItem('isBoxFirewalled', true));
      this.props.authStore.setFieldvalue('isBoxApiChecked', true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getSizes = () => {
    const { clientWidth } = document.documentElement;
    return {
      isMobile: clientWidth < 768,
      uptoTablet: clientWidth < 992,
      isTablet: clientWidth >= 768 && clientWidth < 992,
      isTabletLand: clientWidth >= 768 && clientWidth < 1025,
      isSmallScreen: clientWidth >= 1024 && clientWidth < 1200,
    };
  };

  handleResize = () => {
    this.props.uiStore.setFieldvalue('responsiveVars', this.getSizes());
  }

  isBoxFirewalled = () => new Promise((resolve, reject) => {
    const testURL = NEXTSEED_BOX_URL;
    const myInit = {
      mode: 'no-cors',
    };
    const myRequest = new Request(testURL, myInit);
    fetch(myRequest)
    .then(() => resolve())
    .catch(() => reject());
  });

  onIdle = () => {
    if (this.props.authStore.isUserLoggedIn) {
      authActions.logout('timeout').then(() => {
        if (this.props.location.pathname.includes('/dashboard/')) {
          this.props.history.push('/login');
        }
      }).catch(err => window.logger(err));
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

  playTopBanner = () => this.props.uiStore.toggleTopBanner();

  render() {
    const { location, uiStore, userStore, authStore } = this.props;
    const { authChecked } = this.state;
    const { isTablet } = uiStore.responsiveVars;
    const { isInvestor } = userStore;

    if (matchPath(location.pathname, { path: '/secure-gateway' })) {
      return (
        <Route path="/secure-gateway" component={SecureGateway} />
      );
    }
    if (uiStore.appLoader || !authChecked) {
      return (
        <Spinner loaderMessage={uiStore.loaderMessage} />
      );
    }

    return (
      <div className={(isInvestor || !matchPath(location.pathname, { path: '/dashboard' })) ? 'public-pages' : ''}>
        {authStore.isUserLoggedIn
          && (
            <IdleTimer
              ref={(ref) => { authStore.idleTimer = ref; }}
              element={document}
              events={['mousedown', 'touchmove', 'MSPointerMove', 'MSPointerDown']}
              onIdle={this.onIdle}
              onAction={() => {
                if (authStore.idleTimer) {
                  localStorage.setItem('lastActiveTime', authStore.idleTimer.getLastActiveTime());
                }
              }}
              debounce={250}
              timeout={userIdleTime}
              stopOnIdle
            />
          )
        }
        {uiStore.appUpdated
          && <NotifyVersionUpdate responsiveVars={uiStore.responsiveVars} />
        }
        <MetaTagGenerator pathName={location.pathname} isTablet={isTablet} metaTagsData={metaTagsData} />
        {authStore.devPasswdProtection
          ? <Route exact path="/password-protected" component={DevPassProtected} /> : (
            <Layout>
              <Switch>
                <Redirect from="/app/*" to="/dashboard/*" />
                <Route exact path={['/dashboard', '/dashboard/*']} component={Private} />
                <Route path="/" component={Public} />
              </Switch>
            </Layout>
          )
        }
        <ToastContainer className="toast-message" />
        {uiStore.devBanner
          && <DevBanner toggle={this.playDevBanner} />
        }
        <div className="custom-modal-wrapper" />
      </div>
    );
  }
}

export default App;
