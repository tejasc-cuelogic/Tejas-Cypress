import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Header, Popup, Icon } from 'semantic-ui-react';
import { SAASQUATCH_TENANT_ALIAS } from '../../../../../constants/common';
import { InlineLoader } from './../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('referralsStore', 'userDetailsStore')
@observer
export default class ReferralsDetails extends Component {
  state = { loading: true, availableCredit: '0' };
  componentWillMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'id');
    if (saasQuatchUserId) {
      this.props.referralsStore.upsertUserReferralCredits(saasQuatchUserId);
    }
    this.props.referralsStore.getUserRewardBalance()
      .then(data => this.setState({
        availableCredit: get(data, 'getUserRewardBalance') || 0,
      }));
  }
  componentDidMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'saasquatch.userId');
    const userId = saasQuatchUserId || get(userDetails, 'id');
    if (userId) {
      this.props.referralsStore.getJwtReferralEmbeddedWidget().then((data) => {
        const payLoad = {
          id: userId,
          accountId: userId,
        };
        if (!saasQuatchUserId) {
          payLoad.email = get(userDetails, 'email.address');
          payLoad.firstName = get(userDetails, 'info.firstName');
          payLoad.lastName = get(userDetails, 'info.lastName');
        }
        window.squatch.ready(() => {
          window.squatch.init({
            tenantAlias: SAASQUATCH_TENANT_ALIAS,
          });
          const initObj = {
            user: payLoad,
            engagementMedium: 'EMBED',
            widgetType: 'REFERRER_WIDGET',
            jwt: data.getJwtReferralEmbeddedWidget,
          };
          window.squatch.widgets().upsertUser(initObj).then((response) => {
            this.setState({ loading: false });
            if (!saasQuatchUserId) {
              this.props.referralsStore.getReferralCreditsInformation(response.user.referralCode);
            }
          }).catch(() => {
            this.setState({ loading: false });
          });
        });
      }).catch(() => this.setState({ loading: false }));
    }
  }
  render() {
    return (
      <div>
        {this.state.loading ?
          <InlineLoader /> :
          <Header as="h3" textAlign="center">
            Available Credit{' '}
            <Popup trigger={<small><Icon name="help circle" color="green" size="small" /></small>} content="Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest." position="bottom center" />
            {Helper.MoneyMathDisplayCurrency(this.state.availableCredit)}
          </Header>
        }
        <div className="squatchembed" />
      </div>
    );
  }
}
