import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Button, Image } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import { SidebarNav, GetNavItem } from './SidebarNav';
import Randavatar from './../../theme/common/Randavatar';
import LogoWhite from '../../assets/images/nextseed_logo_white_green.svg';
import LogoColor from '../../assets/images/nextseed_logo_color.svg';
import LogoSmall from '../../assets/images/ns-logo-small.svg';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
    const UserInfo = { ...this.props.UserInfo };
    return (
      <div>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            width="thin"
            visible={uiStore.layoutState.leftPanel}
            icon
            vertical
            inverted={(UserInfo.roles[0] !== 'investor')}
          >
            <Image
              src={((uiStore.layoutState.leftPanel) ?
                (UserInfo.roles[0] !== 'investor' ? LogoWhite : LogoColor) :
                LogoSmall)}
              alt="NextSeed.com"
              className="logo"
            />
            <div className="user-picture">
              <Randavatar name={UserInfo.fullname} accountType={UserInfo.accountType} avatarKey={UserInfo.avatarKey} size="small" />
              <h2>{UserInfo.fullname}</h2>
              <h3>{UserInfo.accountType}</h3>
              {GetNavItem('profile-settings', UserInfo.roles)}
            </div>
            <SidebarNav handleLogOut={this.props.handleLogOut} roles={UserInfo.roles} />
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
      </div>
    );
  }
}

export default SidebarLeftPush;
