import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SuspenseBoundary, lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./offering/${component}`));

@inject('userStore', 'uiStore', 'offeringCreationStore', 'offeringsStore')
@withRouter
@observer
export default class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
    this.props.offeringCreationStore.setFormData('OFFERING_MISC_FRM', 'offering.misc');
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
  }

  render() {
    const { offeringsStore, match, userStore } = this.props;
    const { isIssuer } = userStore;
    const { offer } = offeringsStore;
    const showInvestNowToc = !!get(offer, 'investNow.page[0]') || get(offer, 'stage') === 'CREATION';
    let navItems = [
      { title: 'Overview', to: 'overview', component: 'OfferingOverview' },
      { title: 'About the Company', to: 'about-company', component: 'OfferingCompany' },
    ];
    if (!isIssuer) {
      navItems = [
        ...navItems,
        ...[
          { title: 'Misc', to: 'misc', component: 'Misc' },
          { title: 'Launch', to: 'launch', component: 'OfferingLaunch' },
        ],
      ];
    }
    if (showInvestNowToc) {
      navItems.push({ title: 'InvestNow ToC', to: 'invest-now-toc', component: 'InvestNowToc' });
    }
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
