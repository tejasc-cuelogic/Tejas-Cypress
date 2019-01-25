import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import { Responsive } from 'semantic-ui-react';
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
class Business extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/how-it-works`);
    }
  }
  componentWillUpdate() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/how-it-works`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { location, match, navStore } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        <Helmet>
          <meta name="description" content="Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more." />
          <link rel="canonical" href="https://dev.nextseed.qa/business/" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Raise Growth Capital For Your Business | NextSeed" />
          <meta property="og:description" content="Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more." />
          <meta property="og:url" content="https://dev.nextseed.qa/business/" />
          <meta property="og:site_name" content="NextSeed" />
          <meta property="article:publisher" content="https://www.facebook.com/thenextseed" />
          <meta property="og:image" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta property="og:image:secure_url" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta property="og:image:width" content="1600" />
          <meta property="og:image:height" content="1067" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content="Learn how small business entrepreneurs are using debt crowdfunding to retain ownership in their breweries, restaurants, fitness studios, and more." />
          <meta name="twitter:title" content="Raise Growth Capital For Your Business | NextSeed" />
          <meta name="twitter:site" content="@thenextseed" />
          <meta name="twitter:image" content="https://cdn.nextseed.co/app/uploads/IMG_2710.jpg" />
          <meta name="twitter:creator" content="@thenextseed" />
        </Helmet>
        {location.pathname === '/business/how-it-works' ||
          location.pathname === '/business' ? <Banner /> :
          <Responsive as="section" maxWidth={767} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <PublicSubNav
            navStatus={navStore.navStatus}
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="Fundraising"
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
        </div>
      </Aux>
    );
  }
}

export default Business;
