import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Button, Image, Label } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import Randavatar from './../../components/common/Randavatar';
import Logo from '../../assets/images/nextseed_logo_white_green.svg';
import LogoSmall from '../../assets/images/ns-logo-small.svg';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
    // const sidebarItems = [
    //   { icon: 'ns-envelope', displayName: 'Messages', to: 'messages' },
    //   { icon: 'ns-dashboard', displayName: 'Home', to: 'dashboard' },
    //   { icon: 'ns-users', displayName: 'Manage users', to: 'users' },
    //   // { icon: 'ns-rss-feed', displayName: 'Manage blog', to: 'users' },
    //   // { icon: 'ns-help', displayName: 'Manage FAQ', to: 'users' },
    //   { icon: 'ns-comments-edit', displayName: 'Bonus Rewards Fulfillment',
    //    to: 'bonus-reward-fulfillment' },
    //   { icon: 'ns-wallet', displayName: 'Banking', to: 'banking' },
    //   { icon: 'ns-article', displayName: 'Settings', to: 'settings' },
    // ];

    const sidebarItems = [
      { icon: 'ns-envelope', displayName: 'Summary', to: 'summary' },
      { icon: 'ns-envelope', displayName: 'Rewards wallet', to: 'rewardswallet' },
      { icon: 'ns-envelope', displayName: 'Referrals', to: 'referrals' },
      { icon: 'ns-envelope', displayName: 'Education', to: 'education' },
    ];

    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="push" width="thin" visible={uiStore.layoutState.leftPanel} icon vertical inverted>
          {/* {uiStore.layoutState.leftPanel &&
            <Image src={Logo} alt="NextSeed.com" />
          } */}
          <Image src={uiStore.layoutState.leftPanel ? Logo : LogoSmall} alt="NextSeed.com" className="logo" />
          <div className="user-picture">
            <Randavatar name={this.props.UserInfo.fullname} avatarKey={this.props.UserInfo.avatarKey} size="small" />
            <h2>{this.props.UserInfo.fullname}</h2>
            <h3>Regular User</h3>
            <h3><Link to="">Settings</Link></h3>
          </div>
          {
            sidebarItems.map(item => (
              <Menu.Item key={item.to} name="home" as={NavLink} to={`/app/${item.to}`}>
                <Icon name={item.icon} />
                <Label circular color="red" size="mini" horizontal>3</Label>
                <span>{item.displayName}</span>
              </Menu.Item>
            ))
          }
        </Sidebar>
        <Button onClick={this.toggleVisibility} className="item collapseIcon">
          <i className={`angle ${(uiStore.layoutState.leftPanel) ? 'left' : 'right'} icon`} />
          <span>Collapse</span>
        </Button>
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
      //         icon
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
