import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./${component}`));

@inject('userStore', 'uiStore', 'offeringCreationStore')
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
      this.props.history.push(`${this.props.match.url}/general`);
    }
  }

  render() {
    const { isIssuer } = this.props.userStore;
    const navItems = [
      { title: 'General', to: 'general', component: 'Overview' },
      { title: 'Key Terms', to: 'key-terms', component: 'KeyTerms' },
      { title: 'Leadership', to: 'leadership', component: 'Leadership' },
    ];
    const { match } = this.props;
    return (
      <div className={isIssuer ? 'ui card fluid' : ''}>
        <SecondaryMenu force2ary={!isIssuer} match={match} navItems={navItems} />
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          {
            navItems.map(item => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
