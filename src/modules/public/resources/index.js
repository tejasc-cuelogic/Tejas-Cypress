import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EducationCenter from './containers/EducationCenter';
import Insights from './containers/Insights';

export default class Resources extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/education-center`} component={EducationCenter} />
        <Route path={`${match.url}/insights`} component={Insights} />
      </Switch>
    );
  }
}
