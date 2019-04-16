import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
// import MonthlyStatements from '../components/statements/MonthlyStatements';
import TaxForms from '../components/statements/TaxForms';

const getModule = component => Loadable({
  loader: () => import(`../components/statements/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navItems = [
  // { title: 'Monthly Statements', to: 'monthly-statements', component: MonthlyStatements },
  { title: 'Tax Forms', to: 'tax-forms', component: TaxForms },
];

export default class Statements extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  render() {
    const { match } = this.props;
    const DefaultComponent = navItems[0].component || getModule(navItems[0].component);
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navItems} />
          </Grid.Column>
          <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props => <DefaultComponent isAdmin={this.props.isAdmin} {...props} />}
              />
              {
                navItems.map((item) => {
                  const CurrentModule = item.component || getModule(item.component);
                  return (
                    <Route key={item.to} path={`${match.url}/${item.to}`} render={props => <CurrentModule isAdmin={this.props.isAdmin} {...props} />} />
                  );
                })
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
