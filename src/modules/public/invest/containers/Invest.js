import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import queryString from 'query-string';
import { DataFormatter } from '../../../../helper';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';
import { REDIRECT_META } from '../../../../constants/redirect';
import WhyNextseed from '../components/WhyNextseed';


const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'article' },
  { type: 'ogTag', property: 'og:title', content: 'Exclusive Access to New Local Investments | NextSeed' },
  { type: 'ogTag', property: 'og:description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'article:publisher', content: 'https://www.facebook.com/thenextseed' },
  { type: 'ogTag', property: 'fb:app_id', content: '1806635959569619' },
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'meta', name: 'twitter:title', content: 'Exclusive Access to New Local Investments | NextSeed' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];

@inject('navStore', 'userStore', 'referralsStore')
@observer
class Invest extends Component {
  constructor(props) {
    super(props);
    const urlParameter = queryString.parse(props.location.search);
    const utmCampaign = get(urlParameter, 'utm_campaign') || null;
    const rsCode = get(urlParameter, 'rsCode') || null;
    if (utmCampaign === 'saasquatch' && rsCode) {
      props.referralsStore.getReferralCreditsInformation(rsCode).then(() => {
        window.localStorage.setItem('SAASQUATCH_REFERRAL_CODE', rsCode);
        const redirectMeta = REDIRECT_META.find(r => r.live && r.rsCode === rsCode);
        if (redirectMeta && redirectMeta.rsRedirect) {
          props.history.push(redirectMeta.rsRedirect);
        }
      });
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  render() {
    const { location } = this.props;
    return (
      <>
        <MetaTagGenerator pathName={location.pathname} metaTagsData={metaTagsData} />
        <WhyNextseed />
      </>
    );
  }
}

export default Invest;
