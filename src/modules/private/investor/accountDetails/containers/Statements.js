import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => Loadable({
  loader: () => import(`../components/statements/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

const navItems = [
  { title: 'Monthly Statements', to: 'monthly-statements', component: 'MonthlyStatements' },
  { title: 'Tax Forms', to: 'tax-forms', component: 'TaxForms' },
];

export default class Statements extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navItems} />
          </Grid.Column>
          <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
            <Switch>
              <Route exact path={match.url} component={getModule(navItems[0].component)} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
