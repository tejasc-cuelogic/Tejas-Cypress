import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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
  { title: 'PreQualification', to: 'prequal' },
  { title: 'Business Plan', to: 'business-plan' },
  { title: 'Projections', to: 'projections' },
  { title: 'Documentation', to: 'documentation' },
  { title: 'Miscellaneous', to: 'miscellaneous' },
  { title: 'Contingencies', to: 'contingencies' },
  {
    title: 'Model',
    to: 'model',
    subNavigations: [
      { title: 'Inputs', to: 'model/inputs', component: 'Inputs' },
      { title: 'Variables', to: 'model/variables', component: 'Variables' },
      { title: 'Results', to: 'model/results', component: 'Results' },
    ],
  },
  { title: 'Offer', to: 'offer' },
];

@withRouter
export default class Review extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { match } = this.props;
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
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
