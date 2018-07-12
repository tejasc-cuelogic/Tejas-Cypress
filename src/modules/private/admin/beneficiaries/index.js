import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageBeneficiaries from './containers/ManageBeneficiaries';
import BeneficiaryDetails from './containers/BeneficiaryDetails';

export default class Beneficiaries extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageBeneficiaries} />
        <Route exact path={`${match.url}/:id`} component={BeneficiaryDetails} />
      </Switch>
    );
  }
}
