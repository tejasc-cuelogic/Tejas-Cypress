import React from 'react';
import { inject, observer } from 'mobx-react';
import { find } from 'lodash';
import Banner from '../public/home/components/Banner';
import NotFound from './NotFound';
import { REDIRECT_META } from '../../constants/redirect';

@inject('campaignStore', 'authStore', 'commonStore', 'userStore')
@observer
export default class RedirectManager extends React.Component {
  state = { found: 0 }; // 0: not started, 1: loading, 2: found, 3: not found
  componentWillMount() {
    const { fromUrl } = this.props.match.params;
    const redirectMeta = this.findRedirectUrl(fromUrl);
    if (redirectMeta) {
      this.setState({ found: 2 });
      const toUrl = (redirectMeta.to.includes('http://') || redirectMeta.to.includes('https://')) ? redirectMeta.to : window.location.hostname === 'localhost' ? `http://${window.location.host}${redirectMeta.to}` : `https://${window.location.hostname}${redirectMeta.to}`;
      window.location = toUrl;
    } else {
      this.findIssuerReferralCode(fromUrl);
    }
  }

  findRedirectUrl = (params) => {
    const redirectMeta = find(REDIRECT_META, d => params === d.from && d.live);
    return redirectMeta || false;
  }

  findIssuerReferralCode = (referralCode) => {
    this.props.campaignStore.initRequest(['active'], referralCode).then((data) => {
      if (data) {
        this.setState({ found: 2 });
        if (this.props.authStore.isUserLoggedIn) {
          this.props.commonStore
            .updateUserReferralCode(this.props.userStore.currentUser.sub, data.referralCode);
        } else {
          window.localStorage.setItem('ISSUER_REFERRAL_CODE', data.referralCode);
        }
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
