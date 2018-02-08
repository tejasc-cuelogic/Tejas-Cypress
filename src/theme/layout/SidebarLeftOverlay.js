import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, Icon, Button } from 'semantic-ui-react';

// class sidebarLeftOverlay extends Component {
//   state = {
//     showsidedrawer: false,
//   }

// sideDrawerClosedHandler = () => {
//   this.setState({ showsidedrawer: false });
// }

// sideDrawerToggleHandler = () => {
//   this.setState((prevState) => {
//     console.log('hey');
//     return { showsidedrawer: !prevState.showsidedrawer };
//   });
// }
class SidebarLeftPush extends Component {
  state = { visible: false }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state;
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
        <Sidebar as={Menu} animation="push" width="thin" visible={visible} icon="labeled" vertical inverted>
          {
            sidebarItems.map(item => (
              <Menu.Item key={item.to} name="home" as={Link} to={`/${item.to}`}>
                <Icon name={item.icon} />
                <span>{item.displayName}</span>
              </Menu.Item>
            ))
          }
          <Button onClick={this.toggleVisibility} className="item collapseIcon">
            <i className={`angle double ${(this.state.visible) ? 'left' : 'right'} icon`} />
            <span>Collapse menu</span>
          </Button>
        </Sidebar>
        <Sidebar.Pusher>
          <div className="ui vertical segment content">
            <div className="ui container fluid">
              {this.props.children}
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
