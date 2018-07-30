import React, { Component } from 'react';
import Aux from 'react-aux';
import { NavLink } from 'react-router-dom';
import { Responsive, Menu, Dropdown, Icon } from 'semantic-ui-react';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';

const iMap = { to: 'key', title: 'text' };
const NavItems = ({ navItems, match, stepsStatus }) => navItems.map((item, key) => (
  <Menu.Item key={item.to} as={NavLink} to={`${match.url}/${item.to}`}>
    {item.showIcon &&
      <Icon color={stepsStatus[key].status === 'COMPLETE' ? 'green' : ''} name={stepsStatus[key].status === 'COMPLETE' ? item.icon : 'circle'} />
    }
    {item.title}
  </Menu.Item>
));

class SecondaryMenu extends Component {
  render() {
    const { navItems, match } = this.props;
    const mobnavItems = map(navItems, i => mapKeys(i, (v, k) => iMap[k] || k));
    return (
      <Aux>
        <Responsive minWidth={768} as={Aux}>
          <Menu
            className={this.props.className || ''}
            celled={!this.props.vertical}
            horizontal={!this.props.vertical}
            // inverted={!this.props.vertical}
            secondary={this.props.vertical}
            vertical={this.props.vertical}
            attached={this.props.attached}
          >
            <NavItems navItems={navItems} match={match} stepsStatus={this.props.stepsStatus} />
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
