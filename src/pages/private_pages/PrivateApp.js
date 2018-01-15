import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Admin from './admin/Admin';
import Business from './business/Business';
import Investor from './investor/Investor';
import Settings from './settings/Settings';

import { AdminAuthorization, BusinessAuthorization, InvestorAuthorization } from './../../components/common/Authorization';

const routes = [
  {
    path: '/settings',
    component: Settings,
  },
];

@inject('adminStore', 'commonStore', 'userStore')
@withRouter
@observer
export default class PrivateApp extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/* eslint-disable react/no-array-index-key */}
          <Route path="/admin" component={AdminAuthorization(Admin, this.props)} />
          <Route path="/business" component={BusinessAuthorization(Business, this.props)} />
          <Route path="/investor" component={InvestorAuthorization(Investor, this.props)} />
          {routes.map((route, index) => (
            <Route
              path={route.path}
              component={route.component}
              key={index}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
