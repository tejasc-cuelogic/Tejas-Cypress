import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Menu, Button, Responsive, Visibility } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import { MobileDropDownNav } from '..';
import Logo from './Logo';
@inject('navStore')
@withRouter
@observer
export default class PublicSubNav extends Component {
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  render() {
    const {
      moreProps, stepInRoute, title, location, navItems, match, navStore, currentUser,
    } = this.props;
    const { navStatus, subNavStatus } = navStore;
    return (
      <>
        <Responsive minWidth={992} as={React.Fragment}>
          <Visibility offset={[72, 10]} onUpdate={this.handleUpdate} continuous>
            <Menu
              secondary
              className={`menu-secondary-fixed ${moreProps ? moreProps.class : ''} ${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}
            >
              <Container className={!(moreProps && moreProps.onlyNav) ? 'fluid' : ''}>
                <Responsive minWidth={1024}>
                  {!(moreProps && moreProps.onlyNav) && (
                    <Menu.Item as={Link} to="/" header>
                      <Logo
                        alt="NextSeed.com"
                        dataSrc="LogoGreenGrey"
                      />
                    </Menu.Item>
                  )}
                </Responsive>
                <Menu.Menu
                  secondary
                  className={`menu-secondary ${(moreProps && moreProps.onlyNav) ? '' : 'center-align'}`}
                >
                  <Menu.Item header>{title}:</Menu.Item>
                  <NavItems sub refLoc="public" location={location} navItems={navItems} />
                </Menu.Menu>
                <Responsive minWidth={1024}>
                  {!currentUser ? (
                    <Menu.Item className="menu-button" as={Link} to={`/auth/${stepInRoute.to}`}>
                      <Button secondary>{stepInRoute.title}</Button>
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      className="menu-button"
                      as={Link}
                      to={`/dashboard/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
                    >
                      <Button secondary>Dashboard</Button>
                    </Menu.Item>
                  )}
                </Responsive>
              </Container>
            </Menu>
            <div className="animate-placeholder" />
          </Visibility>
        </Responsive>
        <MobileDropDownNav
          inverted
          refMatch={match}
          navItems={navItems}
          navStatus={navStatus}
          location={location}
        />
      </>
    );
  }
}
