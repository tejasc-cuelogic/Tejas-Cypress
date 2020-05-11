import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, matchPath } from 'react-router-dom';
import { Sidebar, Menu, Icon, Button } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Logo, TopBanner } from '../shared';
import { NavItems } from './NavigationItems';
import Footer from './Footer';
import { GetNavMeta } from './SidebarNav';
// import { MOBILE_NAV } from '../../constants/NavigationMeta';
// import NSImage from '../../modules/shared/NSImage';

const hasFooter = ['/'];
// const getLogo = path => (path.includes('/lendio') ? 'nextseed_and_lendio.svg' : 'logo.svg');
@inject('uiStore', 'businessAppStore', 'navStore', 'userStore', 'userDetailsStore')
@observer
export default class NavBarMobile extends Component {
  componentWillMount() {
    if (this.props.userStore.isInvestor) {
      this.props.navStore.setAccessParams('roles', this.props.currentUser.roles);
      this.props.navStore.setAccessParams('currentNav', this.props.match.url);
    }
  }

  componentDidUpdate() {
    if (this.props.userStore.isInvestor) {
      this.props.navStore.setAccessParams('currentNav', this.props.match.url);
    }
  }

  setAuthRef = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname, this.props.location.hash);
  }

  playTopBanner = () => this.props.uiStore.toggleTopBanner();

  render() {
    const {
      onPusherClick, onToggle, visible,
      publicContent, location, isMobile,
      navStatus, currentUser, stepInRoute,
      hasHeader, userDetailsStore, uiStore,
    } = this.props;
    this.props.uiStore.setLeftPanelMobileMenu(visible);
    const isNewCampaign = location.pathname.startsWith('/offerings');
    const nav = GetNavMeta(location.pathname, [], true);
    let navTitle = nav ? nav.title : '';
    const logInSignUp = stepInRoute.to !== 'login' ? [
      { to: 'login', title: 'Log In', className: 'basic primary' },
      { to: 'register', title: 'Sign Up', className: 'primary' },
    ]
      : [{ ...stepInRoute, className: 'primary' }];
    if (location.pathname.startsWith('/invest')) {
      navTitle = 'For Investors';
    } else if (location.pathname.startsWith('/business') && !location.pathname.startsWith('/business-application/')) {
      navTitle = 'For Businesses';
    } else if (location.pathname.startsWith('/education-center')) {
      navTitle = 'Education';
    } else if (location.pathname.startsWith('/insights')) {
      navTitle = 'Insights';
    } else if (location.pathname.startsWith('/offerings')) {
      navTitle = '';
    } else if (location.pathname.startsWith('/legal')) {
      navTitle = 'Legal';
    }
    const { signupStatus, pendingStep } = userDetailsStore;
    const isAddNewAccount = signupStatus && !signupStatus.finalStatus && signupStatus.investorProfileCompleted && signupStatus.inActiveAccounts.length > 0;
    const loggedInNavs = this.props.navStore.myMobileRoutes.filter(e => (e.isLoggedIn && this.props.userStore.isInvestor && (e.title !== 'Add New Account' || (e.title === 'Add New Account' && isAddNewAccount))));
    const publicNav = this.props.navStore.myMobileRoutes.filter(e => !e.isLoggedIn || (!this.props.userStore.isInvestor && ['offerings', 'collections-testing'].includes(e.to)));
    // const investBtn = matchPath(location.pathname, { path: '/offerings/:id/:section?' });
    const { topBanner } = uiStore;
    return (
      <>
        <Sidebar.Pushable className={visible && 'show-pushable'}>
          {hasHeader && (
            <>
              <div
                className={`${location.pathname.startsWith('/business-application/') && 'business-hamburger'} full-logo ${isNewCampaign ? 'full-logo-v2' : ''}`}
                onClick={!visible ? onToggle : false}
                onKeyPress={!visible ? onToggle : false}
                role="button"
                tabIndex="0"
              >
                <Icon className="ns-hamburger" role="button" tabIndex="0" />
              </div>
              {/* {location.pathname.startsWith('/business-application/')
                ? (
                  <NavigationItems
                    {...this.props}
                    isMobBussinessApp
                    isPrequalQulify={this.props.businessAppStore.isPrequalQulify}
                  />
                ) */}
                {/* : ( */}
                  <div className={`public-header-section ${isNewCampaign ? 'public-header-section-v2' : ''} ${visible ? 'active' : ''} ${navStatus === 'sub' ? 'slide-up' : ''}`}>
                    {navTitle === 'Home' || (location.pathname.startsWith('/offerings') || this.props.userStore.isInvestor)
                      ? (
                        <Link to="/">
                          <Logo
                            dataSrc="LogoGreenGrey"
                            className="mobile-header-logo"
                          />
                        </Link>
                      )
                      : (
                        <Link to="/">
                          <Logo
                            dataSrc="LogoGreenGrey"
                            className="mobile-header-logo"
                          />
                        </Link>
                      )}
                    {!currentUser ? (
                      <Link onClick={this.setAuthRef} to={`/${stepInRoute.to}`} className="sign-in neutral-text">
                        {stepInRoute.title}
                      </Link>
                    ) : ((this.props.userStore.isInvestor && !location.pathname.startsWith('/dashboard')) || !this.props.userStore.isInvestor) ? (
                      <Link
                        to={this.props.userStore.isInvestor ? pendingStep : '/dashboard'}
                        className="sign-in neutral-text"
                      >
                        Dashboard
                    </Link>
                    ) : null
                    }
                    {topBanner
                      && <TopBanner toggle={this.playTopBanner} leftMenu={this.props.uiStore.leftPanelMobileMenu} />
                    }
                  </div>
                {/* )
              } */}
            </>
          )}
          <Sidebar
            as={Menu}
            animation="overlay"
            vertical
            visible={visible}
            className="public-sidebar"
          >
            <Scrollbars
              className="ns-scrollbar"
              renderTrackVertical={p => <div {...p} className="track-vertical" />}
              renderThumbVertical={p => <div {...p} className="thumb-vertical" />}
              renderTrackHorizontal={p => <div {...p} className="track-horizontal" />}
              renderThumbHorizontal={p => <div {...p} className="thumb-horizontal" />}
              renderView={p => <div {...p} className="view" />}
            >
              <div className="sidebar-logo">
                <Link onClick={onToggle} to="/" className="logo">
                  <Logo
                    dataSrc="LogoGreenGrey"
                    className="mobile-header-logo"
                  />
                </Link>
                <Icon onClick={onToggle} className="ns-close-light" />
              </div>
              {this.props.userStore.isInvestor
                && (
                  <div className="public-header-nav logged-in-nav">
                    <NavItems
                      refLoc="public"
                      currentUser={currentUser}
                      location={location}
                      isMobile={isMobile}
                      navStatus={navStatus}
                      onToggle={onToggle}
                      navItems={loggedInNavs}
                    />
                  </div>
                )}
              <div className="public-header-nav">
                <NavItems
                  refLoc="public"
                  currentUser={currentUser}
                  location={location}
                  isMobile={isMobile}
                  navStatus={navStatus}
                  onToggle={onToggle}
                  navItems={publicNav}
                />
                <div className="public-action-nav mt-20 mb-20">
                  {!currentUser ? logInSignUp.map(route => (
                    <Menu.Item className="btn-item">
                      <Button fluid as={Link} onClick={this.setAuthRef} to={`/${route.to}`} className={`${route.className}`} compact>{route.title}</Button>
                    </Menu.Item>
                  ))
                    : (
                      <>
                        {/* {this.props.userStore.isInvestor
                          && signupStatus && signupStatus.finalStatus && signupStatus.investorProfileCompleted
                          && signupStatus.inActiveAccounts.length > 0
                          && (
                            <Menu.Item className="btn-item mt-30">
                              <Button fluid basic compact as={Link} to="/dashboard/setup/account-creation" content="Add New Account" />
                            </Menu.Item>
                          )
                        } */}
                        <Menu.Item className="btn-item">
                          <Button fluid as={Link} onClick={this.props.handleLogOut} to="/" basic compact>Logout</Button>
                        </Menu.Item>
                      </>
                    )
                  }
                </div>
              </div>
            </Scrollbars>
          </Sidebar>
          {/* <div className="social-media">
            <Menu>
              <SocialLinks />
            </Menu>
          </div> */}
          <Sidebar.Pusher
            dimmed={visible}
            onClick={onPusherClick}
            className={`public-pusher ${isNewCampaign ? 'public-pusher-v2' : ''} ${!hasHeader && 'noheader'} ${location.pathname.startsWith('/dashboard') ? 'private-pusher' : ''} ${topBanner ? 'large-header' : ''}`}
          >
            {publicContent}
            {this.props.userStore.isInvestor && this.props.children}
            {!location.pathname.startsWith('/dashboard') && (hasFooter.find(item => matchPath(location.pathname, { path: item })))
              && <Footer path={location.pathname} />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    );
  }
}
