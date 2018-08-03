import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import Logo from './Logo';

const PublicSubNav = props => (
  <Menu
    secondary
    className={`menu-secondary-fixed ${props.navStatus === 'sub' ? 'active' : ''}`}
  >
    <Container fluid>
      <Menu.Item as={Link} to="/" header>
        <Logo
          size="small"
          alt="NextSeed.com"
          dataSrc="LogoColor"
        />
      </Menu.Item>
      <Menu.Menu secondary className="center-align menu-secondary">
        <Menu.Item header>{props.title}</Menu.Item>
        <NavItems sub refLoc="public" location={props.location} navItems={props.navItems} />
      </Menu.Menu>
      <Menu.Item as={Link} to="/" position="right">
        <Button secondary compact>Sign Up/Log In</Button>
      </Menu.Item>
    </Container>
  </Menu>
);

export default PublicSubNav;
