import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Basic from './investor/Basic';
import InvestorProfile from './investor/InvestorProfile';
import AccreditationsLimits from './investor/AccreditationsLimits';

const navMeta = [
  { title: 'Basic', to: 'basic' },
  { title: 'Investor Profile', to: 'profile' },
  { title: 'Accreditations & Limits', to: 'accreditations' },
];

@inject('userDetailsStore')
@withRouter
@observer
export default class Investor extends Component {
  render() {
    const { match } = this.props;
    return (
      <Grid>
        <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
          <SecondaryMenu secondary vertical match={match} navItems={navMeta} />
        </Grid.Column>
        <Grid.Column widescreen={13} largeScreen={12} computer={12} tablet={12} mobile={16}>
          <Switch>
            <Route exact path={`${match.url}/accreditations`} component={AccreditationsLimits} />
            <Route exact path={`${match.url}/profile`} component={InvestorProfile} />
            <Route component={Basic} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}
