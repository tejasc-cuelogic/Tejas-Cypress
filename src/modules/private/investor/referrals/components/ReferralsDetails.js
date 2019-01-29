import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { SAASQUATCH_TENANT_ALIAS } from '../../../../../constants/common';
import { InlineLoader } from './../../../../../theme/shared';

@inject('referralsStore', 'userDetailsStore')
@observer
export default class ReferralsDetails extends Component {
  state = { loading: true };
  componentWillMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'saasquatch.userId');
    if (saasQuatchUserId) {
      this.props.referralsStore.upsertUserReferralCredits(saasQuatchUserId);
    }
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
            console.log(response.user);
            this.setState({ loading: false });
            if (!saasQuatchUserId) {
              this.props.referralsStore.getReferralCreditsInformation(response.user.referralCode);
            }
          }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
          });
        });
      }).catch(() => this.setState({ loading: false }));
    }
  }
  render() {
    return (
      <div>
        {this.state.loading ?
          <InlineLoader /> : null
        }
        <div className="squatchembed" />
      </div>
    );
  }
}
