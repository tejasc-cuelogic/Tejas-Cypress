import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, matchPath } from 'react-router-dom';
import { Divider, Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Logo, SocialLinks } from '../shared';
import { NavItems } from './NavigationItems';
import Footer from './../../theme/layout/Footer';
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
      onPusherClick, onToggle, visible, publicContent, location, isMobile, navStatus, currentUser,
    } = this.props;
    return (
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
            <Icon onClick={onToggle} className="ns-close-light" />
            <Logo
              size="small"
              alt="NextSeed.com"
              dataSrc={getLogo(location.pathname)}
              as={Link}
              to="/"
            />
            <div className="public-header-nav">
              <NavItems
                refLoc="public"
                currentUser={currentUser}
                location={location}
                isMobile={isMobile}
                navStatus={navStatus}
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
                navItems={FOOTER_NAV}
              />
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
          <div className="public-header-section">
            <Icon name="sidebar" onClick={onToggle} className="hamburger" />
            <Logo as={Link} to="/" dataSrc="LogoSmallWhite" className="logo" size="mini" />
            <Link to="/auth/login" className="sign-in">
              Sign In
            </Link>
          </div>
          {publicContent}
          {(hasFooter.find(item => matchPath(location.pathname, { path: item }))) &&
          <Footer path={location.pathname} />}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
