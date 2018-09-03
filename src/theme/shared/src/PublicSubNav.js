import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Container, Menu, Button, Responsive, Dropdown } from 'semantic-ui-react';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import { NavItems } from '../../layout/NavigationItems';
import Logo from './Logo';

const iMap = { to: 'key', title: 'text' };
const PublicSubNav = (props) => {
  const {
    moreProps, navStatus, title, location, navItems,
  } = props;
  const mobnavItems = map(navItems, i => mapKeys(i, (v, k) => iMap[k] || k));
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
              <Menu.Item as={Link} to={!props.currentUser ? '/auth/login' : `/app/${props.currentUser.roles && props.currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}>
                <Button secondary compact>{!props.currentUser ? 'Sign Up/Log In' : 'Dashboard'}</Button>
              </Menu.Item>
            </Responsive>
          </Container>
        </Menu>
      </Responsive>
      <Responsive maxWidth={767} as={Container}>
        <Dropdown placeholder="Investing" fluid selection options={mobnavItems} />
      </Responsive>
    </Aux>
  );
};
export default PublicSubNav;
