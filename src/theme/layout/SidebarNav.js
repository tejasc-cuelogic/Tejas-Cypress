import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Menu, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { ALL_NAV_ITEMS } from '../../constants/privateNavigationMeta';
import { NavItems } from './NavigationItems';

@withRouter
export class SidebarNav extends Component {
  render() {
    const {
      roles,
      location,
      isUserVerified,
      createdAccount,
    } = this.props;
    const navItems = _.filter(
      ALL_NAV_ITEMS,
      n => n.to !== 'profile-settings' && (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0),
    );
    return (
      <Aux>
        <NavItems
          location={location}
          navItems={navItems}
          roles={roles}
          isUserVerified={isUserVerified}
          createdAccount={createdAccount}
          isApp
        />
        <Menu.Item key="logout" name="logout" onClick={this.props.handleLogOut}>
          <Icon name="sign out" />
          <span>Logout</span>
        </Menu.Item>
      </Aux>
    );
  }
}

export const GetNavItem = (item, roles) => {
  const result = _.find(ALL_NAV_ITEMS, i => i.to === item);
  const link = <h3><Link to={`/app/${result.to}`}>{result.title}</Link></h3>;
  return (
    result && (
      result.accessibleTo.length === 0 ||
      _.intersection(result.accessibleTo, roles).length > 0)) ? link : false;
};

export const GetNavMeta = (item) => {
  const navMeta = _.find(ALL_NAV_ITEMS, i => item.includes(i.to));
  return navMeta;
};
