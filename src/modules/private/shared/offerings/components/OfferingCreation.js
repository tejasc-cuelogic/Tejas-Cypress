import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import OfferingModule from './index';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

@withRouter
@inject('offeringsStore', 'navStore')
@observer
export default class OfferingCreation extends Component {
  render() {
    const { match, navStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    navItems = navStore.filterByAccess(navItems, 1, ['overview']); // navigation of creation stage
    return (
      <Aux>
        <SecondaryMenu force2ary match={match} navItems={navItems} />
        <Switch>
          <Route exact path={match.url} component={OfferingModule('overview')} />
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={OfferingModule(item.to)} />
            ))
          }
        </Switch>
      </Aux>
    );
  }
}
