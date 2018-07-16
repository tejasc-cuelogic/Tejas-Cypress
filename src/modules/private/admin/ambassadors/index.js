import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageAmbassadors from './containers/ManageAmbassadors';
import AmbassadorDetails from './containers/AmbassadorDetails';

export default class Ambassadors extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageAmbassadors} />
        <Route exact path={`${match.url}/:id`} component={AmbassadorDetails} />
      </Switch>
    );
  }
}
