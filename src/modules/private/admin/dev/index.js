import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import { InlineLoader } from '../../../../theme/shared';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';

const getModule = component => lazy(() => import(`./components/${component}`));

export default class Dev extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    if (match.isExact) {
      this.props.history.push(`${match.url}/elasticsearch`);
    }
  }

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], false).subNavigations;
    return (
      <PrivateLayout
        {...this.props}
      >
        <Suspense fallback={<InlineLoader />}>
          <Switch>
            {
              navItems.map(item => (
                <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
              ))
            }
          </Switch>
        </Suspense>
      </PrivateLayout>
    );
  }
}
