import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@withRouter
export default class Offering extends Component {
  render() {
    const navItems = [
      { title: 'Overview', to: 'overview', component: 'OfferingOverview' },
      { title: 'About the Company', to: 'about-company', component: 'OfferingCompany' },
      { title: 'Launch', to: 'launch', component: 'OfferingLaunch' },
    ];
    const { match } = this.props;
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navItems} />
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route exact path={match.url} component={getModule(navItems[0].component)} />
              {
                navItems.map(item => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
