import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Responsive, Sidebar, Menu, Button, Image, Divider, Icon } from 'semantic-ui-react';
import NotificationPanel from './NotificationPanel';
import uiStore from '../../stores/uiStore';
import { SidebarNav, GetNavItem } from './SidebarNav';
import Randavatar from './../../theme/common/Randavatar';
import LogoWhite from '../../assets/images/nextseed_logo_white_green.svg';
import LogoColor from '../../assets/images/nextseed_logo_color.svg';
import LogoSmall from '../../assets/images/ns-logo-small.svg';
import Spinner from '../ui/Spinner';

@inject('uiStore', 'userStore', 'profileStore', 'accountStore', 'userDetailsStore')
@observer
class SidebarLeftPush extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');
  toggleVisibilityMobile = () => uiStore.updateLayoutState('leftPanelMobile');
  isVerified(cipStatus) {
    return this.props.accountStore.validAccStatus.includes(cipStatus);
  }
  createdAccount = (accounts) => {
    if (accounts.length) {
      return accounts[0].accountType;
    }
    return null;
  }
  render() {
    const UserInfo = { ...this.props.UserInfo };
    const { currentUser } = this.props.userDetailsStore;
    const { verifyIdentity01 } = this.props.profileStore;
    if (!currentUser.data.user) {
      return (
        <div>
          <Spinner loaderMessage="Loading..." />
        </div>
      );
    }
    return (
      <div>
        {/* Desktop Menu */}
        <Responsive minWidth={1200}>
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation="push"
              width="thin"
              visible={uiStore.layoutState.leftPanel}
              icon
              vertical
              inverted={(UserInfo.roles[0] !== 'investor')}
              className={UserInfo.roles[0]}
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
              {verifyIdentity01.response.message &&
                <SidebarNav
                  isUserVerified={this.isVerified(verifyIdentity01.response.message)}
                  handleLogOut={this.props.handleLogOut}
                  roles={UserInfo.roles}
                />
              }
              {!verifyIdentity01.response.message && currentUser.data.user &&
                <SidebarNav
                  isUserVerified={this.isVerified(currentUser.data.user.legalDetails.cipStatus)}
                  createdAccount={this.createdAccount(currentUser.data.user.accounts)}
                  handleLogOut={this.props.handleLogOut}
                  roles={UserInfo.roles}
                />
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
        </Responsive>
        {/* Mobile Menu */}
        <Responsive maxWidth={1199}>
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation="overlay"
              width="thin"
              visible={uiStore.layoutState.leftPanelMobile}
              icon
              vertical
              inverted={(UserInfo.roles[0] !== 'investor')}
              className={UserInfo.roles[0]}
            >
              <Image
                src={(UserInfo.roles[0] !== 'investor' ? LogoWhite : LogoColor)}
                alt="NextSeed.com"
                className="logo"
              />
              <Icon onClick={this.toggleVisibilityMobile} className="ns-close-light" />
              <div className="user-picture">
                <Randavatar name={UserInfo.fullname} accountType={UserInfo.accountType} avatarKey={UserInfo.avatarKey} size="small" />
                <h2>{UserInfo.fullname}</h2>
                {GetNavItem('profile-settings', UserInfo.roles)}
              </div>
              <Divider />
              {verifyIdentity01.response.message &&
                <SidebarNav
                  isUserVerified={this.isVerified(verifyIdentity01.response.message)}
                  handleLogOut={this.props.handleLogOut}
                  roles={UserInfo.roles}
                />
              }
              {!verifyIdentity01.response.message && currentUser.data.user &&
                <SidebarNav
                  isUserVerified={this.isVerified(currentUser.data.user.legalDetails.cipStatus)}
                  handleLogOut={this.props.handleLogOut}
                  roles={UserInfo.roles}
                />
              }
            </Sidebar>
            <Sidebar.Pusher>
              <Icon onClick={this.toggleVisibilityMobile} className="hamburger content" />
              {this.props.children}
            </Sidebar.Pusher>
            <NotificationPanel status={uiStore.layoutState.notificationPanel} />
          </Sidebar.Pushable>
        </Responsive>
      </div>
    );
  }
}

export default SidebarLeftPush;
