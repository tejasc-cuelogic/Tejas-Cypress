import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header } from 'semantic-ui-react';
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
          inner content ...
        </div>
        <Compose />
      </div>
    );
  }
}
