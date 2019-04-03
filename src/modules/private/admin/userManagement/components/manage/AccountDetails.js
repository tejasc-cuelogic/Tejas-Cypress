import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid, Divider, Button } from 'semantic-ui-react';
import { includes, get } from 'lodash';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import Overview from './accountDetails/Overview';
import Transactions from '../../../../investor/accountDetails/containers/Transactions';
import Portfolio from '../../../../investor/accountDetails/containers/Portfolio';
import ActivityHistory from '../../../../shared/ActivityHistory';
// import Statements from '../../../../investor/accountDetails/containers/Statements';
import MonthlyStatements from '../../../../investor/accountDetails/components/statements/MonthlyStatements';
import TaxForms from '../../../../investor/accountDetails/components/statements/TaxForms';
import { NEXTSEED_BOX_URL } from '../../../../../../constants/common';
import Helper from '../../../../../../helper/utility';

const navMeta = [
  { title: 'Overview', to: 'overview' },
  { title: 'Transactions', to: 'transactions' },
  { title: 'Investments', to: 'investments' },
  { title: 'Monthly Statements', to: 'statements' },
  { title: 'Tax Forms', to: 'tax-forms' },
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
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
  }
  getUserStorageDetails = (e) => {
    e.preventDefault();
    const userId = get(this.props.userDetailsStore.getDetailsOfUser, 'id');
    if (userId) {
      this.props.userDetailsStore.getUserStorageDetails(userId).then((folderId) => {
        if (folderId) {
          window.open(`${NEXTSEED_BOX_URL}folder/${folderId}`, '_blank');
        } else {
          Helper.toast('Box folder is not created for this user', 'error');
        }
      });
    }
  }
  render() {
    const { match } = this.props;
    const { currentActiveAccountDetailsOfSelectedUsers } = this.props.userDetailsStore;
    const account = currentActiveAccountDetailsOfSelectedUsers;
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
          <Divider hidden />
          <Button color="blue" className="link-button" content="Users Box Account" onClick={this.getUserStorageDetails} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route exact path={`${match.url}/activity`} render={props => <ActivityHistory resourceId={get(account, 'details.accountId')} module="userDetails" showFilters={['activityType', 'activityUserType']} {...props} />} />
            <Route exact path={`${match.url}/statements`} render={props => <MonthlyStatements isAdmin {...props} />} />
            <Route exact path={`${match.url}/tax-forms`} render={props => <TaxForms isAdmin {...props} />} />
            <Route exact path={`${match.url}/investments`} render={props => <Portfolio isAdmin {...props} />} />
            <Route exact path={`${match.url}/transactions`} render={props => <Transactions isAdmin {...props} />} />
            <Route exact path={`${match.url}/overview`} render={props => <Overview isAdmin {...props} />} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
