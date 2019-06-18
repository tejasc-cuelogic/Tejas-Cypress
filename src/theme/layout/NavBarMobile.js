import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, matchPath } from 'react-router-dom';
import { Sidebar, Menu, Icon, Header, Button } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Logo, SocialLinks } from '../shared';
import { NavItems, NavigationItems } from './NavigationItems';
import Footer from './Footer';
import { GetNavMeta } from './SidebarNav';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
// import NSImage from '../../modules/shared/NSImage';

const hasFooter = ['/'];
// const getLogo = path => (path.includes('/lendio') ? 'nextseed_and_lendio.svg' : 'logo.svg');
@inject('uiStore', 'businessAppStore')
@observer
export default class NavBarMobile extends Component {
  setAuthRef = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname);
  }

  render() {
    const {
      onPusherClick, onToggle, visible,
      publicContent, location, isMobile,
      navStatus, currentUser, stepInRoute,
      hasHeader,
    } = this.props;
    const nav = GetNavMeta(location.pathname, [], true);
    let navTitle = nav ? nav.title : '';
    const logInSignUp = stepInRoute.to !== 'login' ? [
      { to: 'login', title: 'Log In', className: 'basic' },
      { to: 'register', title: 'Sign Up', className: 'secondary' },
    ]
      : [{ ...stepInRoute, className: 'secondary' }];
    if (location.pathname.startsWith('/invest')) {
      navTitle = 'Investing';
    } else if (location.pathname.startsWith('/business') && !location.pathname.startsWith('/business-application/')) {
      navTitle = 'Fundraising';
    } else if (location.pathname.startsWith('/resources/education-center')) {
      navTitle = 'Education Center';
    } else if (location.pathname.startsWith('/resources/insights')) {
      navTitle = 'Insights';
    } else if (location.pathname.startsWith('/offerings')) {
      navTitle = '';
    } else if (location.pathname.startsWith('/agreements/legal')) {
      navTitle = 'Legal';
    }
    // const investBtn = matchPath(location.pathname, { path: '/offerings/:id/:section?' });
    return (
      <>
        <Sidebar.Pushable className={visible && 'show-pushable'}>
          {hasHeader && (
            <>
              <div
                className={`${location.pathname.startsWith('/business-application/') && 'business-hamburger'} full-logo`}
                onClick={!visible ? onToggle : false}
                onKeyPress={!visible ? onToggle : false}
                role="button"
                tabIndex="0"
              >
                <Icon className="ns-hamburger" role="button" tabIndex="0" />
              </div>
              {location.pathname.startsWith('/business-application/')
                ? (
                  <NavigationItems
                    {...this.props}
                    isMobBussinessApp
                    isPrequalQulify={this.props.businessAppStore.isPrequalQulify}
                  />
                )
                : (
                  <div
                    className={`public-header-section ${visible ? 'active' : ''}
                  ${navStatus === 'sub' ? 'slide-up' : ''}`}
                  >
                    {navTitle === 'Home' || (location.pathname.startsWith('/offerings'))
                      ? (
                        <Logo
                          dataSrc="LogoGreenGrey"
                          className="mobile-header-logo"
                        />
                      )
                      : <Header as="h5">{navTitle}</Header>
                  }
                    {!currentUser ? (
                      <Link onClick={this.setAuthRef} to={`/auth/${stepInRoute.to}`} className="sign-in neutral-text">
                        {stepInRoute.title}
                      </Link>
                    ) : (
                      <Link
                        to={`/app/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
                        className="sign-in neutral-text"
                      >
                      Dashboard
                      </Link>
                    )
                  }
                  </div>
                )
              }
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
              <Icon onClick={onToggle} className="ns-close-light" />
              <div className="public-header-nav">
                <NavItems
                  refLoc="public"
                  currentUser={currentUser}
                  location={location}
                  isMobile={isMobile}
                  navStatus={navStatus}
                  onToggle={onToggle}
                  navItems={PUBLIC_NAV}
                />
                {/* <NavItems
                  refLoc="public"
                  currentUser={currentUser}
                  location={location}
                  isMobile={isMobile}
                  navStatus={navStatus}
                  onToggle={onToggle}
                  navItems={FOOTER_NAV}
                /> */}
                <div className="public-action-nav mt-20">
                  {!currentUser ? logInSignUp.map(route => (
                    <Menu.Item className="btn-item">
                      <Button fluid as={Link} onClick={this.setAuthRef} to={`/auth/${route.to}`} className={`${route.className}`} compact>{route.title}</Button>
                    </Menu.Item>
                  ))
                    : (
                      <Menu.Item className="btn-item">
                        <Button fluid as={Link} onClick={this.props.handleLogOut} to="/" basic compact>Logout</Button>
                      </Menu.Item>
                    )
                  }
                </div>
              </div>
            </Scrollbars>
          </Sidebar>
          <div className="social-media">
            <Menu>
              <SocialLinks />
            </Menu>
          </div>
          <Sidebar.Pusher
            dimmed={visible}
            onClick={onPusherClick}
            className={`public-pusher ${!hasHeader && 'noheader'}`}
          >
            {publicContent}
            {(hasFooter.find(item => matchPath(location.pathname, { path: item })))
            && <Footer path={location.pathname} />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    );
  }
}
