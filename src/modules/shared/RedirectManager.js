import React from 'react';
import { inject, observer } from 'mobx-react';
import { find } from 'lodash';
import Banner from '../public/home/components/Banner';
import NotFound from './NotFound';
import { REDIRECT_META } from '../../constants/redirect';

@inject('campaignStore', 'authStore', 'commonStore', 'userStore')
@observer
export default class RedirectManager extends React.PureComponent {
  // 0: not started, 1: loading, 2: found, 3: not found
  constructor(props) {
    super(props);
    this.state = { found: 0, viaProtect: false };
    this.processRedirection();
  }

  componentDidUpdate() {
    const { viaProtect } = this.state;
    if (viaProtect) {
      this.processRedirection(false);
    }
  }

  processRedirection = (ref = true) => {
    let { fromUrl } = this.props.match.params;
    const { fromUrl2 } = this.props.match.params;
    const { viaProtect } = this.state;
    const redirectMeta = this.getMetaData(fromUrl2 ? `${fromUrl}/${fromUrl2}` : fromUrl);
    if (fromUrl === 'password-protected') {
      if (ref) {
        this.setState({ viaProtect: true });
      }
      fromUrl = window.location ? window.location.pathname.split('/')[1] : fromUrl;
    }
    if (viaProtect) {
      this.setState({ viaProtect: false });
    }
    if (redirectMeta) {
      const toUrl = (redirectMeta.to.includes('http://') || redirectMeta.to.includes('https://')) ? redirectMeta.to : window.location.hostname === 'localhost' ? `http://${window.location.host}${redirectMeta.to}` : `${window.location.protocol}//${window.location.hostname}${redirectMeta.to}`;
      window.location = toUrl;
    } else if (fromUrl !== 'password-protected') {
      this.findIssuerReferralCode(fromUrl);
    }
  }

  findRedirectUrl = (params) => {
    const redirectMeta = find(REDIRECT_META, (d) => {
      if (d.from.includes(':param1')) {
        const splitUrl = params.split('/');
        if (d.from.includes(splitUrl[0])) {
          return d.live;
        }
      } else {
        return params === d.from && d.live;
      }
      return false;
    });
    return redirectMeta;
  }

  getMetaData = (params) => {
    let redirectMeta = this.findRedirectUrl(params);
    if (redirectMeta && redirectMeta.from.includes(':param1')) {
      const fromArr = redirectMeta.from.split('/');
      const paramArr = [':param1'];
      let replacedTo;
      paramArr.forEach((key) => {
        if (redirectMeta && redirectMeta.from.includes(key)) {
          const splitUrl = params.split('/');
          const param1 = splitUrl[fromArr.indexOf(key)];
          replacedTo = redirectMeta.to.replace(key, param1);
        }
        redirectMeta = {
          ...redirectMeta,
          to: replacedTo,
        };
      });
    }
    return redirectMeta;
  }

  findIssuerReferralCode = (referralCode) => {
    this.props.campaignStore.initRequest(['CREATION', 'LIVE', 'COMPLETE'], referralCode.toLowerCase()).then((data) => {
      if (data) {
        this.setState({ found: 2 });
        if (this.props.authStore.isUserLoggedIn) {
          this.props.commonStore
            .updateUserReferralCode(this.props.userStore.currentUser.sub, data.referralCode);
        } else {
          window.localStorage.setItem('ISSUER_REFERRAL_CODE', data.referralCode);
        }
        if (data.stage === 'CREATION') {
          this.props.history.push(`/offerings/preview/${data.offeringSlug}`);
        } else {
          this.props.history.push(`/offerings/${data.offeringSlug}`);
        }
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
