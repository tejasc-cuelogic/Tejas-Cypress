import React from 'react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import NotFound from './NotFound';

@inject('campaignStore')
@observer
export default class Referral extends React.Component {
  componentWillMount() {
    const { referralCode } = this.props.match.params;
    this.props.campaignStore.initRequest(['active'], referralCode).then((data) => {
      if (data) {
        cookie.save('REFERRAL_CODE', data.referralCode, { maxAge: 86400000 });
        this.props.history.push(`/offerings/${data.id}/overview`);
      }
    });
  }
  render() {
    return (
      <NotFound />
    );
  }
}
