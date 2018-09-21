import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { Container, Menu, Button, Responsive } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import { MobileDropDownNav } from '../../../theme/shared';
import Logo from './Logo';
@withRouter
export default class PublicSubNav extends Component {
  render() {
    const {
      moreProps, navStatus, stepInRoute, title, location, navItems, currentUser, match,
    } = this.props;
    return (
      <Aux>
        <Responsive minWidth={768} as={Aux}>
          <Menu
            secondary
            className={`menu-secondary-fixed ${moreProps ? moreProps.class : ''} ${navStatus === 'sub' ? 'active' : ''}`}
          >
            <Container className={!(moreProps && moreProps.onlyNav) ? 'fluid' : ''}>
              <Responsive minWidth={1024} as={Aux}>
                {!(moreProps && moreProps.onlyNav) && (
                  <Menu.Item as={Link} to="/" header>
                    <Logo
                      size="small"
                      alt="NextSeed.com"
                      dataSrc="LogoColor"
                    />
                  </Menu.Item>
                )}
              </Responsive>
              <Menu.Menu
                secondary
                className={`menu-secondary ${(moreProps && moreProps.onlyNav) ? '' : 'center-align'}`}
              >
                <Menu.Item header>{title}</Menu.Item>
                <NavItems sub refLoc="public" location={location} navItems={navItems} />
              </Menu.Menu>
              <Responsive minWidth={1024} as={Aux}>
                {!currentUser ? (
                  <Menu.Item as={Link} to={`/auth/${stepInRoute.to}`}>
                    <Button secondary compact>{stepInRoute.title}</Button>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    as={Link}
                    to={`/app/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
                  >
                    <Button secondary compact>Dashboard</Button>
                  </Menu.Item>
                )}
              </Responsive>
            </Container>
          </Menu>
        </Responsive>
        <MobileDropDownNav refMatch={match} navItems={navItems} location={location} />
      </Aux>
    );
  }
}

