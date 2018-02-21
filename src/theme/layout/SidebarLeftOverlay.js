import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Button, Image, Dropdown, Accordion } from 'semantic-ui-react';
import uiStore from '../../stores/uiStore';
import Userimage from '../../assets/images/james-wright.png';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
    // const { visible } = uiStore.notificationPanel;
    const sidebarItems = [
      { icon: 'block layout', displayName: 'Home', to: 'dashboard' },
      { icon: 'gift', displayName: 'Bonus Rewards Fulfillment', to: 'bonus-reward-fulfillment' },
      { icon: 'users', displayName: 'User Management', to: 'users' },
      { icon: 'mail', displayName: 'Messages', to: 'messages' },
      { icon: 'money', displayName: 'Banking', to: 'banking' },
      { icon: 'settings', displayName: 'Settings', to: 'settings' },
    ];
    const { activeIndex } = 0;

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
        <div className={`notification-panel ${(uiStore.layoutState.notificationPanel) ? 'slide-in' : ''} icon`}>
          <h3>Notification center</h3>
          <p className="title">Set up your account</p>
          <div className="notification-box">
            <span className="timestamp">2 days ago</span>
            <Dropdown icon="ellipsis horizontal" pointing="right" className="icon pull-right">
              {/* <Icon name="ellipsis horizontal" size="huge" /> */}
              <Dropdown.Menu>
                <Dropdown.Header icon="tags" content="Filter by tag" />
                <Dropdown.Divider />
                <Dropdown.Item icon="attention" text="Important" />
                <Dropdown.Item icon="comment" text="Announcement" />
                <Dropdown.Item icon="conversation" text="Discussion" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0}>
                Connect your <strong>Bank Account</strong>
                <Icon name="dropdown" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
                  {' '}it can be found as a
                  {' '}welcome guest in many households across the world.
                </p>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
