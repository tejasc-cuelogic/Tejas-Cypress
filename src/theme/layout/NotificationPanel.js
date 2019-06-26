import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Icon, Message, Button } from 'semantic-ui-react';

const Notifications = {
  set_up_your_account: [
    {
      id: 1, time: '2 mins ago', operation: 'Connect your', module: 'Bank Account',
    },
    {
      id: 2, time: '1 day ago', operation: 'Complete your', module: 'SSN number',
    },
    {
      id: 3, time: '15 mins ago', who: 'Mob Cycle', operation: 'has achieved', module: 'minimum raise', icon: 'ns-bar-line-chart',
    },
    {
      id: 4, time: 'Yesterday', who: 'Mob Cycle', operation: 'has sent', module: 'a new repayment', money: '233.50', icon: 'ns-cash-dollar',
    },
    {
      id: 5, time: '5/5/2018', operation: 'You have a', what: 'new message', from: 'from', module: 'NextSeed', icon: 'ns-envelope-line',
    },
  ],
};
@inject('uiStore')
@observer
class notificationPanel extends Component {
  state = { notifications: Notifications };

  dismiss = (index, action) => {
    const { notifications } = this.state;
    if (action === 0) {
      notifications.set_up_your_account[index].confirmDismiss = false;
    } else if (action === 1) {
      notifications.set_up_your_account[index].confirmDismiss = true;
    } else if (action === 2) {
      notifications.set_up_your_account.splice(index, 1);
    }
    this.setState({ notifications });
  }

  render() {
    const { layoutState } = this.props.uiStore;
    return (
      <div className={`notification-panel ${(layoutState.notificationPanel) ? 'slide-in' : ''}`}>
        <Header as="h4" inverted>
          Notifications center
          <Header.Subheader as={Button} className="link-button">
            <Icon onClick={() => this.props.uiStore.updateLayoutState('notificationPanel')} className="ns-close-light" />
          </Header.Subheader>
        </Header>
        {
          Object.keys(this.state.notifications).map(item => (
            <div className="notification-wrap" key={item}>
              { Notifications[item].map((notification, key) => (
                <Message icon onDismiss={this.handleDismiss} key={notification.module}>
                  <Message.Content>
                    <span className="timestamp">{notification.time}</span>
                    <Button icon className="link-button close" onClick={() => this.dismiss(key, 1)}>
                      <Icon className="ns-close-light" />
                    </Button>
                    <Message.Header>
                      <b>{notification.who}</b> {notification.operation} <b>{notification.what}</b> {notification.from} {' '}
                      <b>{notification.module}</b>
                    </Message.Header>
                    {notification.money
                      && <Header as="h3">${notification.money}</Header>
                    }
                    <Link to="/dashboard" className="link">See Details</Link>
                  </Message.Content>
                  {notification.icon
                    && <Icon className={notification.icon} />
                  }
                  {notification.confirmDismiss
                    && (
<div className="confirm-dismiss">
                      <p>Would you like to remove this notification?</p>
                      <Button.Group fluid>
                        <Button onClick={() => this.dismiss(key, 2)} compact color="red">
                          Remove
                        </Button>
                        <Button onClick={() => this.dismiss(key, 0)} compact inverted basic>
                          Cancel
                        </Button>
                      </Button.Group>
                    </div>
                    )
                  }
                </Message>
              ))}
            </div>
          ))
        }
      </div>
    );
  }
}

export default notificationPanel;
