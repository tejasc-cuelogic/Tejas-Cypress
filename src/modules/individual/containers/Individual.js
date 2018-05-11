import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import Portfolio from './Portfolio';
import BankAccount from './BankAccount';

const navItems = [
  { to: 'portfolio', component: Portfolio },
  { to: 'bank-accounts', component: BankAccount },
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
