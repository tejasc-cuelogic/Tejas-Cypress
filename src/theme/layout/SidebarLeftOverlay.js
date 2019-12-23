import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Responsive, Sidebar, Menu, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';
import NotificationPanel from './NotificationPanel';
import { SidebarNav } from './SidebarNav';
import { UserAvatar, Image64 } from '../shared';
import FireworksAnimation from '../../modules/public/offering/components/investNow/agreement/components/FireworkAnimation';
import NavBarMobile from './NavBarMobile';

const progressMap = ['viewLoanAgreement', 'portfolio'];

@inject('uiStore', 'navStore', 'userStore')
@withRouter
@observer
class SidebarLeftPush extends Component {
  toggle = () => this.props.uiStore.updateLayoutState('leftPanel');

  toggleMobile = () => this.props.uiStore.updateLayoutState('leftPanelMobile');

  render() {
    const { layoutState, showFireworkAnimation } = this.props.uiStore;
    return (
      <>
        {showFireworkAnimation
          && <FireworksAnimation />
        }
        {progressMap.includes(this.props.uiStore.inProgress)
          && (
            <Dimmer active={this.props.uiStore.inProgress} className="fullscreen">
              <Loader active={this.props.uiStore.inProgress} />
            </Dimmer>
          )
        }
        <Responsive minWidth={992}>
          <MySidebar layoutState={layoutState} toggle={this.toggle} desktop {...this.props} />
        </Responsive>
        <Responsive maxWidth={991}>
          {this.props.userStore.isInvestor
            ? (
              <NavBarMobile
                onPusherClick={this.handlePusher}
                onToggle={this.toggleMobile}
                visible={layoutState.leftPanelMobile}
                handleLogOut={this.props.handleLogOut}
                isMobile
                stepInRoute={this.props.navStore.stepInRoute}
                currentUser={this.props.userStore.currentUser}
                // publicContent={this.getRoutes(isAuthLocation)}
                hasHeader
                {...this.props}
              />
            ) : <MySidebar layoutState={layoutState} toggle={this.toggleMobile} mobile {...this.props} />
          }
        </Responsive>
      </>
    );
  }
}
export default SidebarLeftPush;

const MySidebar = observer(props => (
  <Sidebar.Pushable className={`${props.match.url.includes('/business-application') ? 'business-app' : ''} ${props.userStore.isInvestor ? 'investor' : ''} private-pushable`}>
    {!props.match.url.includes('/business-application') ? (
      <>
        <Sidebar
          as={Menu}
          animation={props.desktop ? 'push' : 'overlay'}
          visible={
            props.desktop ? props.layoutState.leftPanel : props.layoutState.leftPanelMobile
          }
          vertical
          inverted={(props.UserInfo.roles[0] !== 'investor')}
          className={`${props.uiStore.devBanner ? 'pb-40' : ''} ${props.UserInfo.roles[0]}`}
        >
          <Scrollbars
            className="ns-scrollbar"
            renderTrackVertical={p => <div {...p} className="track-vertical" />}
            renderThumbVertical={p => <div {...p} className="thumb-vertical" />}
            renderTrackHorizontal={p => <div {...p} className="track-horizontal" />}
            renderThumbHorizontal={p => <div {...p} className="thumb-horizontal" />}
            renderView={p => <div {...p} className="view" />}
          >
            {props.mobile && <Icon onClick={props.toggle} className="ns-close-light" />}
            <div className="user-picture">
              {props.UserInfo.avatarUrl
                ? (
                  <Image64
                    avatar
                    size={!props.layoutState.leftPanel ? 'mini' : 'huge'}
                    circular
                    srcUrl={props.UserInfo.avatarUrl}
                  />
                )
                : <UserAvatar UserInfo={props.UserInfo} size={!props.layoutState.leftPanel ? 'mini' : 'huge'} />
              }
              <p>{props.UserInfo.firstName} {props.UserInfo.lastName}</p>
            </div>
            <SidebarNav handleLogOut={props.handleLogOut} roles={props.UserInfo.roles} {...props} />
          </Scrollbars>
        </Sidebar>
      </>
    ) : <SidebarNav roles={props.UserInfo.roles} onlyMount />
    }
    <Sidebar.Pusher
      dimmed={props.mobile && props.layoutState.leftPanelMobile}
      onClick={(props.mobile && props.layoutState.leftPanelMobile) ? props.toggle : undefined}
      className={`${props.match.url.includes('/business-application')
        ? 'business-application' : ''} ${props.uiStore.devBanner ? 'banner' : ''}`}
    >
      {props.mobile && <Icon onClick={props.toggle} className="ns-hamburger" />}
      {props.children}
    </Sidebar.Pusher>
    <NotificationPanel status={props.layoutState.notificationPanel} />
  </Sidebar.Pushable>
));
