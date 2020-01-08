import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Button, Grid } from 'semantic-ui-react';
import { Link, Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../PrivateHOC';
import MessagesHeader from '../components/Header';
import MessagesList from '../components/MessagesList';
import MessagesWrap from '../components/MessagesWrap';
import NewMessage from '../components/NewMessage';

@inject('messageStore')
@observer
export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.props.messageStore.initRequest();
  }

  setSearchParam = (e, { name, value }) => this.props.messageStore.setInitiateSrch(name, value);

  dateFilterStart = (date) => {
    if (date) {
      this.props.messageStore.setInitiateSrch('startDate', date);
    }
  }

  dateFilterEnd = (date) => {
    if (date) {
      this.props.messageStore.setInitiateSrch('endDate', date);
    }
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.messageStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const { match, messageStore } = this.props;
    const {
      messages, current, loading, error, requestState,
    } = messageStore;
    return (
      <PrivateLayout
        {...this.props}
        P3={(
<Grid.Column width={3} textAlign="right">
            <Button as={Link} to={`${match.url}/new`} color="green" floated="right">
              Create new message
            </Button>
          </Grid.Column>
)}
      >
        <MessagesHeader
          setSearchParam={this.setSearchParam}
          requestState={requestState}
          dateFilterStart={this.dateFilterStart}
          dateFilterEnd={this.dateFilterEnd}
        />
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
