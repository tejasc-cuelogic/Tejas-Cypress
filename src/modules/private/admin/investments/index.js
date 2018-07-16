import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageInvestments from './containers/ManageInvestments';
import InvestmentDetails from './containers/InvestmentDetails';

export default class Investments extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageInvestments} />
        <Route exact path={`${match.url}/:id`} component={InvestmentDetails} />
      </Switch>
    );
  }
}
