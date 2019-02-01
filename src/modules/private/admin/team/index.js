import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageTeam from './containers/ManageTeam';
import TeamDetails from './containers/TeamDetails';
import UpdateMemberProfilePhoto from './components/UpdateMemberProfileData';

export default class Team extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={props => <ManageTeam refLink={match.url} {...props} />}
        />
        <Route
          exact
          path={`${match.url}/:id`}
          render={props => <TeamDetails refLink={match.url} {...props} />}
        />
        <Route
          exact
          path={`${match.url}/:action/update-profile-photo`}
          render={props => <UpdateMemberProfilePhoto refLink={match.url} {...props} />}
        />
      </Switch>
    );
  }
}
