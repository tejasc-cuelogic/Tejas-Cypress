import React, { Component } from 'react';
import Aux from 'react-aux';
import { NavLink, withRouter } from 'react-router-dom';
import { Responsive, Menu, Dropdown, Icon, Header, Popup } from 'semantic-ui-react';
import { filter, reject, map, mapKeys } from 'lodash';
import { MobileDropDownNav } from '../../theme/shared';

const iMap = { to: 'key', title: 'text' };
const NavItems = ({
  isActive, location, navItems, navClick, match, stepsStatus, addon, navCustomClick,
}) => navItems.map((item, key) => (
  <Aux key={item.to}>
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
        <Menu.Item key={item.to} onClick={navCustomClick} as={NavLink} to={`${match.url}/${item.to}`}>
          {item.showIcon ?
            stepsStatus[key].status === 'IN_PROGRESS' ?
              <Popup
                trigger={
                  <Icon
                    name={item.icon[stepsStatus[key].status]}
                    color={item.icon_color[stepsStatus[key].status]}
                  />}
                content={item.toolTipTitle || ''}
                position="top center"
              />
              :
              <Icon
                color={item.icon_color[stepsStatus[key].status]}
                name={item.icon[stepsStatus[key].status]}
              />
            :
            null
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
  manageSubNavList = (subNavigations, getUserCreatedAccounts) => {
    const currentPath = this.props.match.url;
    if (currentPath.includes('profile-settings')) {
      const InvestmenTabExistsArr = filter(subNavigations, o => o.title === 'Investment limits');
      if (getUserCreatedAccounts.length <= 0 && InvestmenTabExistsArr &&
        InvestmenTabExistsArr.length > 0) {
        const updatedSubnavigation = reject(subNavigations, { title: 'Investment limits' });
        return updatedSubnavigation;
      }
      return subNavigations;
    }
    return subNavigations;
  }
  render() {
    const {
      navItems, match, location, vertical,
      noinvert, attached, className, stepsStatus, addon, heading,
      force2ary, navCustomClick, userCreatedAccounts,
    } = this.props;
    let navItemList = navItems;
    if (navItems && userCreatedAccounts) {
      const subNavigationItemList = this.manageSubNavList(navItems, userCreatedAccounts);
      navItemList = subNavigationItemList;
    }
    const mobNavItems = map(navItemList, i => mapKeys(i, (v, k) => iMap[k] || k));
    return (
      <Aux>
        <Responsive minWidth={768} as={Aux}>
          {heading &&
            <Header as="h6">{heading}</Header>
          }
          <Menu
            className={className || ''}
            celled={!vertical}
            horizontal={!vertical}
            inverted={(!noinvert && !vertical)}
            secondary={force2ary || vertical}
            vertical={vertical}
            attached={attached}
          >
            <NavItems
              addon={addon}
              isActive={this.isActive}
              location={this.props.location}
              navItems={navItemList}
              navClick={this.navClick}
              match={match}
              stepsStatus={stepsStatus}
              navCustomClick={navCustomClick}
            />
            {this.props.rightLabel}
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767} as={Aux}>
          {match.url === '/agreements/legal' ?
            <MobileDropDownNav
              inverted
              refMatch={match}
              navItems={navItemList}
              location={location}
              className="legal-menu"
            />
            :
            <Dropdown className="private-secondary-menu" fluid selection options={mobNavItems} />
          }
        </Responsive>
      </Aux>
    );
  }
}

export default SecondaryMenu;
