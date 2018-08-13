import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateHOC';
import ManageCrowdPay from './containers/ManageCrowdPay';
import CrowdPayDetails from './containers/CrowdPayDetails';

export default class CrowdPay extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props}>
        <Switch>
          <Route exact path={`${match.url}`} component={ManageCrowdPay} />
          <Route exact path={`${match.url}/:id`} component={CrowdPayDetails} />
        </Switch>
      </PrivateLayout>
    );
  }
}
