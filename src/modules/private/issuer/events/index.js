import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageEvents from './containers/ManageEvents';
import EventDetails from './containers/EventDetails';

export default class Events extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageEvents} />
        <Route exact path={`${match.url}/:id`} component={EventDetails} />
      </Switch>
    );
  }
}
