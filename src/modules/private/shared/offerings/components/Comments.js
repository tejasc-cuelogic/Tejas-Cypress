import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import MessagesList from './comments/MessagesList';
import MessagesWrap from './comments/MessagesWrap';

@inject('offeringCreationStore', 'messageStore')
@observer
export default class Comments extends Component {
  componentWillMount() {
    this.props.messageStore.initRequest();
  }
  render() {
    const { match, messageStore } = this.props;
    const {
      messages, current, loading, error,
    } = messageStore;
    return (
      <Card fluid className="messages">
        <MessagesList
          match={match}
          messages={messages}
          current={current}
          loading={loading}
          error={error}
        />
        <Switch>
          <Route exact path={`${match.url}/:id`} component={MessagesWrap} />
        </Switch>
      </Card>
    );
  }
}
