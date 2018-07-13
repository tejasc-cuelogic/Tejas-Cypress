import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageActivities from './containers/ManageActivities';
import ActivityDetails from './containers/ActivityDetails';

export default class Activities extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageActivities} />
        <Route exact path={`${match.url}/:id`} component={ActivityDetails} />
      </Switch>
    );
  }
}
