import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('referralsStore', 'userDetailsStore')
@observer
export default class ReferralsDetails extends Component {
  componentWillMount() {
    // this.props.referralsStore.upsertUserReferralCredits(() => {});
  }
  componentDidMount() {
    this.props.referralsStore.getJwtReferralEmbeddedWidget().then((data) => {
      const { userDetails } = this.props.userDetailsStore;
      const userId = userDetails.id;
      console.log(userId);
      window.squatch.ready(() => {
        window.squatch.init({
          tenantAlias: 'test_abcvl6vhwmkrk',
        });
        const initObj = {
          user: {
            id: userId,
            accountId: userId,
            // id: 'abc_123',
            // accountId: 'abc_123',
            // email: 'john@example.com',
            // firstName: 'John',
            // lastName: 'Doe',
          },
          engagementMedium: 'EMBED',
          widgetType: 'REFERRER_WIDGET',
          jwt: data.getJwtReferralEmbeddedWidget,
        };
        window.squatch.widgets().upsertUser(initObj).then((response) => {
          console.log(response.user);
        }).catch((error) => {
          console.log(error);
        });
      });
    });
  }
  render() {
    return (
      <div>
        <div className="squatchembed" />
      </div>
    );
  }
}
