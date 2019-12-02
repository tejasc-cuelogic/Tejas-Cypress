import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import queryString from 'query-string';
import { Visibility } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { SuspenseBoundary, lazyRetry } from '../../../../theme/shared';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';
import { REDIRECT_META } from '../../../../constants/redirect';

const getModule = component => lazyRetry(() => import(`../components/${component}`));

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
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'meta', name: 'twitter:title', content: 'Exclusive Access to New Local Investments | NextSeed' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
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
    if (props.match.isExact) {
      props.history.replace(`${props.match.url}/why-nextseed`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  render() {
    const { match, location } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <>
        <MetaTagGenerator metaTagsData={metaTagsData} />
        {/* {location.pathname === '/invest/why-nextseed' || location.pathname === '/invest' ? <Banner />
          : <Responsive as="section" maxWidth={767} className={`banner ${location.pathname.split('/')[2]}`} />
        } */}
        <Visibility
          onUpdate={this.handleUpdate}
          continuous
          className={`slide-down ${location.pathname.split('/')[2]}`}
        >
          {/* <PublicSubNav
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="Investing"
          /> */}
          <SuspenseBoundary>
            <Switch>
              <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
              {
                navItems.map(item => (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    component={getModule(this.module(item.title))}
                  />
                ))
              }
            </Switch>
          </SuspenseBoundary>
        </Visibility>
      </>
    );
  }
}

export default Invest;
