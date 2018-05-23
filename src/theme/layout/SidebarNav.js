import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Menu, Icon, Label, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import { ALL_NAV_ITEMS } from '../../constants/privateNavigationMeta';

@withRouter
export class SidebarNav extends Component {
  state = { active: '' };
  navClick = (e, { name }) => this.setState({ active: name });
  render() {
    const { roles } = this.props;
    const { active } = this.state;
    const navItems = _.filter(
      ALL_NAV_ITEMS,
      n => n.to !== 'profile-settings' && (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0),
    );
    const actuals = ['account-details', 'summary', 'users', 'profile-settings', 'edgar', 'education'];
    return (
      <Aux>
        {
          navItems.map(item => (
            <Aux>
              {(item.subNavigations && item.subNavigations.length > 0) ? (
                <Dropdown
                  item
                  open={active === item.to || this.props.location.pathname.startsWith(`/app/${item.to}`)}
                  name={item.to}
                  text={<Aux><Icon className={item.icon} /><span>{item.title}</span></Aux>}
                  onClick={this.navClick}
                >
                  <Dropdown.Menu>
                    {item.subNavigations.map(sn => (
                      <Dropdown.Item as={NavLink} to={`/app/${item.to}/${sn.to}`}>{sn.title}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Menu.Item
                  key={item.to}
                  onClick={this.navClick}
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
              )}
            </Aux>
          ))
        }
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
