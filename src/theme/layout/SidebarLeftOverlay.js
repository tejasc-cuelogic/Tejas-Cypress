import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Responsive, Sidebar, Menu, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';
import NotificationPanel from './NotificationPanel';
import { SidebarNav } from './SidebarNav';
import { UserAvatar, Logo, Image64 } from '../shared';
import FireworksAnimation from '../../modules/public/offering/components/investNow/agreement/components/FireworkAnimation';

const progressMap = ['viewLoanAgreement', 'portfolio'];

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggle = () => this.props.uiStore.updateLayoutState('leftPanel');
  toggleMobile = () => this.props.uiStore.updateLayoutState('leftPanelMobile');
  render() {
    const { layoutState, showFireworkAnimation } = this.props.uiStore;
    return (
      <Aux>
        {showFireworkAnimation &&
        <FireworksAnimation />
        }
        {progressMap.includes(this.props.uiStore.inProgress) &&
          <Dimmer active={this.props.uiStore.inProgress} className="fullscreen">
            <Loader active={this.props.uiStore.inProgress} />
          </Dimmer>
        }
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
          visible={
            props.desktop ? props.layoutState.leftPanel : props.layoutState.leftPanelMobile
          }
          vertical
          inverted={(props.UserInfo.roles[0] !== 'investor')}
          className={props.UserInfo.roles[0]}
        >
          <Scrollbars
            className="ns-scrollbar"
            renderTrackVertical={p => <div {...p} className="track-vertical" />}
            renderThumbVertical={p => <div {...p} className="thumb-vertical" />}
            renderTrackHorizontal={p => <div {...p} className="track-horizontal" />}
            renderThumbHorizontal={p => <div {...p} className="thumb-horizontal" />}
            renderView={p => <div {...p} className="view" />}
          >
            <Link to="/" className="logo-wrapper">
              <Logo
                className="logo"
                dataSrc={((props.layoutState.leftPanel) ?
                  (props.UserInfo.roles[0] !== 'investor' ? 'LogoWhiteGreen' : 'LogoGreenGrey') :
                  'LogoSmall')}
              />
            </Link>
            {props.mobile && <Icon onClick={props.toggle} className="ns-close-light" />}
            <div className="user-picture">
              {props.UserInfo.avatarUrl ?
                <Image64
                  avatar
                  size={!props.layoutState.leftPanel ? 'mini' : 'huge'}
                  circular
                  srcUrl={props.UserInfo.avatarUrl}
                /> :
                <UserAvatar UserInfo={props.UserInfo} size={!props.layoutState.leftPanel ? 'mini' : 'huge'} />
              }
              <p>{props.UserInfo.firstName} {props.UserInfo.lastName}</p>
            </div>
            <SidebarNav handleLogOut={props.handleLogOut} roles={props.UserInfo.roles} {...props} />
          </Scrollbars>
        </Sidebar>
        {/* {props.desktop &&
          <Button onClick={props.toggle} className="item collapseIcon">
            <i className={`angle ${(props.layoutState.leftPanel) ? 'left' : 'right'} icon`} />
            <span>Collapse</span>
          </Button>
        } */}
      </Aux>
    ) : <SidebarNav roles={props.UserInfo.roles} onlyMount />
    }
    <Sidebar.Pusher
      dimmed={props.layoutState.leftPanelMobile}
      onClick={props.layoutState.leftPanelMobile ? props.toggle : undefined}
      className={`${props.match.url.includes('/business-application') ?
        'business-application' : ''} ${props.uiStore.devBanner ? 'banner' : ''}`}
    >
      {props.mobile && <Icon onClick={props.toggle} className="ns-hamburger" />}
      {props.children}
    </Sidebar.Pusher>
    <NotificationPanel status={props.layoutState.notificationPanel} />
  </Sidebar.Pushable>
));
