import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EducationCenter from './containers/EducationCenter';
import Insights from './containers/Insights';
import InsightsDetails from './containers/InsightsDetails';

export default class Resources extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/education-center`} component={EducationCenter} />
        <Route exact path={`${match.url}/insights`} component={Insights} />
        <Route exact path={`${match.url}/insights/:id`} component={InsightsDetails} />
      </Switch>
    );
  }
}
