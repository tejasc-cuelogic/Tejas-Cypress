/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Header, Form, Divider } from 'semantic-ui-react';
import SaasquatchInformation from '../SaasquatchInformation.';
import ReferralsInformation from '../ReferralsInformation';
@inject('userDetailsStore', 'uiStore', 'referralsStore')
@withRouter
@observer
export default class Overview extends Component {
  state = {
    availableCredit: 0,
    spentCredit: 0,
    totalEarnedCredit: 0,
    totalReferredUsers: 0,
  };

  componentWillMount() {
    this.props.referralsStore
      .getUserReferralDetails(this.props.userDetailsStore.selectedUserId, false)
      .then((data) => {
        this.setState({
          availableCredit: get(data, 'getUserReferralDetails.availableCredit') || 0,
          spentCredit: get(data, 'getUserReferralDetails.spentCredit') || 0,
          totalEarnedCredit: get(data, 'getUserReferralDetails.totalEarnedCredit') || 0,
          totalReferredUsers: get(data, 'getUserReferralDetails.totalReferredUsers') || 0,
        });
      });
  }

  render() {
    const { detailsOfUser } = this.props.userDetailsStore;
    const { inProgress } = this.props.uiStore;
    const details = toJS({ ...detailsOfUser.data.user });
    return (
      <Form loading={inProgress}>
        <Header as="h4">
          Overview
        </Header>
        <Divider hidden />
        <SaasquatchInformation details={details} />
        <Divider />
        <ReferralsInformation details={this.state} />
        <Divider />
      </Form>
    );
  }
}
