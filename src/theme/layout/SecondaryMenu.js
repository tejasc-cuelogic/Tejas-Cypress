import React, { Component } from 'react';
import Aux from 'react-aux';
import { NavLink } from 'react-router-dom';
import { Responsive, Menu, Dropdown, Icon } from 'semantic-ui-react';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';

const iMap = { to: 'key', title: 'text' };
const NavItems = ({
  navItems, match, stepsStatus, addon,
}) => navItems.map((item, key) => (
  <Menu.Item key={item.to} as={NavLink} to={`${match.url}/${item.to}`}>
    {item.showIcon &&
      <Icon color={stepsStatus[key].status === 'COMPLETE' ? 'green' : ''} name={stepsStatus[key].status === 'COMPLETE' ? item.icon : 'circle'} />
    }
    {addon && addon.pos === 'left' && addon.data[item.to]}
    {item.title}
    {addon && addon.pos !== 'left' && addon.data[item.to]}
  </Menu.Item>
));

class SecondaryMenu extends Component {
  render() {
    const {
      navItems, match, vertical, noinvert, attached, className, stepsStatus, addon,
    } = this.props;
    const mobnavItems = map(navItems, i => mapKeys(i, (v, k) => iMap[k] || k));
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
            <NavItems addon={addon} navItems={navItems} match={match} stepsStatus={stepsStatus} />
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767} as={Aux}>
          <Dropdown fluid selection options={mobnavItems} />
        </Responsive>
      </Aux>
    );
  }
}

export default SecondaryMenu;
