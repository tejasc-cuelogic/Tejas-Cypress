import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import Logo from './Logo';

const PublicSubNav = (props) => {
  const {
    moreProps, navStatus, title, location, right, navItems,
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
        {right || (
          <Menu.Item as={Link} to="/" position="right">
            <Button secondary compact>Sign Up/Log In</Button>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};
export default PublicSubNav;
