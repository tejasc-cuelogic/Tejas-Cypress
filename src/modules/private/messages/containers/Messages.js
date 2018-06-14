import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Button, Grid } from 'semantic-ui-react';
import { Link, Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import MessagesHeader from '../components/Header';
import MessagesList from '../components/MessagesList';
import MessagesWrap from '../components/MessagesWrap';
import NewMessage from '../components/NewMessage';

@inject('messageStore')
@observer
export default class Messages extends Component {
  componentWillMount() {
    this.props.messageStore.initRequest();
  }
  render() {
    const { match, messageStore } = this.props;
    const {
      messages, current, loading, error,
    } = messageStore;
    return (
      <PrivateLayout
        {...this.props}
        P3={
          <Grid.Column width={3} textAlign="right">
            <Button as={Link} to={`${match.url}/new`} color="green" floated="right">
              Create new message
            </Button>
          </Grid.Column>
        }
      >
        <MessagesHeader />
        <Card fluid className="messages">
          <MessagesList
            match={match}
            messages={messages}
            current={current}
            loading={loading}
            error={error}
          />
          <Switch>
            <Route exact path={`${match.url}/new`} component={NewMessage} />
            <Route exact path={`${match.url}/:id`} component={MessagesWrap} />
          </Switch>
        </Card>
      </PrivateLayout>
    );
  }
}
