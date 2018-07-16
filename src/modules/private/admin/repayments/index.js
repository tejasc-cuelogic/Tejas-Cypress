import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageRepayments from './containers/ManageRepayments';
import RepaymentDetails from './containers/RepaymentDetails';

export default class Repayments extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageRepayments} />
        <Route exact path={`${match.url}/:id`} component={RepaymentDetails} />
      </Switch>
    );
  }
}
