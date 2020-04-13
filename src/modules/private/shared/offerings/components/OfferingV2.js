import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { Route, Switch, withRouter } from 'react-router-dom';
import { lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./${component}`));

@inject('userStore', 'offeringsStore')
@withRouter
@observer
export default class OfferingV2 extends Component {
  constructor(props) {
    super(props);
    const { offer } = props.offeringsStore;
    const nav = (!!get(offer, 'investNow.page[0]') || get(offer, 'stage') === 'CREATION') ? 'invest-now-toc' : get(offer, 'stage') === 'CREATION' ? 'launch' : 'close';
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/${nav}`);
    }
  }

  render() {
    const { offeringsStore, match, userStore } = this.props;
    const { isIssuer } = userStore;
    const { offer } = offeringsStore;
    const showInvestNowToc = !!get(offer, 'investNow.page[0]') || get(offer, 'stage') === 'CREATION';
    const navItems = [];
    if (showInvestNowToc) {
      navItems.push({ title: 'Invest Now', to: 'invest-now-toc', component: 'offering/InvestNowToc' });
    }
    navItems.push({ title: 'Launch', to: 'launch', component: 'offering/OfferingLaunch' }, { title: 'Invest Now - DocuSign Generations', to: 'invest-now-docusign-generations', component: 'offering/InvestNowDocusignGenerations' });
    if (get(offer, 'stage') === 'LIVE') {
      navItems.push({ title: 'Close', to: 'close', component: 'Close' });
    }
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
