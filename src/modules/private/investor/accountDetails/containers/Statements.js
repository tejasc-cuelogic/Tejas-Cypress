import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import MonthlyStatements from '../components/statements/MonthlyStatements';
import TaxForms from '../components/statements/TaxForms';

const getModule = component => lazy(() => import(`../components/statements/${component}`));

const navItems = [
  { title: 'Monthly Statements', to: 'monthly-statements', component: MonthlyStatements },
  { title: 'Tax Forms', to: 'tax-forms', component: TaxForms },
];

export default class Statements extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      const navigationItems = navItems;
      this.props.history.replace(`${this.props.match.url}/${navigationItems[0].to}`);
    }
  }

  render() {
    const { match } = this.props;
    const navigationItems = navItems;
    const DefaultComponent = navigationItems[0].component || getModule(navigationItems[0].component);
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navigationItems} />
          </Grid.Column>
          <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
            <Suspense fallback={<InlineLoader />}>
              <Switch>
                <Route
                  exact
                  path={match.url}
                  render={props => <DefaultComponent isAdmin={this.props.isAdmin} {...props} />}
                />
                {
                  navigationItems.map((item) => {
                    const CurrentModule = item.component || getModule(item.component);
                    return (
                      <Route key={item.to} path={`${match.url}/${item.to}`} render={props => <CurrentModule isAdmin={this.props.isAdmin} {...props} />} />
                    );
                  })
                }
              </Switch>
            </Suspense>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
