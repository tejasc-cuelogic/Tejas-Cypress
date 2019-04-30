import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { observer, inject } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => Loadable({
  loader: () => import(`./offering/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('userStore', 'uiStore', 'offeringCreationStore')
@withRouter
@observer
export default class Offering extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
    this.props.offeringCreationStore.setFormData('OFFERING_MISC_FRM', 'offering.misc');
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
  }
  shouldComponentUpdate() {
    return !this.props.uiStore.htmlEditorImageLoading;
  }
  render() {
    const { isIssuer } = this.props.userStore;
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
              <Switch>
                <Route exact path={match.url} component={getModule(navItems[0].component)} />
                {
                  navItems.map(item => (
                    <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
                  ))
                }
              </Switch>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
