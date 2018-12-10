import React from 'react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import NotFound from './NotFound';

@inject('commonStore')
@observer
export default class Referral extends React.Component {
  componentWillMount() {
    const { referralCode } = this.props.match.params;
    this.props.commonStore.getReferralCodes(referralCode).then((data) => {
      if (data !== 'EMPTY') {
        cookie.save('REFERRAL_CODE', data.referralCode, { maxAge: 1200 });
        this.props.history.push(`/offerings/${data.slug}/overview`);
      }
    });
  }
  render() {
    return (
      <NotFound />
    );
  }
}
