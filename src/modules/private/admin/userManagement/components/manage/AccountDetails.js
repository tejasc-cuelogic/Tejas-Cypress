import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid, Divider, Button } from 'semantic-ui-react';
import { includes, get } from 'lodash';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import Overview from './accountDetails/Overview';
import Transactions from '../../../../investor/accountDetails/containers/Transactions';
import Portfolio from '../../../../investor/accountDetails/containers/Portfolio';
import InvestmentDetails from '../../../../investor/accountDetails/containers/InvestmentDetails';
import ActivityHistory from '../../../../shared/ActivityHistory';
import Statements from '../../../../investor/accountDetails/containers/Statements';
import { NEXTSEED_BOX_URL } from '../../../../../../constants/common';
import Helper from '../../../../../../helper/utility';
import ConfirmModel from './accountDetails/ConfirmModel';
import AddWithdrawFunds from './accountDetails/AddWithdrawFunds';
import CancelInvestment from '../../../../investor/accountDetails/components/portfolio/CancelInvestment';

const navMeta = [
  { title: 'Overview', to: 'overview' },
  { title: 'Investments', to: 'investments' },
  { title: 'Transactions', to: 'transactions' },
  { title: 'Statements', to: 'statements' },
  { title: 'Activity', to: 'activity' },
];

@inject('userDetailsStore', 'uiStore', 'accountStore', 'transactionStore', 'portfolioStore')
@withRouter
@observer
export default class AccountDetails extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.params.closedAccountId) {
      this.props.accountStore.setSelectedClosedAccount(this.props.match.params.closedAccountId);
    }
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    setFieldValue('isClosedAccount', !!this.props.match.params.closedAccountId);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    this.props.portfolioStore.setFieldValue('apiCall', false);
    this.props.transactionStore.setFieldValue('apiCall', false);
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
    const { match, investorId } = this.props;
    const { inProgress } = this.props.uiStore;
    const { currentActiveAccountDetailsOfSelectedUsers } = this.props.userDetailsStore;
    const { selectedClosedAccount } = this.props.accountStore;
    const account = currentActiveAccountDetailsOfSelectedUsers || selectedClosedAccount;
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
          <Divider hidden />
          <Button color="blue" className="link-button" content={inProgress === 'userBoxAccount' ? 'loading...' : 'Users Box Account'} onClick={this.getUserStorageDetails} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route exact path={`${match.url}/activity`} render={props => <ActivityHistory stepName="INVESTOR_ACTIVITY_HISTORY" investorId={investorId} resourceId={get(account, 'details.accountId')} module="userDetails" showFilters={['activityType', 'activityUserType']} {...props} />} />
            <Route path={`${match.url}/statements`} render={props => <Statements isAdmin {...props} />} />
            <Route exact path={`${match.url}/investments`} render={props => <Portfolio refLink={match.url} isAdmin {...props} />} />
            <Route
              isAdmin
              path={`${match.url}/investments/cancel-investment/:id`}
              render={props => <CancelInvestment isAdmin accType={includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity'} refLink={match.url} {...props} />}
            />
            <Route path={`${match.url}/investments/investment-details/:id`} render={props => <InvestmentDetails isAdmin refLink={match.url} {...props} />} />
            <Route exact path={`${match.url}/transactions`} render={props => <Transactions isAdmin {...props} />} />
            <Route exact path={`${match.url}/transactions/:action`} render={props => <AddWithdrawFunds {...props} userId={get(this.props.userDetailsStore.getDetailsOfUser, 'id')} accountId={get(account, 'details.accountId')} />} />
            <Route exact path={`${match.url}/overview`} render={props => <Overview isAdmin copied={this.props.copied} {...props} />} />
            <Route exact path={`${match.url}/overview/:action`} render={props => <ConfirmModel {...props} userId={get(this.props.userDetailsStore.getDetailsOfUser, 'id')} refLink={`${match.url}/overview`} accountId={get(account, 'details.accountId')} />} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
