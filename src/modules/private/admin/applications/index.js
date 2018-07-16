import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageApplications from './containers/ManageApplications';
import ApplicationDetails from './containers/ApplicationDetails';

export default class Applications extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageApplications} />
        <Route exact path={`${match.url}/:id`} component={ApplicationDetails} />
      </Switch>
    );
  }
}
