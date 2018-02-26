import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Button, Image } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import Userimage from '../../assets/images/james-wright.png';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
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
        <Sidebar as={Menu} animation="push" width="thin" visible={uiStore.layoutState.leftPanel} icon="labeled" vertical inverted>
          <div className="user-picture">
            <Image src={Userimage} size="small" circular />
            <h2>James Wright</h2>
            <h3>Regular User</h3>
          </div>
          {
            sidebarItems.map(item => (
              <Menu.Item key={item.to} name="home" as={NavLink} to={`/app/${item.to}`}>
                <Icon name={item.icon} />
                <span>{item.displayName}</span>
              </Menu.Item>
            ))
          }
          <Button onClick={this.toggleVisibility} className="item collapseIcon">
            <i className={`angle ${(uiStore.layoutState.leftPanel) ? 'left' : 'right'} icon`} />
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
        <NotificationPanel status={uiStore.layoutState.notificationPanel} />
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
