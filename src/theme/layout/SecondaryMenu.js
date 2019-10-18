import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Responsive, Menu, Dropdown, Icon, Header, Popup } from 'semantic-ui-react';
import { MobileDropDownNav } from '../shared';

// const iMap = { to: 'key', title: 'text' };
const NavItems = ({
  isActive, location, navItems, navClick, match, stepsStatus, addon, navCustomClick,
}) => navItems.map((item, key) => (
  <React.Fragment key={item.to}>
    {(item.subNavigations)
      ? (
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
          {item.showIcon
            ? stepsStatus[key].status === 'IN_PROGRESS'
              ? (
                <Popup
                  trigger={(
                    <Icon
                      name={item.icon[stepsStatus[key].status]}
                      color={item.icon_color[stepsStatus[key].status]}
                    />
                  )}
                  content={item.toolTipTitle || ''}
                  position="top center"
                />
              )
              : (
                <Icon
                  color={item.icon_color[stepsStatus[key].status]}
                  name={item.icon[stepsStatus[key].status] || 'ns-circle'}
                />
              )
            : null
          }
          {addon && addon.pos === 'left' && addon.data[item.to]}
          {item.title}
          {addon && addon.pos !== 'left' && addon.data[item.to]}
        </Menu.Item>
      )}
  </React.Fragment>
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
      navItems, match, refMatch, location, vertical,
      noinvert, attached, className, stepsStatus, addon, heading,
      force2ary, navCustomClick, responsiveVars,
    } = this.props;
    let options = [];
    const showMoreMenuLength = get(responsiveVars, 'isTabletLand') ? 5 : 8;
    const showMoreMenu = this.props.offering && navItems && navItems.length > showMoreMenuLength;
    if (showMoreMenu) {
      const dropOptions = navItems.splice(showMoreMenuLength - 1, navItems.length - showMoreMenuLength);
      options = dropOptions.map(o => ({ key: o.to, text: o.title, value: o.to }));
    }
    // const mobNavItems = map(navItemList, i => mapKeys(i, (v, k) => iMap[k] || k));
    return (
      <>
        <Responsive minWidth={768} as={React.Fragment}>
          {heading
            && <Header as="h6">{heading}</Header>
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
              navItems={navItems}
              navClick={this.navClick}
              match={refMatch || match}
              stepsStatus={stepsStatus}
              navCustomClick={navCustomClick}
            />
            {showMoreMenu && <Dropdown selectOnBlur={false} onChange={(e, data) => this.props.history.push(data.value)} text="More..." options={options} className="more-items link item" />}
            {this.props.rightLabel}
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767} as={React.Fragment}>
          {match.url === '/agreements/legal'
            ? (
              <MobileDropDownNav
                inverted
                refMatch={refMatch || match}
                navItems={navItems}
                location={location}
                className="legal-menu"
              />
            )
            : (
              <MobileDropDownNav
                className="private-secondary-menu"
                refMatch={refMatch || match}
                navItems={navItems}
                location={location}
                useIsActive
              />
            )
          }
        </Responsive>
      </>
    );
  }
}

export default SecondaryMenu;
