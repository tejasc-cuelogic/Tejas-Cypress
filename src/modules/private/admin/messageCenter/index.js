import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageMessages from './containers/ManageMessages';
import MessageDetails from './containers/MessageDetails';

export default class MessageCentre extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageMessages} />
        <Route exact path={`${match.url}/:id`} component={MessageDetails} />
      </Switch>
    );
  }
}
