import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar, Menu, Icon, Button } from 'semantic-ui-react';

class SidebarLeftPush extends Component {
  state = { visible: false }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state;
    const sidebarItems = [
      { icon: 'block layout', displayName: 'Home', to: 'dashboard' },
      { icon: 'gift', displayName: 'Bonus Rewards Fulfillment', to: 'bonus-reward-fulfillment' },
      { icon: 'users', displayName: 'User Management', to: 'users' },
      { icon: 'mail', displayName: 'Messages', to: 'messages' },
      { icon: 'money', displayName: 'Banking', to: 'banking' },
      { icon: 'settings', displayName: 'Settings', to: 'settings' },
    ];

    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="push" width="thin" visible={visible} icon="labeled" vertical inverted>
          {
            sidebarItems.map(item => (
              <Menu.Item key={item.to} name="home" as={NavLink} to={`/app/${item.to}`}>
                <Icon name={item.icon} />
                <span>{item.displayName}</span>
              </Menu.Item>
            ))
          }
          <Button onClick={this.toggleVisibility} className="item collapseIcon">
            <i className={`angle ${(this.state.visible) ? 'left' : 'right'} icon`} />
            <span>Collapse</span>
          </Button>
        </Sidebar>
        <Sidebar.Pusher>
          <div className="ui vertical segment content">
            <div className="ui container fluid">
              {this.props.children}
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
