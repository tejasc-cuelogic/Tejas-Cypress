import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Responsive } from 'semantic-ui-react';
import Banner from '../components/Banner';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';
import HowItWorks from '../components/HowItWorks';

const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'article' },
  { type: 'ogTag', property: 'og:title', content: 'Raise Growth Capital For Your Business | NextSeed' },
  { type: 'ogTag', property: 'og:description', content: 'Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'article:publisher', content: 'https://www.facebook.com/thenextseed' },
  { type: 'ogTag', property: 'fb:app_id', content: '1806635959569619' },
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Learn how small business entrepreneurs are using debt crowdfunding to retain ownership in their breweries, restaurants, fitness studios, and more.' },
  { type: 'meta', name: 'twitter:title', content: 'Raise Growth Capital For Your Business | NextSeed' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];

@inject('navStore', 'userStore')
@observer
class Business extends Component {
  render() {
    const { location } = this.props;
    return (
      <>
        <MetaTagGenerator pathName={location.pathname} metaTagsData={metaTagsData} />
        {location.pathname === '/how-it-works/business' ? <Banner />
          : <Responsive as="section" maxWidth={991} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <HowItWorks />
      </>
    );
  }
}

export default Business;
