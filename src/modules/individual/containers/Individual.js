import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import Portfolio from './Portfolio';
import TransferFunds from './TransferFunds';
import BankAccount from './BankAccount';
import Transactions from './Transactions';
import Statements from './Statements';

const navItems = [
  { to: 'portfolio', component: Portfolio },
  { to: 'transfer-funds', component: TransferFunds },
  { to: 'bank-accounts', component: BankAccount },
  { to: 'activity', component: Transactions },
  { to: 'statements', component: Statements },
];

export default class Individual extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props}>
        <Switch>
          <Route exact path={match.url} component={Portfolio} />
          {
            navItems.map(item => (
              <Route path={`${match.url}/${item.to}`} component={item.component} />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
