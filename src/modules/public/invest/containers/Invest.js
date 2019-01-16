import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Helmet } from 'react-helmet';
import cookie from 'react-cookies';
import Loadable from 'react-loadable';
import { Visibility, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Banner from '../components/Banner';
import { PublicSubNav, InlineLoader } from '../../../../theme/shared/';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('navStore', 'userStore')
@observer
class Invest extends Component {
  componentWillMount() {
    const urlParameter = DataFormatter.QueryStringToJSON(this.props.location.search);
    const utmCampaign = get(urlParameter, 'utm_campaign') || null;
    const rsCode = get(urlParameter, 'rsCode') || null;
    if (utmCampaign === 'saasquatch' && rsCode) {
      // getReferralCreditsInformation query
      cookie.save('SAASQUATCH_REFERRAL_CODE', rsCode, { maxAge: 86400000 });
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
        <Helmet>
          <meta name="description" content="Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses." />
          <link rel="canonical" href="https://dev.nextseed.qa/invest/" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Exclusive Access to New Local Investments | NextSeed" />
          <meta property="og:description" content="Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses." />
          <meta property="og:url" content="https://dev.nextseed.qa/invest/" />
          <meta property="og:site_name" content="NextSeed" />
          <meta property="article:publisher" content="https://www.facebook.com/thenextseed" />
          <meta property="og:image" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta property="og:image:secure_url" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta property="og:image:width" content="1600" />
          <meta property="og:image:height" content="1067" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content="Learn more about debt crowdfunding on NextSeed. Diversify your investment portfolio by investing in local businesses." />
          <meta name="twitter:title" content="Exclusive Access to New Local Investments | NextSeed" />
          <meta name="twitter:site" content="@thenextseed" />
          <meta name="twitter:image" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta name="twitter:creator" content="@thenextseed" />
        </Helmet>
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
