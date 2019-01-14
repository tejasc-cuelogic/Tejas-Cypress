import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
export default class ReferralsDetails extends Component {
  componentDidMount() {
    const apiKey = 'TEST_ug3VYDEACdh2wPNXZyLbeByHEhDMK9Ci:';
    const auth = Buffer.from(`${apiKey}`).toString('base64');
    const jwtToken = `Basic ${auth}`;
    // const jwtToken = this.props.commonStore.token;
    window.squatch.ready(() => {
      window.squatch.init({
        tenantAlias: 'test_abcvl6vhwmkrk',
      });
      const initObj = {
        user: {
          id: 'abc_123',
          accountId: 'abc_123',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        engagementMedium: 'EMBED',
        widgetType: 'REFERRER_WIDGET',
        jwt: jwtToken,
      };
      window.squatch.widgets().upsertUser(initObj).then((response) => {
        console.log(response.user);
      }).catch((error) => {
        console.log(error);
      });
    });
  }
  render() {
    return (
      <div>
        <div className="squatchembed" />
        Referrals Page!
      </div>
    );
  }
}
