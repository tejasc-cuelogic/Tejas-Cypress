import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SuspenseBoundary, lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./${component}`));

@inject('userStore', 'uiStore', 'offeringCreationStore')
@withRouter
@observer
export default class OfferingV2 extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/tombstone`);
    }
  }

  render() {
    const { isIssuer } = this.props.userStore;
    const navItems = [
      { title: 'Invest Now', to: 'tombstone', component: 'offering/InvestNow' },
      { title: 'Launch', to: 'Launch', component: 'offering/OfferingLaunch' },
      { title: 'Close', to: 'close', component: 'Close' },
    ];
    const { match } = this.props;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : ''}>
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <SecondaryMenu secondary vertical match={match} navItems={navItems} />
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <div className={isIssuer && !match.url.includes('offering-creation') ? 'ui card fluid form-card' : ''}>
            <SuspenseBoundary>
              <Switch>
                  <Route exact path={match.url} component={getModule(navItems[0].component)} />
                  {
                    navItems.map(item => (
                      <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                    ))
                  }
                </Switch>
              </SuspenseBoundary>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
