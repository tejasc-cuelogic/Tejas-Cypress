import React from 'react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import Banner from '../public/home/components/Banner';
import NotFound from './NotFound';

@inject('campaignStore')
@observer
export default class Referral extends React.Component {
  state = { found: 0 }; // 0: not started, 1: loading, 2: found, 3: not found
  componentWillMount() {
    const { referralCode } = this.props.match.params;
    this.props.campaignStore.initRequest(['active'], referralCode).then((data) => {
      if (data) {
        this.setState({ found: 2 });
        cookie.save('ISSUER_REFERRAL_CODE', data.referralCode, { maxAge: 86400000 });
        this.props.history.push(`/offerings/${data.offeringSlug}/overview`);
      } else {
        this.setState({ found: 3 });
      }
    });
  }
  render() {
    const { found } = this.state;
    return (
      <div>
        {found === 3 ? <NotFound /> : <Banner withDimmer />}
      </div>
    );
  }
}
