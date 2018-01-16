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
  return (
    links.map(link => link)
  );
};

const LoggedOutView = (props) => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = (props) => {
  if (props.currentUser) {
    return (
      <Menu fixed="top">
        <Menu.Item className="navbar-brand">
          NextSeed
        </Menu.Item>
        <Menu.Menu position="right">
          <NavLinks roles={props.currentUser.roles} />
        </Menu.Menu>
      </Menu>
    );
  }

  return null;
};

@inject('userStore', 'commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <Menu fixed="top">
        <Menu.Item className="navbar-brand">
          NextSeed
        </Menu.Item>
        <Menu.Menu position="right">
          <LoggedOutView currentUser={this.props.userStore.currentUser} />
          <LoggedInView currentUser={this.props.userStore.currentUser} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
