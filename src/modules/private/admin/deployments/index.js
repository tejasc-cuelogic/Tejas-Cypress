import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageDeployments from './containers/ManageDeployments';
import DeploymentDetails from './containers/DeploymentDetails';

export default class Deployments extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageDeployments} />
        <Route exact path={`${match.url}/:id`} component={DeploymentDetails} />
      </Switch>
    );
  }
}
