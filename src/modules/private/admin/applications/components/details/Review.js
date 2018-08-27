import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../../helper';
import { InlineLoader } from '../../../../../../theme/shared';

const getModule = component => Loadable({
  loader: () => import(`./review/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navItems = [
  { title: 'Overview', to: 'overview' },
  { title: 'PreQual', to: 'prequal' },
  { title: 'Business Plan', to: 'business-plan' },
  { title: 'Projections', to: 'projections' },
  { title: 'Documentation', to: 'documentation' },
  { title: 'Miscellaneous', to: 'miscellaneous' },
  { title: 'Contingencies', to: 'contingencies' },
  {
    title: 'Model',
    to: 'model',
    subNavigations: [
      { title: 'Inputs', to: 'input', component: 'Inputs' },
      {
        title: 'Variables', to: 'variables', component: 'Variables',
      },
      { title: 'Results', to: 'results', component: 'Results' },
    ],
  },
  { title: 'Offer', to: 'offer' },
];

export default class Review extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { match } = this.props;
    const subNavItems = [
      { title: 'Inputs', to: 'inputs', component: 'Inputs' },
      {
        title: 'Variables', to: 'variables', component: 'Variables',
      },
      { title: 'Results', to: 'results', component: 'Results' },
    ];

    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navItems} />
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                ))
              }
            </Switch>
            <Switch>
              { subNavItems.length > 0 &&
                subNavItems.map(item => (
                  <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
