import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./marketing/${component}`));

@inject('userStore', 'uiStore', 'offeringCreationStore')
@withRouter
@observer
export default class Marketing extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/tombstone`);
    }
  }

  render() {
    const { isIssuer } = this.props.userStore;
    const navItems = [
      { title: 'Tombstone', to: 'tombstone', component: 'Tombstone' },
      { title: 'Header', to: 'header', component: 'Header' },
      { title: 'Content', to: 'content', component: 'Content' },
      { title: 'Misc', to: 'misc', component: 'Misc' },
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
