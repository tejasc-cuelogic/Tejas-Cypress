import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Icon, Image, Menu, Dropdown } from 'semantic-ui-react';
import uiStore from '../../stores/uiStore';
import Logo from '../../assets/images/nextseed_logo_color.svg';

const UserNavigation = (props) => {
  const toggleNotification = () => uiStore.updateLayoutState('notificationPanel');
  const loadAuthModule = state => uiStore.setAuthWizardStep(state);

  if (props.currentUser) {
    return (
      <Aux>
        <Dropdown item simple text={props.currentUser.email}>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/app/settings">Settings</Dropdown.Item>
            <Dropdown.Item onClick={props.handleLogOut}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <a className="item notification" href="#" onClick={toggleNotification}>
          <Icon className="ns-bell" />
          <span className="unread-count">3</span>
        </a>
      </Aux>
    );
  }
  return (
    <Dropdown item simple text="Log In or Sign Up">
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => loadAuthModule('Login')}>Log In</Dropdown.Item>
        <Dropdown.Item onClick={() => loadAuthModule('SignupInitial')}>Register</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const navigationItems = props => (
  <Menu borderless fixed="top" size="large">
    <Container fluid>
      <Menu.Item as={Link} to="/" header>
        <Image className="small" src={Logo} alt="NextSeed.com" style={{ marginRight: '1.5em' }} />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item as={NavLink} to="/offerings" activeClassName="active" >Browse Deals</Menu.Item>
        <Menu.Item as={NavLink} to="/invest">For Investers</Menu.Item>
        <Menu.Item as={NavLink} to="/app/business">For Businesses</Menu.Item>
        <Dropdown item simple text="Learn">
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/about/team" >Team</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/about/ambassadors" >Ambassadors</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/blog" >Blog</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/case-studies" >Case Studies</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/about/faq" >FAQ</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <UserNavigation {...props} />
      </Menu.Menu>
    </Container>
  </Menu>
);

export default navigationItems;
