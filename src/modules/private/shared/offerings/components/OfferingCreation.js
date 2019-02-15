import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import OfferingModule from './index';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

@withRouter
@inject('offeringsStore', 'navStore', 'userStore')
@observer
export default class OfferingCreation extends Component {
  render() {
    const { match, navStore } = this.props;
    const { isIssuer } = this.props.userStore;
    let navItems = navStore.specificNavs.subNavigations;
    navItems = navStore.filterByAccess(navItems, 1, ['overview', 'activity-history']); // navigation of creation stage
    return (
      <div className={isIssuer ? 'ui card fluid' : ''}>
        <SecondaryMenu force2ary={!isIssuer} match={match} navItems={navItems} />
        <Switch>
          <Route exact path={match.url} component={OfferingModule('key-terms')} />
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={OfferingModule(item.to)} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
