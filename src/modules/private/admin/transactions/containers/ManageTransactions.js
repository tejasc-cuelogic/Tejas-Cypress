import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateHOC';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import AllTransactions from '../components/AllTransactions';

@withRouter
export default class ManageTransactions extends Component {
  render() {
    const { match } = this.props;
    const navItems = [
      { title: 'Status 1', to: 'status-1', component: 'Status' },
      { title: 'Status 2', to: 'status-2', component: 'Status' },
      { title: 'Status 3', to: 'status-3', component: 'Status' },
      { title: 'Status 4', to: 'status-4', component: 'Status' },
    ];
    return (
      <PrivateLayout
        {...this.props}
        subNav
      >
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <div className="sticy-sidebar">
              <SecondaryMenu secondary match={match} navItems={navItems} />
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <div className="ui card fluid form-card">
              <Switch>
                <Route exact path={match.url} component={AllTransactions} />
                {
                  navItems.map(item => (
                    <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={AllTransactions} />
                  ))
                }
              </Switch>
            </div>
          </Grid.Column>
        </Grid>
      </PrivateLayout>
    );
  }
}
