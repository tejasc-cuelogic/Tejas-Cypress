import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageTeam from './containers/ManageTeam';
import TeamDetails from './containers/TeamDetails';

export default class Team extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageTeam} />
        <Route exact path={`${match.url}/:id`} component={TeamDetails} />
      </Switch>
    );
  }
}
