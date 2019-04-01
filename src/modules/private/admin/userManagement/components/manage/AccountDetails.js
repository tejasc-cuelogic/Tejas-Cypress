import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { includes, get } from 'lodash';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import Overview from './accountDetails/Overview';
import Transactions from '../../../../investor/accountDetails/containers/Transactions';
import Portfolio from '../../../../investor/accountDetails/containers/Portfolio';
import ActivityHistory from '../../../../shared/ActivityHistory';

const navMeta = [
  { title: 'Overview', to: 'overview' },
  { title: 'Transactions', to: 'transactions' },
  { title: 'Investments', to: 'investments' },
  { title: 'Activity', to: 'activity' },
];

@inject('userDetailsStore')
@withRouter
@observer
export default class AccountDetails extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
  }
  render() {
    const { match } = this.props;
    const { currentActiveAccountDetailsOfSelectedUsers } = this.props.userDetailsStore;
    const account = currentActiveAccountDetailsOfSelectedUsers;
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route exact path={`${match.url}/activity`} render={props => <ActivityHistory resourceId={get(account, 'details.accountId')} module="userDetails" showFilters={['activityType', 'activityUserType']} {...props} />} />
            <Route exact path={`${match.url}/investments`} render={props => <Portfolio isAdmin {...props} />} />
            <Route exact path={`${match.url}/transactions`} render={props => <Transactions isAdmin {...props} />} />
            <Route component={Overview} isAdmin />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
