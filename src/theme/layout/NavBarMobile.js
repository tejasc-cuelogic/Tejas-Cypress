import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Divider, Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Logo } from '../shared';
import { NavigationItems } from './NavigationItems';

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
        >
          <Icon onClick={onToggle} className="ns-close-light" />
          <div className="public-header-nav">
            <NavigationItems
              location={location}
              isMobile={isMobile}
              navStatus={navStatus}
              currentUser={currentUser}
            />
          </div>
          <Divider />
          <div className="public-footer-nav">
            <NavigationItems
              location={location}
              isMobile={isMobile}
              navStatus={navStatus}
              currentUser={currentUser}
              footer
            />
          </div>
          <div className="social-media" />
        </Sidebar>
        <Sidebar.Pusher
          dimmed={visible}
          onClick={onPusherClick}
          style={{ minHeight: '100vh' }}
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
