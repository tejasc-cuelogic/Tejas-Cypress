import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter, Switch, Route, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import './assets/semantic/semantic.min.css';
import DevPassProtected from './modules/auth/containers/DevPassProtected';
import { DevBanner, Spinner } from './theme/shared';
import Layout from './theme/layout/Layout';
// import Private from './modules/private';
import Public from './modules/public';
import SecureGateway from './modules/public/shared/SecureGateway';
import { authActions, activityActions } from './services/actions';
import MetaTagGenerator from './modules/shared/MetaTagGenerator';
/**
 * Main App
 */
const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Gain access to exclusive alternative investments in local businesses. Join thousands of local members on the first Regulation Crowdfunding portal in the US.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'website' },
  { type: 'ogTag', property: 'og:title', content: 'NextSeed | Diversify with Investments in Local Businesses through Debt Crowdfunding' },
  { type: 'ogTag', property: 'og:description', content: 'Gain access to exclusive alternative investments in local businesses. Join thousands of local members on the first Regulation Crowdfunding portal in the US.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Gain access to exclusive alternative investments in local businesses. Join thousands of members on the 1st Regulation Crowdfunding portal in the US.' },
  { type: 'meta', name: 'twitter:title', content: 'NextSeed | Diversify with Investments in Local Businesses through Debt Crowdfunding' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];

@inject('userStore', 'commonStore', 'authStore', 'uiStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    const { authStore, location, history } = this.props;
    this.props.authStore.setFieldvalue('isOfferPreviewUrl', location.pathname.includes('preview'));
    if (authStore.devPasswdProtection && location.pathname !== '/password-protected') {
      const setUrl = `${location.pathname}${location.search && location.search !== '' ? location.search : ''}`;
      this.props.uiStore.setFieldvalue('passwordPreviewURL', setUrl);
      history.push('/password-protected');
    }
    authActions.verifySession()
      .then(() => {
        if (this.props.uiStore.redirectURL) {
          history.push(this.props.uiStore.redirectURL);
        }
        if (this.props.userStore.currentUser) {
          this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
        }
      });
  }

  componentDidMount() {
    if (this.props.uiStore.devBanner) {
      activityActions.log({ action: 'APP_LOAD', status: 'SUCCESS' });
    }
  }

  componentDidUpdate(prevProps) {
    const isLoggingOut = prevProps.authStore.isUserLoggedIn && !this.props.authStore.isUserLoggedIn;
    const isLoggingIn = !prevProps.authStore.isUserLoggedIn && this.props.authStore.isUserLoggedIn;
    const currentLocation = this.props.location.pathname;
    if (isLoggingIn) {
      this.props.history.push(this.props.uiStore.redireURL);
    } else if (isLoggingOut) {
      this.props.uiStore.clearRedirectURL();
      this.props.authStore.setUserLoggedIn(false);
    }
    if (!currentLocation.includes('offerings')) {
      window.scrollTo(0, 0);
    } else if ((!this.props.location.hash || this.props.location.hash === '') && currentLocation.includes('overview')) {
      window.scrollTo(0, 0);
    }
  }

  playDevBanner = () => this.props.uiStore.toggleDevBanner();
  render() {
    const { location } = this.props;
    if (matchPath(location.pathname, { path: '/secure-gateway' })) {
      return (
        <Route path="/secure-gateway" component={SecureGateway} />
      );
    }
    if (this.props.authStore.hasSession && this.props.uiStore.appLoader) {
      return (
        <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
      );
    }
    return (
      <Aux>
        <MetaTagGenerator metaTagsData={metaTagsData} />
        {this.props.authStore.devPasswdProtection ?
          <Route exact path="/password-protected" component={DevPassProtected} /> : (
            <Layout>
              <Switch>
                {/* <Route exact path="/app/*" component={Private} /> */}
                <Route path="/" component={Public} />
              </Switch>
            </Layout>
          )
        }
        <ToastContainer className="toast-message" />
        {this.props.uiStore.devBanner &&
          <DevBanner toggle={this.playDevBanner} />
        }
      </Aux>
    );
  }
}

export default App;
