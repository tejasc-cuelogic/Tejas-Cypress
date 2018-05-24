import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Responsive, Menu, Dropdown } from 'semantic-ui-react';

const options = [
  {
    key: 'edit', text: 'Menu Option One', value: 'edit',
  },
  {
    key: 'delete', text: 'Menu Option Two', value: 'delete',
  },
  {
    key: 'hide', text: 'Menu Option Three', value: 'hide',
  },
];

class SecondaryMenu extends Component {
  render() {
    return (
      <div>
        <Responsive {...Responsive.onlyTablet}>
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
                  key={item.to}
                  as={NavLink}
                  to={`${this.props.match.url}/${item.to}`}
                >
                  {item.title}
                </Menu.Item>
              ))
            }
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" {...Responsive.onlyMobile}>
          <Dropdown
            fluid
            selection
            options={options}
          />
        </Responsive>
      </div>
    );
  }
}

export default SecondaryMenu;
