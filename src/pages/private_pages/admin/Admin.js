import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Sidebar from '../../../components/common/Sidebar';
import UsersList from './UsersList';
import { AdminAuthorization } from './../../../components/common/Authorization';

const routes = [
  {
    path: '/admin/users-list',
    component: UsersList,
    auth: AdminAuthorization,
  },
];


@inject('adminStore', 'userStore')
@withRouter
@observer
export default class Admin extends React.Component {
  render() {
    return (
      <div>
        <Sidebar />
        <Switch>
          {/* eslint-disable react/no-array-index-key */}
          {routes.map((route, index) => (
            <Route
              path={route.path}
              component={(route.auth) ? route.auth(route.component, this.props) : route.component}
              key={index}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
