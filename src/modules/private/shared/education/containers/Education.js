import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import PrivateLayout from '../../../shared/PrivateLayout';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import { InlineLoader } from '../../../../../theme/shared';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('userStore')
@observer
export default class Education extends Component {
  componentWillMount() {
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
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
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
