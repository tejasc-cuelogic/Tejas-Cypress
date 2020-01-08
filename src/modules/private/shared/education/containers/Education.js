import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../PrivateLayout';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import { SuspenseBoundary, lazyRetry } from '../../../../../theme/shared';

const getModule = component => lazyRetry(() => import(`../components/${component}`));

@inject('userStore')
@observer
export default class Education extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      if (this.props.userStore.isIssuer) {
        this.props.history.replace(`${this.props.match.url}/knowledge-base`);
      } else {
        this.props.history.replace(`${this.props.match.url}/welcome-packet`);
      }
    }
  }

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <PrivateLayout {...this.props}>
        <SuspenseBoundary>
          <Switch>
            <Route exact path={match.url} component={getModule(navItems[0].component)} />
            {
              navItems.map(item => (
                <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
              ))
            }
          </Switch>
        </SuspenseBoundary>
      </PrivateLayout>
    );
  }
}
