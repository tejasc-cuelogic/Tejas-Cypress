import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Confirm } from 'semantic-ui-react';
import Body from './Body';
import Compose from './Compose';

@inject('messageStore', 'uiStore', 'userDetailsStore')
@observer
export default class MessagesWrap extends Component {
  confirmDelete = (e, id, type = 'message') => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(type, id);
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

  approveCommentHandler = (e, id) => {
    this.props.uiStore.setConfirmBox('', '', '', false);
    this.props.messageStore.approveComment(e, id);
  }

  render() {
    const {
      uiStore, messageStore, userDetailsStore, isIssuer, passedProcessingDate, isAdmin,
    } = this.props;
    const {
      thread, buttonLoader, currentOfferingIssuerId, threadMainMessage,
    } = messageStore;
    const threadMessages = threadMainMessage.concat(thread);
    const { currentUserId } = userDetailsStore;
    return (
      <div className="message-wrap">
        <Body
          currentOfferingIssuerId={currentOfferingIssuerId}
          buttonLoader={buttonLoader}
          isIssuer={isIssuer}
          currentUserId={currentUserId}
          thread={threadMessages}
          commentEditHandler={this.commentEditHandler}
          deleteCommentHandler={this.confirmDelete}
          isAdmin={isAdmin}
        />
        {!passedProcessingDate
        && <Compose isIssuer={isIssuer} />
        }
        <Confirm
          header="Confirm"
          content={`${uiStore.confirmBox.entity === 'message' ? 'Are you sure you want to delete this message?' : 'This comment will be immediately posted to the public campaign page and sent via email to any participants in this comment thread.'}`}
          open={uiStore.confirmBox.entity === 'message' || uiStore.confirmBox.entity === 'APPROVE'}
          onCancel={() => uiStore.setConfirmBox('', '', '', false)}
          // eslint-disable-next-line no-unused-expressions
          onConfirm={(e) => { uiStore.confirmBox.entity === 'message' ? this.deleteCommentHandler(uiStore.confirmBox.refId) : this.approveCommentHandler(e, uiStore.confirmBox.refId); }}
          size="tiny"
          confirmButton={uiStore.confirmBox.entity === 'message' ? 'Delete' : 'Approve'}
          className={uiStore.confirmBox.entity === 'message' ? 'deletion' : 'approval'}
        />
      </div>
    );
  }
}
