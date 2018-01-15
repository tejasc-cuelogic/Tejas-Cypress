import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const getAdminLink = () => (
  <div className="nav-item" key="adminLink">
    <Link to="/admin" className="nav-link">
      Admin
    </Link>
  </div>
);

const getBusinessLink = () => (
  <div className="nav-item" key="businessLink">
    <Link to="/business" className="nav-link">
      Business
    </Link>
  </div>
);


const getInvestorLink = () => (
  <div className="nav-item" key="investorLink">
    <Link to="/investor" className="nav-link">
      Investor
    </Link>
  </div>
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
    <div className="nav-item">
      { links.map(link => link) }
    </div>
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
      <div className="nav navbar-nav pull-xs-right">

        <div className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </div>

        <NavLinks roles={props.currentUser.roles} />

        <div className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a" />&nbsp;Settings
          </Link>
        </div>

        <div className="nav-item">
          <Link
            to={`/@${props.currentUser._id}`}
            className="nav-link"
          >
            <img src={props.currentUser.image} className="user-pic" alt="" />
            {props.currentUser.email}
          </Link>
        </div>

      </div>
    );
  }

  return null;
};

@inject('userStore', 'commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/" className="navbar-brand">
            {this.props.commonStore.appName.toLowerCase()}
          </Link>

          <LoggedOutView currentUser={this.props.userStore.currentUser} />

          <LoggedInView currentUser={this.props.userStore.currentUser} />
        </div>
      </nav>
    );
  }
}

export default Header;
