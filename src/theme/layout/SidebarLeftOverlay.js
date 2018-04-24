import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Button } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import Randavatar from './../../components/common/Randavatar';

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
    const UserInfo = { ...this.props.UserInfo };

    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="push" width="thin" visible={uiStore.layoutState.leftPanel} icon="labeled" vertical inverted>
          <div className="user-picture">
            <Randavatar name={UserInfo.fullname} accountType={UserInfo.accountType} avatarKey={UserInfo.avatarKey} size="small" />
            <h2>{UserInfo.fullname}</h2>
            <h3>{UserInfo.accountType}</h3>
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
          {this.props.children}
        </Sidebar.Pusher>
        <NotificationPanel status={uiStore.layoutState.notificationPanel} />
      </Sidebar.Pushable>
      //  BELOW CODE IS FOR RESPONSIVE MENU
      // <div>
      //   <Responsive minWidth={992}>
      //   </Responsive>
      //   <Responsive maxWidth={991}>
      //     <Button onClick={this.toggleVisibility} className="item collapseIcon pull-right">
      //       <i className={`angle ${(uiStore.layoutState.leftPanel) ? 'left' : 'right'} icon`} />
      //       <span>Collapse</span>
      //     </Button>
      //     <Sidebar.Pushable>
      //       <Sidebar
      //         as={Menu}
      //         animation="overlay"
      //         width="thin"
      //         visible={uiStore.layoutState.leftPanel}
      //         icon="labeled"
      //         vertical
      //         inverted
      //       >
      //         <div className="user-picture">
      //           <Randavatar
      //             name={this.props.UserInfo.fullname}
      //             avatarKey={this.props.UserInfo.avatarKey}
      //             size="small"
      //           />
      //           <h2>{this.props.UserInfo.fullname}</h2>
      //           <h3>Mobile User</h3>
      //         </div>
      //         {
      //           sidebarItems.map(item => (
      //             <Menu.Item key={item.to} name="home" as={NavLink} to={`/app/${item.to}`}>
      //               <Icon name={item.icon} />
      //               <span>{item.displayName}</span>
      //             </Menu.Item>
      //           ))
      //         }
      //       </Sidebar>
      //       <Sidebar.Pusher>
      //         {this.props.children}
      //       </Sidebar.Pusher>
      //       <NotificationPanel status={uiStore.layoutState.notificationPanel} />
      //     </Sidebar.Pushable>
      //   </Responsive>
      // </div>
    );
  }
}

export default SidebarLeftPush;
