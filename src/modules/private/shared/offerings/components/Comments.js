import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Card } from 'semantic-ui-react';
import MessagesList from './comments/MessagesList';
import MessagesWrap from './comments/MessagesWrap';
import { InlineLoader } from '../../../../../theme/shared';

@inject('offeringCreationStore', 'messageStore', 'userStore')
@observer
export default class Comments extends Component {
  componentWillMount() {
    this.props.messageStore.initRequest();
  }
  messageSelectHandler = (currentMessageId) => {
    this.props.messageStore.setDataValue('currentMessageId', currentMessageId);
    this.props.messageStore.resetMessageForm();
  }
  render() {
    const { match, messageStore, userStore } = this.props;
    const {
      messages, currentMessageId, loading, error, threadUsersList, newPostComment,
    } = messageStore;
    const { isIssuer } = userStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Card fluid className="messages comments">
        {messages.length ?
          <MessagesList
            newPostComment={newPostComment}
            threadUsersList={threadUsersList}
            messageSelectHandler={this.messageSelectHandler}
            match={match}
            messages={messages}
            currentMessageId={currentMessageId}
            loading={loading}
            error={error}
            isIssuer={isIssuer}
          /> : null
        }
        <MessagesWrap isIssuer={isIssuer} />
      </Card>
    );
  }
}
