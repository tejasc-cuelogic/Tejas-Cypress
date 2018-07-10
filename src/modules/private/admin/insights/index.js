import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageInsights from './containers/ManageInsights';
import InsightDetails from './containers/InsightDetails';

export default class Insights extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageInsights} />
        <Route exact path={`${match.url}/:id`} component={InsightDetails} />
      </Switch>
    );
  }
}
