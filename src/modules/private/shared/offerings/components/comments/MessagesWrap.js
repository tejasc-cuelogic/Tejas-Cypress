import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Confirm } from 'semantic-ui-react';
import Body from './Body';
import Compose from './Compose';

@inject('messageStore', 'uiStore', 'userDetailsStore')
@observer
export default class MessagesWrap extends Component {
  confirmDelete = (e, id) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox('message', id);
    return true;
  }

  commentEditHandler = (e, id, comment, scope) => {
    e.preventDefault();
    this.props.messageStore.setCommentForEdit(id, comment, scope);
  }
  deleteCommentHandler = (id) => {
    this.props.uiStore.setConfirmBox('', '', '', false);
    this.props.messageStore.deleteMessage(id);
  }
  render() {
    const {
      uiStore, messageStore, userDetailsStore, isIssuer,
    } = this.props;
    const {
      thread, approveComment, buttonLoader, currentOfferingIssuerId, threadMainMessage,
    } = messageStore;
    const threadMessages = threadMainMessage.concat(thread);
    const { currentUserId } = userDetailsStore;
    return (
      <div className="message-wrap">
        <Body
          currentOfferingIssuerId={currentOfferingIssuerId}
          buttonLoader={buttonLoader}
          isIssuer={isIssuer}
          approveComment={approveComment}
          currentUserId={currentUserId}
          thread={threadMessages}
          commentEditHandler={this.commentEditHandler}
          deleteCommentHandler={this.confirmDelete}
        />
        <Compose isIssuer={isIssuer} />
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this message?"
          open={uiStore.confirmBox.entity === 'message'}
          onCancel={() => uiStore.setConfirmBox('', '', '', false)}
          onConfirm={() => this.deleteCommentHandler(uiStore.confirmBox.refId)}
          size="tiny"
          className="deletion"
        />
      </div>
    );
  }
}
