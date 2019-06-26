import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Icon, Confirm } from 'semantic-ui-react';
import Body from './Body';
import Compose from './Compose';

@inject('messageStore', 'uiStore')
@observer
export default class MessagesWrap extends Component {
  componentWillMount() {
    this.props.messageStore.getMessageDetails(this.props.match.params.id);
  }

  confirmDelete = (e, { entity, refid }) => {
    e.stopPropagation();
    this.props.uiStore.setConfirmBox(entity, refid);
    return true;
  }

  delete = () => {
    this.props.messageStore.deleteMessage(this.props.match.params.id);
    this.props.uiStore.setConfirmBox('', '', '', false);
  }

  render() {
    const { uiStore, messageStore } = this.props;
    const { thread, tError, tLoading } = messageStore;
    return (
      <div className="message-wrap">
        <div className="message-head">
          <Button.Group className="pull-right">
            <Button icon className="link-button">
              <Icon className="ns-replay" flipped="horizontally" />
            </Button>
            <Button entity="message" onClick={this.confirmDelete} icon className="link-button">
              <Icon className="ns-trash" />
            </Button>
          </Button.Group>
          <Header as="h4">Business model</Header>
        </div>
        <Body current="2" thread={thread} error={tError} loading={tLoading} />
        <Compose />
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this message?"
          open={uiStore.confirmBox.entity === 'message'}
          onCancel={() => uiStore.setConfirmBox('', '', '', false)}
          onConfirm={this.delete}
          size="tiny"
          className="deletion"
        />
      </div>
    );
  }
}
