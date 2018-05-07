import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Button, Image } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import { SidebarNav, GetNavItem } from './SidebarNav';
import Randavatar from './../../components/common/Randavatar';
import LogoWhite from '../../assets/images/nextseed_logo_white_green.svg';
import LogoColor from '../../assets/images/nextseed_logo_color.svg';
import LogoSmall from '../../assets/images/ns-logo-small.svg';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
    return (
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="push"
          width="thin"
          visible={uiStore.layoutState.leftPanel}
          icon
          vertical
          inverted={(this.props.UserInfo.roles[0] !== 'investor')}
        >
          <Image
            src={((uiStore.layoutState.leftPanel) ?
              (this.props.UserInfo.roles[0] !== 'investor' ? LogoWhite : LogoColor) :
              LogoSmall)}
            alt="NextSeed.com"
            className="logo"
          />
          <div className="user-picture">
            <Randavatar name={this.props.UserInfo.fullname} avatarKey={this.props.UserInfo.avatarKey} size="small" />
            <h2>{this.props.UserInfo.fullname}</h2>
            <h3>{this.props.UserInfo.roles[0]}</h3>
            {GetNavItem('settings', this.props.UserInfo.roles)}
          </div>
          <SidebarNav handleLogOut={this.props.handleLogOut} roles={this.props.UserInfo.roles} />
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
    );
  }
}

export default SidebarLeftPush;
