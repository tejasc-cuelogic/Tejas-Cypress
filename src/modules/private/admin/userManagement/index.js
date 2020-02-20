import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Users from './containers/Users';
import UserDetails from './containers/UserDetails';
import UsersNew from './containers/UsersNew';
import DeleteUser from './containers/DeleteUser';

@inject('userStore')
@observer
export default class UserManagement extends Component {
  render() {
    const { match } = this.props;
    // const access = this.props.userStore.myAccessForModule('USERS');
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Users} />
        <Route exact path={`${match.url}/new`} component={UsersNew} />
        <Route exact path={`${match.url}/:userId/delete/:action`} render={props => <DeleteUser refLink={match.url} {...props} />} />
        <Route path={`${match.url}/:userId`} render={props => <UserDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
