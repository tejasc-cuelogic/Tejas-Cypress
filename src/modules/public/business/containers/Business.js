import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Responsive, Visibility } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Banner from '../components/Banner';
import { PublicSubNav, SuspenseBoundary, lazyRetry } from '../../../../theme/shared';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';
import ConfirmLoginModal from '../components/ConfirmLoginModal';

const getModule = component => lazyRetry(() => import(`../components/${component}`));
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
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Learn how small business entrepreneurs are using debt crowdfunding to retain ownership in their breweries, restaurants, fitness studios, and more.' },
  { type: 'meta', name: 'twitter:title', content: 'Raise Growth Capital For Your Business | NextSeed' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/app/uploads/IMG_2710.jpg' },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];

@inject('navStore', 'userStore')
@observer
class Business extends Component {
  constructor(props) {
    super(props);
    if (props.match.isExact) {
      props.history.replace(`${props.match.url}/how-it-works`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { location, match, navStore } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <>
        <MetaTagGenerator pathName={location.pathname} metaTagsData={metaTagsData} />
        {location.pathname === '/business/how-it-works'
          || location.pathname === '/business' ? <Banner />
          : <Responsive as="section" maxWidth={991} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <Visibility
          onUpdate={this.handleUpdate}
          continuous
          className={`slide-down ${location.pathname.split('/')[2]}`}
        >
          <PublicSubNav
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="Fundraising"
          />
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
              <Route path={`${this.props.match.url}/confirm-login`} render={() => <ConfirmLoginModal refLink={`${this.props.match.url}/how-it-works`} />} />
            </Switch>
          </SuspenseBoundary>
        </Visibility>
      </>
    );
  }
}

export default Business;
