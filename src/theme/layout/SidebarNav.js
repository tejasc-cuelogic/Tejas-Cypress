import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Aux from 'react-aux';
import { Menu, Icon, Label } from 'semantic-ui-react';
import _ from 'lodash';
import { ALL_NAV_ITEMS } from '../../constants/privateNavigationMeta';

export const SidebarNav = (props) => {
  const { roles } = props;
  const navItems = _.filter(
    ALL_NAV_ITEMS,
    n => n.to !== 'profile-settings' && (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0),
  );
  const actuals = ['account-details', 'summary', 'users', 'profile-settings', 'edgar'];
  return (
    <Aux>
      {
        navItems.map(item => (
          <Menu.Item
            key={item.to}
            name={item.to}
            as={NavLink}
            to={(actuals.includes(item.to.split('/')[0])) ? `/app/${item.to}` : `/app/page/${item.to}`}
          >
            <Icon className={item.icon} />
            {item.to === 'messages' &&
              <Label circular color="red" size="mini" horizontal>3</Label>
            }
            <span>{item.title}</span>
          </Menu.Item>
        ))
      }
      <Menu.Item key="logout" name="logout" onClick={props.handleLogOut}>
        <Icon name="sign out" />
        <span>Logout</span>
      </Menu.Item>
    </Aux>
  );
};

export const GetNavItem = (item, roles) => {
  const result = _.find(ALL_NAV_ITEMS, i => i.to === item);
  const link = <h3><Link to={`/app/page/${result.to}`}>{result.title}</Link></h3>;
  return (
    result && (
      result.accessibleTo.length === 0 ||
      _.intersection(result.accessibleTo, roles).length > 0)) ? link : false;
};

export const GetNavMeta = (item) => {
  const navMeta = _.find(ALL_NAV_ITEMS, i => item.includes(i.to));
  return navMeta;
};
