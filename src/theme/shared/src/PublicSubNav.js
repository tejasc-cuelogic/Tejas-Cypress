import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import Logo from './Logo';

const PublicSubNav = (props) => {
  const {
    moreProps, navStatus, title, location, navItems,
  } = props;
  return (
    <Menu
      secondary
      className={`menu-secondary-fixed ${moreProps ? moreProps.class : ''} ${navStatus === 'sub' ? 'active' : ''}`}
    >
      <Container className={!(moreProps && moreProps.onlyNav) ? 'fluid' : ''}>
        {!(moreProps && moreProps.onlyNav) && (
          <Menu.Item as={Link} to="/" header>
            <Logo
              size="small"
              alt="NextSeed.com"
              dataSrc="LogoColor"
            />
          </Menu.Item>
        )}
        <Menu.Menu
          secondary
          className={`menu-secondary ${(moreProps && moreProps.onlyNav) ? '' : 'center-align'}`}
        >
          <Menu.Item header>{title}</Menu.Item>
          <NavItems sub refLoc="public" location={location} navItems={navItems} />
        </Menu.Menu>
        <Menu.Item as={Link} to={!props.currentUser ? '/auth/login' : `/app/${props.currentUser.roles && props.currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}>
          <Button secondary compact>{!props.currentUser ? 'Sign Up/Log In' : 'Dashboard'}</Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
export default PublicSubNav;
