import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

class sidebarLeftOverlay extends Component {
  state = {
    showsidedrawer: false,
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showsidedrawer: false });
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      console.log('hey');
      return { showsidedrawer: !prevState.showsidedrawer };
    });
  }

  render() {
    const sidebarItems = [
      { icon: 'block layout', displayName: 'Home', to: 'dashboard' },
      { icon: 'gift', displayName: 'Bonus Rewards Fulfillment', to: 'dashboard' },
      { icon: 'users', displayName: 'User Management', to: 'dashboard' },
      { icon: 'mail', displayName: 'Messages', to: 'dashboard' },
      { icon: 'money', displayName: 'Banking', to: 'dashboard' },
      { icon: 'settings', displayName: 'Settings', to: 'dashboard' },
    ];

    return (
      <Sidebar style={{ top: '58px' }} as={Menu} animation="overlay" className={`${(this.state.showsidedrawer) ? 'collapse' : ''}`} width="thin" visible icon="labeled" vertical inverted>
        {
          sidebarItems.map(item => (
            <Menu.Item name="home" as={Link} to={`/${item.to}`}>
              <Icon name={item.icon} />
              <span>{item.displayName}</span>
            </Menu.Item>
          ))
        }
        <a onClick={() => this.sideDrawerToggleHandler(this.state.showsidedrawer)} className="item collapseIcon" role="presentation" >
          <i className={`angle double ${(this.state.showsidedrawer) ? 'left' : 'right'} icon`} />
          <span>Collapse menu</span>
        </a>
      </Sidebar>
    );
  }
}

export default sidebarLeftOverlay;
