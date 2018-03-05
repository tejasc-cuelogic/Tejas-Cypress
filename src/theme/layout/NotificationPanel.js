import React from 'react';
import _ from 'lodash';
import Aux from 'react-aux';
import { Divider, Icon, Button, Dropdown, Accordion } from 'semantic-ui-react'; // Dropdown, Accordion, Form, , Grid, Icon, Button

const notificationPanel = (props) => {
  const { activeIndex } = 0;

  const Notifications = {
    set_up_your_account: [
      { time: '2 mins ago', operation: 'Connect your', module: 'Bank Account' },
      { time: '1 day ago', operation: 'Complete your', module: 'SSN number' },
    ],
    new_account_activity: [
      {
        time: '2 mins ago', who: 'Bravery', operation: 'has sent', module: 'a new repayment', money: '8459.78',
      },
      {
        time: '1 day ago', who: 'Pokeology', operation: 'has achieved', module: 'minimum raise',
      },
      {
        time: '2 days ago', who: 'Pokeology', operation: 'has added', module: 'New Update',
      },
    ],
  };

  const NotificationActions = (
    <Dropdown icon="dropdown" pointing="right" className="icon pull-right">
      <Dropdown.Menu>
        <Dropdown.Item text="Remind me later" />
        <Dropdown.Item text="Dismiss" />
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className={`notification-panel ${(props.status) ? 'slide-in animating' : ''}`}>
      <h3>Notifications center</h3>
      {
        Object.keys(Notifications).map((item, key) => (
          <Aux key={item}>
            <p className="title">{_.replace(item, '_', '')}</p>
            { _.map(Notifications[item], notification => (
              <div className="notification-box" key={notification.module}>
                <span className="timestamp">{notification.time}</span>
                {NotificationActions}
                <Divider clearing hidden />
                <Accordion inverted>
                  <Accordion.Title index={0} onClick={this.handleClick}>
                    <strong>{notification.who}</strong> {notification.operation}
                    <strong> {notification.module}</strong>
                    <Icon name="angle down" />
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                    <p>Lorem ipsum doller sit amit, Pokeology has achieved minimum raise</p>
                  </Accordion.Content>
                </Accordion>
                {notification.money &&
                  <Button inverted size="small" color="green" className="link-button"><Icon name="line graph" />See full portfolio stats</Button>
                }
              </div>
            ))}
            {key < Object.keys(Notifications).length - 1 &&
              <Divider inverted section />
            }
          </Aux>
          ))
      }
    </div>
  );
};

export default notificationPanel;
