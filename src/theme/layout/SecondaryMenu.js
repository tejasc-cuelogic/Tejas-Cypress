import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class SecondaryMenu extends Component {
  render() {
    return (
      <Menu className={this.props.className || ''} celled horizontal inverted attached={this.props.attached || ''}>
        {
          this.props.navItems.map(item => (
            <Menu.Item
              as={NavLink}
              to={`${this.props.match.url}/${item.to}`}
            >
              {item.title}
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

export default SecondaryMenu;
