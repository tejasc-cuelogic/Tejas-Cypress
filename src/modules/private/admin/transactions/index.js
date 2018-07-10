import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageTransactions from './containers/ManageTransactions';
import TransactionDetails from './containers/TransactionDetails';

export default class Transactions extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageTransactions} />
        <Route exact path={`${match.url}/:id`} component={TransactionDetails} />
      </Switch>
    );
  }
}
