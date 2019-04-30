import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid, Divider, Button } from 'semantic-ui-react';
import { get, isEmpty } from 'lodash';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Basic from './investor/Basic';
// import InvestorProfile from './investor/InvestorProfile';
import AccreditationsLimits from './investor/AccreditationsLimits';
import ConfirmModel from '../../../../accreditation/components/ConfirmModel';
import UserInvestorDetails from '../../../../../investor/settings/components/UserInvestorDetails';
import { NEXTSEED_BOX_URL } from '../../../../../../../constants/common';
import Helper from '../../../../../../../helper/utility';

@inject('userDetailsStore', 'investmentLimitStore', 'uiStore')
@withRouter
@observer
export default class Investor extends Component {
  componentWillMount() {
    this.props.investmentLimitStore.initiateInvestmentLimitOfSelectedUser();
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/basic`);
    }
  }
  getUserStorageDetails = (e) => {
    e.preventDefault();
    const userId = get(this.props.userDetailsStore.getDetailsOfUser, 'id');
    if (userId) {
      this.props.userDetailsStore.getUserStorageDetails(userId).then((folderId) => {
        this.props.uiStore.removeOneFromProgressArray('getStorageDetails');
        if (folderId) {
          window.open(`${NEXTSEED_BOX_URL}folder/${folderId}`, '_blank');
        } else {
          Helper.toast('Box folder is not created for this user', 'error');
        }
      })
        .catch(() => this.props.uiStore.removeOneFromProgressArray('getStorageDetails'));
    }
  }
  render() {
    const { getActiveAccountList } = this.props.investmentLimitStore;
    const { inProgressArray } = this.props.uiStore;
    const { match } = this.props;
    const navMeta = [
      { title: 'Basic', to: 'basic' },
      { title: 'Investor Profile', to: 'profile' },
    ];
    if (getActiveAccountList && getActiveAccountList.accountList.length) {
      navMeta.push({ title: 'Accreditations & Limits', to: 'accreditations' });
    }
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
          <Divider hidden />
          <Button color="blue" className="link-button" content={!isEmpty(inProgressArray) ? 'loading...' : 'Users Box Account'} onClick={this.getUserStorageDetails} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route path={`${match.url}/accreditations/:action/:userId/:accountId?/:accountType?`} render={props => <ConfirmModel refLink={`${this.props.match.url}/accreditations`} {...props} />} />
            <Route exact path={`${match.url}/accreditations`} component={AccreditationsLimits} />
            <Route exact path={`${match.url}/profile`} render={props => <UserInvestorDetails isAdmin refLink={this.props.match.url} {...props} />} />
            <Route exact path={`${match.url}/basic`} component={Basic} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
