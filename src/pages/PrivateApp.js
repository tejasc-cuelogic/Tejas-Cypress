import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Admin from './admin/Admin';
import Authorization from '../components/common/Authorization';
import NotFound from '../components/common/NotFound';

const AdminAuthorization = Authorization(['admin'], NotFound);

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
        </Switch>
      </div>
    );
  }
}
