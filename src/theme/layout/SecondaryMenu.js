import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class SecondaryMenu extends Component {
  render() {
    return (
      <Menu
        className={this.props.className || ''}
        celled={!this.props.vertical}
        horizontal={!this.props.vertical}
        inverted={!this.props.vertical}
        secondary={this.props.vertical}
        vertical={this.props.vertical}
        attached={this.props.attached}
      >
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
