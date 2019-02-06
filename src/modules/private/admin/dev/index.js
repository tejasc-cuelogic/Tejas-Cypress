import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import PrivateLayout from '../../shared/PrivateLayout';
import { InlineLoader } from '../../../../theme/shared';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';


const getModule = component => Loadable({
  loader: () => import(`./components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
@inject('accreditationStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    this.props.accreditationStore.initRequest();
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], false).subNavigations;
    return (
      <PrivateLayout
        // hideSubNav
        {...this.props}
      >
        <Switch>
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
