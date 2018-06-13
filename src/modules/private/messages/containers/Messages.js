import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import MessagesHeader from '../components/Header';
import MessagesList from '../components/MessagesList';
import MessagesWrap from '../components/MessagesWrap';

@inject('messageStore')
@observer
export default class Messages extends Component {
  componentWillMount() {
    this.props.messageStore.initRequest();
  }
  render() {
    const { match, messageStore } = this.props;
    const {
      messages, message, loading, error,
    } = messageStore;
    return (
      <PrivateLayout {...this.props}>
        <MessagesHeader />
        <Card fluid className="messages">
          <MessagesList
            match={match}
            messages={messages}
            message={message}
            loading={loading}
            error={error}
          />
          <Route exact path={`${match.url}/:id`} component={MessagesWrap} />
        </Card>
      </PrivateLayout>
    );
  }
}
