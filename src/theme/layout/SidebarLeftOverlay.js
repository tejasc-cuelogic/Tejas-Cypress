import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Button, Image, Dropdown, Accordion, Form, Divider, Grid } from 'semantic-ui-react';
import uiStore from '../../stores/uiStore';
import Userimage from '../../assets/images/james-wright.png';

@inject('uiStore')
@observer
class SidebarLeftPush extends Component {
  toggleVisibility = () => uiStore.updateLayoutState('leftPanel');

  render() {
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
        <div className={`notification-panel ${(uiStore.layoutState.notificationPanel) ? 'slide-in animating' : ''}`}>
          <h3>Notification center</h3>
          <p className="title">Set up your account</p>
          <div className="notification-box">
            <span className="timestamp">2 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0}>
                Connect your <strong>Bank Account</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <Form inverted size="small">
                  <div stacked>
                    <Form.Input
                      fluid
                      label="Bank Account number"
                      placeholder="XXX-XX-XXXX"
                    />
                    <Button inverted size="small" color="green" className="link-button">Submit number</Button>
                    <Button inverted size="small" basic className="link-button">Remind me later</Button>
                  </div>
                </Form>
              </Accordion.Content>
            </Accordion>
          </div>
          <div className="notification-box">
            <span className="timestamp">1 days ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                Complete your <strong>SSN number</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <Form inverted size="small">
                  <div stacked>
                    <Form.Input
                      fluid
                      label="SSN number"
                      placeholder="XXX-XX-XXXX"
                    />
                    <Button inverted size="small" color="green" className="link-button">Submit number</Button>
                    <Button inverted size="small" basic className="link-button">Remind me later</Button>
                  </div>
                </Form>
              </Accordion.Content>
            </Accordion>
          </div>
          <Divider inverted section />
          <p className="title">New account activity</p>
          <div className="notification-box">
            <span className="timestamp">2 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Divider clearing hidden />
            <Grid>
              <Grid.Row>
                <Grid.Column width={9}>
                  <p><strong>Bravery</strong> has sent <strong>a new repayment</strong></p>
                </Grid.Column>
                <Grid.Column width={7} textAlign="right">
                  <h4 className="amount">$234.30</h4>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Button inverted size="small" color="green" className="link-button"><Icon name="line graph" />See full portfolio stats</Button>
          </div>
          <div className="notification-box">
            <span className="timestamp">15 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <strong>Pokeology</strong> has achieved <strong>minimum raise</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>Lorem ipsum doller sit amit, Pokeology has achieved minimum raise</p>
              </Accordion.Content>
            </Accordion>
          </div>
          <div className="notification-box">
            <span className="timestamp">15 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <strong>Pokeology</strong> has added <strong>New Update</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>Lorem ipsum doller sit amit, slightly domed and divided by arches sections.</p>
              </Accordion.Content>
            </Accordion>
          </div>
          <div className="notification-box">
            <span className="timestamp">2 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Divider clearing hidden />
            <Grid>
              <Grid.Row>
                <Grid.Column width={9}>
                  <p><strong>Bravery</strong> has sent <strong>a new repayment</strong></p>
                </Grid.Column>
                <Grid.Column width={7} textAlign="right">
                  <h4 className="amount">$8459.78</h4>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Button inverted size="small" color="green" className="link-button"><Icon name="line graph" />See full portfolio stats</Button>
          </div>
          <div className="notification-box">
            <span className="timestamp">15 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <strong>Pokeology</strong> has achieved <strong>minimum raise</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>Lorem ipsum doller sit amit, Pokeology has achieved minimum raise</p>
              </Accordion.Content>
            </Accordion>
          </div>
          <div className="notification-box">
            <span className="timestamp">15 mins ago</span>
            <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
              <Dropdown.Menu>
                <Dropdown.Item text="Remind me later" />
                <Dropdown.Item text="Dismiss" />
              </Dropdown.Menu>
            </Dropdown>
            <Accordion inverted>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <strong>Pokeology</strong> has added <strong>New Update</strong>
                <Icon name="angle down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>Lorem ipsum doller sit amit, slightly domed and divided by arches sections.</p>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
