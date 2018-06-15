import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import { Responsive, Menu, Dropdown } from 'semantic-ui-react';

const iMap = { to: 'key', title: 'text' };
const NavItems = ({ navItems, match }) => navItems.map(item => (
  <Menu.Item key={item.to} as={NavLink} to={`${match.url}/${item.to}`}>
    {item.title}
  </Menu.Item>
));

class SecondaryMenu extends Component {
  render() {
    const { navItems, match } = this.props;
    const mobnavItems = map(navItems, i => mapKeys(i, (v, k) => iMap[k] || k));
    return (
      <div>
        <Responsive minWidth={768}>
          <Menu
            className={this.props.className || ''}
            celled={!this.props.vertical}
            horizontal={!this.props.vertical}
            inverted={!this.props.vertical}
            secondary={this.props.vertical}
            vertical={this.props.vertical}
            attached={this.props.attached}
          >
            <NavItems navItems={navItems} match={match} />
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767}>
          <Dropdown fluid selection options={mobnavItems} />
        </Responsive>
      </div>
    );
  }
}

export default SecondaryMenu;
