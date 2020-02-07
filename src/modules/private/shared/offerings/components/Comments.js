import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Card } from 'semantic-ui-react';
import { get } from 'lodash';
import MessagesList from './comments/MessagesList';
import MessagesWrap from './comments/MessagesWrap';
import { InlineLoader } from '../../../../../theme/shared';

@inject('offeringCreationStore', 'messageStore', 'userStore', 'offeringsStore')
@observer
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.props.messageStore.initRequest();
  }

  messageSelectHandler = (currentMessageId) => {
    this.props.messageStore.setDataValue('currentMessageId', currentMessageId);
    this.props.messageStore.resetMessageForm();
  }

  render() {
    const {
      match, messageStore, userStore, offeringsStore
    } = this.props;
    const {
      messages, currentMessageId, loading, error, threadUsersList, newPostComment, threadMsgCount,
    } = messageStore;
    const { offer } = offeringsStore;
    const { isIssuer, isAdmin } = userStore;
    const passedProcessingDate = false;
    const currentOfferingIssuerId = get(offer, 'issuerId');
    const campaignStage = get(offer, 'stage');
    const disablePostComment = !['CREATION', 'LIVE', 'LOCK', 'PROCESSING'].includes(campaignStage);
    if (loading) {
      return <InlineLoader />;
    }
    if (!messages.length) {
      this.props.messageStore.setDataValue('currentMessageId', null);
    }
    return (
      <Card fluid className="messages comments">
        {messages.length
          ? (
            <MessagesList
              passedProcessingDate={passedProcessingDate}
              disablePostComment={disablePostComment}
              threadMsgCount={threadMsgCount}
              newPostComment={newPostComment}
              threadUsersList={threadUsersList}
              messageSelectHandler={this.messageSelectHandler}
              match={match}
              messages={messages}
              currentMessageId={currentMessageId}
              loading={loading}
              error={error}
              isIssuer={isIssuer}
            />
          ) : null
        }
        <MessagesWrap
          passedProcessingDate={passedProcessingDate}
          isIssuer={isIssuer}
          isAdmin={isAdmin}
          currentOfferingIssuerId={currentOfferingIssuerId}
        />
      </Card>
    );
  }
}
