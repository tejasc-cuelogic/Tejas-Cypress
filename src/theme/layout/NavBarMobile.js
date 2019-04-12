import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, matchPath } from 'react-router-dom';
import { Divider, Sidebar, Menu, Icon, Header } from 'semantic-ui-react';
import { Logo, SocialLinks } from '../shared';
import { NavItems } from './NavigationItems';
import Footer from './../../theme/layout/Footer';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import { PUBLIC_NAV, FOOTER_NAV } from '../../constants/NavigationMeta';
// import NSImage from '../../modules/shared/NSImage';

const hasFooter = ['/'];
// const getLogo = path => (path.includes('/lendio') ? 'nextseed_and_lendio.svg' : 'logo.svg');
@inject('uiStore')
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
    if (location.pathname.startsWith('/invest')) {
      navTitle = 'Investing';
    } else if (location.pathname.startsWith('/business')) {
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
      <Aux>
        <Sidebar.Pushable className={visible && 'show-pushable'}>
          {hasHeader && (
            <Aux>
              <div
                className="full-logo"
                onClick={!visible ? onToggle : false}
                onKeyPress={!visible ? onToggle : false}
                role="button"
                tabIndex="0"
              >
                {/* <Logo
                  alt="NextSeed.com"
                  dataSrc={visible ? 'LogoWhite' : getLogo(location.pathname)}
                  as={visible ? Link : Logo}
                  to="/"
                /> */}
                {/* <NSImage
                  path="hamburger.svg"
                  role="button"
                  tabIndex="0"
                /> */}
                <Icon className="ns-hamburger" role="button" tabIndex="0" />
              </div>
              <div
                className={`public-header-section ${visible ? 'active' : ''}
                ${navStatus === 'sub' ? 'slide-up' : ''}`}
              >
                {/* <Icon className="ns-nextseed-icon hamburger" /> */}
                {navTitle === 'Home' || (location.pathname.startsWith('/offerings')) ?
                  <Logo
                    dataSrc="LogoGreenGrey"
                    className="mobile-header-logo"
                  /> :
                  <Header as="h5">{navTitle}</Header>
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
                {/* {investBtn && (
                  <Button fluid={isMobile} as={Link}
                  to={`${this.props.match.url}/invest-now`} secondary className="fixed-button">
                    Invest Now
                  </Button>
                )} */}
              </div>
            </Aux>
          )}
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            vertical
            visible={visible}
            className="public-sidebar"
          >
            <Logo
              alt="NextSeed.com"
              dataSrc="LogoWhite"
              as={visible ? Link : Logo}
              to="/"
            />
            <Icon onClick={onToggle} className="ns-close-light" />
            <div className="public-mobile-nav">
              <div className="mobile-nav-inner-container">
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
                </div>
                <Divider />
                <div className="public-footer-nav">
                  <NavItems
                    refLoc="public"
                    currentUser={currentUser}
                    location={location}
                    isMobile={isMobile}
                    navStatus={navStatus}
                    onToggle={onToggle}
                    navItems={FOOTER_NAV}
                  />
                </div>
                <Divider />
                <div className="social-media">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={visible}
            onClick={onPusherClick}
            className={`public-pusher ${!hasHeader && 'noheader'}`}
          >
            {publicContent}
            {(hasFooter.find(item => matchPath(location.pathname, { path: item }))) &&
            <Footer path={location.pathname} />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Aux>
    );
  }
}
