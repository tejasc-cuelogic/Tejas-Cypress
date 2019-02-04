import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import cookie from 'react-cookies';
import Loadable from 'react-loadable';
import { Visibility, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Banner from '../components/Banner';
import { PublicSubNav, InlineLoader } from '../../../../theme/shared/';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'article' },
  { type: 'ogTag', property: 'og:title', content: 'Exclusive Access to New Local Investments | NextSeed' },
  { type: 'ogTag', property: 'og:description', content: 'Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'article:publisher', content: 'https://www.facebook.com/thenextseed' },
  // { type: 'ogTag', property: 'fb:app_id', content: '1806635959569619' },
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
  componentWillMount() {
    const urlParameter = DataFormatter.QueryStringToJSON(this.props.location.search);
    const utmCampaign = get(urlParameter, 'utm_campaign') || null;
    const rsCode = get(urlParameter, 'rsCode') || null;
    if (utmCampaign === 'saasquatch' && rsCode) {
      this.props.referralsStore.getReferralCreditsInformation(rsCode).then(() => {
        cookie.save('SAASQUATCH_REFERRAL_CODE', rsCode, { maxAge: 86400000 });
      });
    }
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/why-nextseed`);
    }
  }
  componentWillUpdate() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/why-nextseed`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  render() {
    const { match, location, navStore } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        <MetaTagGenerator metaTagsData={metaTagsData} />
        {location.pathname === '/invest/why-nextseed' || location.pathname === '/invest' ? <Banner /> :
        <Responsive as="section" maxWidth={767} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <Visibility
          onUpdate={this.handleUpdate}
          continuous
          className={`slide-down ${location.pathname.split('/')[2]}`}
        >
          <PublicSubNav
            navStatus={navStore.navStatus}
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="Investing"
          />
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
        </Visibility>
      </Aux>
    );
  }
}

export default Invest;
