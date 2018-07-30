import React, { Component } from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import Aux from 'react-aux';
import { Menu, Icon } from 'semantic-ui-react';
import { PRIVATE_NAV, PUBLIC_NAV } from '../../constants/NavigationMeta';
import { NavItems } from './NavigationItems';

@inject('navStore')
@withRouter
@observer
export class SidebarNav extends Component {
  componentWillMount() {
    this.props.navStore.setAccessParams('roles', this.props.roles);
    this.props.navStore.setAccessParams('currentNav', this.props.match.url);
  }
  componentWillReceiveProps(nextProps) {
    this.props.navStore.setAccessParams('currentNav', nextProps.match.url);
  }
  render() {
    const {
      roles, location, isVerified, createdAccount, navStore, onlyMount,
    } = this.props;
    if (onlyMount) return null;
    return (
      <Aux>
        <NavItems
          location={location}
          navItems={navStore.sidebarItems}
          roles={roles}
          isUserVerified={isVerified}
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
  const result = _.find(PRIVATE_NAV, i => i.to === item);
  const link = <h3><Link to={`/app/${result.to}`}>{result.title}</Link></h3>;
  return (result && (result.accessibleTo.length === 0 ||
    _.intersection(result.accessibleTo, roles).length > 0)) ? link : false;
};

export const GetNavMeta = (item, roles, nonprivate) => {
  const navMeta = !nonprivate ? _.find(PRIVATE_NAV, i => matchPath(item, { path: `/app/${i.to}` })) :
    _.find(PUBLIC_NAV, i => matchPath(item, { path: `/${i.to}` }));
  navMeta.title = typeof navMeta.title === 'object' && roles ? navMeta.title[roles[0]] :
    navMeta.title;
  if (navMeta.subNavigations && roles) {
    navMeta.subNavigations = navMeta.subNavigations.filter(n =>
      !n.accessibleTo || n.accessibleTo.length === 0 ||
      _.intersection(n.accessibleTo, roles).length > 0);
  }
  return navMeta;
};
