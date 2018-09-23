import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, matchPath } from 'react-router-dom';
import { Divider, Sidebar, Menu, Icon, Header, Button } from 'semantic-ui-react';
import { Logo, SocialLinks } from '../shared';
import { NavItems } from './NavigationItems';
import Footer from './../../theme/layout/Footer';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import { PUBLIC_NAV, FOOTER_NAV } from '../../constants/NavigationMeta';

const hasFooter = ['/'];
const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : (
  (path.includes('business-application') || path.includes('offerings') ? 'LogoColor' : 'LogoWhite')
));
@inject('uiStore')
@observer
export default class NavBarMobile extends Component {
  render() {
    const {
      onPusherClick, onToggle, visible,
      publicContent, location, isMobile,
      navStatus, currentUser, stepInRoute,
    } = this.props;
    const nav = GetNavMeta(location.pathname, [], true);
    const navTitle = nav ? nav.title : '';
    const investBtn = matchPath(location.pathname, { path: '/offerings/:id/:section?' });
    return (
      <Aux>
        <div className="public-header-section">
          <Icon onClick={onToggle} className="ns-nextseed-icon hamburger" />
          <div className="full-logo">
            <Logo
              alt="NextSeed.com"
              dataSrc={getLogo(location.pathname)}
              as={Link}
              to="/"
            />
          </div>
          <Link to="/"><Header as="h5" inverted>{navTitle}</Header></Link>
          {!currentUser ? (
            <Link to={`/auth/${stepInRoute.to}`} className="sign-in">
              {stepInRoute.title}
            </Link>
          ) : (
            <Link
              to={`/app/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
              className="sign-in"
            >
              Dashboard
            </Link>
          )
          }
          {investBtn && (
            <Button fluid={isMobile} as={Link} to="invest-now" secondary className="fixed-button">
              Invest Now
            </Button>
          )}
        </div>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            vertical
            visible={visible}
            className="public-sidebar"
          >
            <div className="public-mobile-nav">
              <div className="mobile-nav-inner-container">
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
              </div>
              <div className="social-media">
                <SocialLinks />
              </div>
            </div>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={visible}
            onClick={onPusherClick}
            className="public-pusher"
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
