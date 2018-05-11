import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import { List, Grid, Icon, Button } from 'semantic-ui-react';
// import routes from '../routes';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import Portfolio from './Portfolio';
import BankAccount from './BankAccount';
import TransferFunds from './TransferFunds';

// @withRouter
export default class Individual extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props}>
        <Route exact path={`${match.url}/portfolio`} component={Portfolio} />
        <Route exact path={`${match.url}/bank-accounts`} component={BankAccount} />
        <Route exact path={`${match.url}/transfer-funds`} component={TransferFunds} />
      </PrivateLayout>
    );
  }
}
