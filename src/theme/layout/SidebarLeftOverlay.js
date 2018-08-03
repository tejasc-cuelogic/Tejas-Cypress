import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Responsive, Sidebar, Menu, Button, Icon } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import { SidebarNav, GetNavItem } from './SidebarNav';
import { UserAvatar, Logo } from '../shared';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggle = () => this.props.uiStore.updateLayoutState('leftPanel');
  toggleMobile = () => this.props.uiStore.updateLayoutState('leftPanelMobile');
  render() {
    const { layoutState } = this.props.uiStore;
    return (
      <Aux>
        <Responsive minWidth={1200}>
          <MySidebar layoutState={layoutState} toggle={this.toggle} desktop {...this.props} />
        </Responsive>
        <Responsive maxWidth={1199}>
          <MySidebar layoutState={layoutState} toggle={this.toggleMobile} mobile {...this.props} />
        </Responsive>
      </Aux>
    );
  }
}
export default SidebarLeftPush;

const MySidebar = observer(props => (
  <Sidebar.Pushable>
    {!props.match.url.includes('/business-application') ? (
      <Aux>
        <Sidebar
          as={Menu}
          animation={props.desktop ? 'push' : 'overlay'}
          width="thin"
          visible={
            props.desktop ? props.layoutState.leftPanel : props.layoutState.leftPanelMobile
          }
          icon
          vertical
          inverted={(props.UserInfo.roles[0] !== 'investor')}
          className={props.UserInfo.roles[0]}
        >
          <Logo
            className="logo"
            dataSrc={((props.layoutState.leftPanel) ?
              (props.UserInfo.roles[0] !== 'investor' ? 'LogoWhiteGreen' : 'LogoColor') :
              'LogoSmall')}
          />
          {props.mobile && <Icon onClick={props.toggle} className="ns-close-light" />}
          <div className="user-picture">
            <UserAvatar UserInfo={props.UserInfo} size={!props.layoutState.leftPanel ? 'mini' : ''} />
            <h2>{props.UserInfo.fullname}</h2>
            {GetNavItem('profile-settings', props.UserInfo.roles)}
          </div>
          <SidebarNav handleLogOut={props.handleLogOut} roles={props.UserInfo.roles} />
        </Sidebar>
        {props.desktop &&
          <Button onClick={props.toggle} className="item collapseIcon">
            <i className={`angle ${(props.layoutState.leftPanel) ? 'left' : 'right'} icon`} />
            <span>Collapse</span>
          </Button>
        }
      </Aux>
    ) : <SidebarNav roles={props.UserInfo.roles} onlyMount />
    }
    <Sidebar.Pusher
      className={`${props.match.url.includes('/business-application') ?
        'business-application' : ''} ${props.uiStore.devBanner ? 'banner' : ''}`}
    >
      {props.mobile && <Icon onClick={props.toggle} className="hamburger content" />}
      {props.children}
    </Sidebar.Pusher>
    <NotificationPanel status={props.layoutState.notificationPanel} />
  </Sidebar.Pushable>
));
