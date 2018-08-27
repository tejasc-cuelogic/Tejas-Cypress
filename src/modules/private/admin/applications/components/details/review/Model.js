import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { GetNavMeta } from '../../../../../../../theme/layout/SidebarNav';
import { InlineLoader } from '../../../../../../../theme/shared';

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <InlineLoader />;
  },
});

export default class Model extends Component {
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <div>
        Model - page!!!!
        <Switch>
          {
            navItems.map(item => (
              <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
