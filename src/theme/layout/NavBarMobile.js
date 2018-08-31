import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Divider, Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Logo, SocialLinks } from '../shared';
import { NavItems } from './NavigationItems';
import { PUBLIC_NAV, FOOTER_NAV } from '../../constants/NavigationMeta';

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
          <Icon onClick={onToggle} className="ns-close-light" />
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
          <Menu className="social-media" inverted borderless>
            <SocialLinks />
          </Menu>
        </Sidebar>
        <Sidebar.Pusher
          dimmed={visible}
          onClick={onPusherClick}
          className="public-pusher"
        >
          <div className="public-header-section">
            <Icon name="sidebar" onClick={onToggle} className="hamburger" />
            <Logo dataSrc="LogoSmallWhite" className="logo" size="mini" />
            <Link to="/auth/login" className="sign-in">
              <Icon name="sign in" />
            </Link>
          </div>
          {publicContent}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
