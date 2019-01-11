import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageTransactions from './containers/ManageTransactions';

export default class Transactions extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact={false} path={`${match.url}`} component={ManageTransactions} />
      </Switch>
    );
  }
}
