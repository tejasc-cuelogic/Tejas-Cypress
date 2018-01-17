import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Menu } from 'semantic-ui-react';

const getAdminLink = () => (
  <Menu.Item as={Link} to="/admin">Admin</Menu.Item>
);

const getBusinessLink = () => (
  <Menu.Item as={Link} to="/business">Business</Menu.Item>
);


const getInvestorLink = () => (
  <Menu.Item as={Link} to="/investor">Investor</Menu.Item>
);

const getSettingsLink = () => (
  <Menu.Item as={Link} to="/settings">Settings</Menu.Item>
);

const NavLinks = (props) => {
  const links = [];
  if (props.roles.includes('admin')) {
    links.push(getAdminLink());
  }
  if (props.roles.includes('bowner') || props.roles.includes('admin')) {
    links.push(getBusinessLink());
  }
  if (props.roles.includes('investor') || props.roles.includes('admin')) {
    links.push(getInvestorLink());
  }
  links.push(getSettingsLink());
  return (
    links.map(link => link)
  );
};

const LoggedOutView = (props) => {
  if (!props.currentUser) {
    return (
      <Menu.Menu position="right">
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        <Menu.Item as={Link} to="/login">Sign In</Menu.Item>
        <Menu.Item as={Link} to="/register">Sign Up</Menu.Item>
      </Menu.Menu>
    );
  }
  return null;
};

const LoggedInView = (props) => {
  if (props.currentUser) {
    return (
      <Menu.Menu position="right">
        <NavLinks roles={props.currentUser.roles} />
      </Menu.Menu>
    );
  }

  return null;
};

@inject('userStore', 'commonStore')
@observer
class NavBar extends React.Component {
  render() {
    return (
      <Menu fixed="top">
        <Menu.Item className="navbar-brand">
          NextSeed
        </Menu.Item>
        <LoggedOutView currentUser={this.props.userStore.currentUser} />
        <LoggedInView currentUser={this.props.userStore.currentUser} />
      </Menu>
    );
  }
}

export default NavBar;
