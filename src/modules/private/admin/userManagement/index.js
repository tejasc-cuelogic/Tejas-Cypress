import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Users from './containers/Users';
import UserDetails from './containers/UserDetails';
import UsersNew from './containers/UsersNew';

export default class UserManagement extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Users} />
        <Route exact path={`${match.url}/new`} component={UsersNew} />
        <Route path={`${match.url}/:userId`} render={props => <UserDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
