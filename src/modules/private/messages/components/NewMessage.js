import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Button } from 'semantic-ui-react';
import Compose from './Compose';

@inject('messageStore', 'uiStore')
@observer
export default class NewMessage extends Component {
  render() {
    return (
      <div className="message-wrap">
        <div className="message-head">
          <Header as="h3">New Message</Header>
        </div>
        <div className="message-body">
          <Form>
            <Form.Field>
              {/* eslint-disable jsx-a11y/label-has-for  */}
              <label>Send a message to</label>
              <Input fluid icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Type a name or multiple names" />
            </Form.Field>
          </Form>
          <div className="new-msg-intro">
            <Header as="h3">
              Need to contact with our support?
              <Header.Subheader>Let us know how we can help.</Header.Subheader>
            </Header>
            <Button primary content="Contact with support" />
          </div>
        </div>
        <Compose />
      </div>
    );
  }
}
