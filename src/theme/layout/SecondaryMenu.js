import React, { Component } from 'react';
import Aux from 'react-aux';
import { NavLink, withRouter } from 'react-router-dom';
import { Responsive, Menu, Dropdown, Icon } from 'semantic-ui-react';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';

const iMap = { to: 'key', title: 'text' };
const NavItems = ({
  isActive, location, navItems, navClick, match, stepsStatus, addon,
}) => navItems.map((item, key) => (
  <Aux>
    {(item.subNavigations) ?
    (
      <Dropdown
        item
        key={item.to}
        name={item.to}
        className={isActive(item.to, location) ? 'active' : ''}
        onClick={navClick}
        text={<span>{item.title}</span>}
      >
        <Dropdown.Menu className={isActive(item.to, location) ? 'visible' : ''}>
          {item.subNavigations.map(sn => (
            <Dropdown.Item
              name="byPass"
              key={sn.to}
              as={NavLink}
              to={`${(match.url)}/${sn.to}`}
            >
              {sn.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
  ) : (
    <Menu.Item key={item.to} as={NavLink} to={`${match.url}/${item.to}`}>
      {item.showIcon &&
        <Icon color={stepsStatus[key].status === 'COMPLETE' ? 'green' : ''} name={stepsStatus[key].status === 'COMPLETE' ? item.icon : 'circle'} />
      }
      {addon && addon.pos === 'left' && addon.data[item.to]}
      {item.title}
      {addon && addon.pos !== 'left' && addon.data[item.to]}
    </Menu.Item>
  )}
  </Aux>
));

@withRouter
class SecondaryMenu extends Component {
  navClick = (e, { name }) => {
    if (e.target && e.target.name !== 'byPass') {
      this.props.history.replace(`${this.props.match.url}/${name}`);
    }
  };
  isActive = (to, location) => (location.pathname.startsWith(`${this.props.match.url}/${to}`));
  render() {
    const {
      navItems, match, vertical, noinvert, attached, className, stepsStatus, addon,
    } = this.props;
    const mobNavItems = map(navItems, i => mapKeys(i, (v, k) => iMap[k] || k));
    return (
      <Aux>
        <Responsive minWidth={768} as={Aux}>
          <Menu
            className={className || ''}
            celled={!vertical}
            horizontal={!vertical}
            inverted={(!noinvert && !vertical)}
            secondary={vertical}
            vertical={vertical}
            attached={attached}
          >
            <NavItems
              addon={addon}
              isActive={this.isActive}
              location={this.props.location}
              navItems={navItems}
              navClick={this.navClick}
              match={match}
              stepsStatus={stepsStatus}
            />
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767} as={Aux}>
          <Dropdown fluid selection options={mobNavItems} />
        </Responsive>
      </Aux>
    );
  }
}

export default SecondaryMenu;
