import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import Overview from './accountDetails/Overview';
import Transactions from '../../../../investor/accountDetails/containers/Transactions';
import Investments from './accountDetails/Investments';

const navMeta = [
  { title: 'Overview', to: 'overview' },
  { title: 'Transactions', to: 'transactions' },
  { title: 'Investments', to: 'investments' },
];

@inject('userDetailsStore')
@withRouter
@observer
export default class AccountDetails extends Component {
  render() {
    const { match } = this.props;
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route exact path={`${match.url}/investments`} component={Investments} />
            <Route exact path={`${match.url}/transactions`} render={props => <Transactions isAdmin {...props} />} />
            <Route component={Overview} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
