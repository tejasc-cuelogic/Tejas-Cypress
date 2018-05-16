import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import { GetNavMeta } from '../../../theme/layout/SidebarNav';

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

export default class Individual extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/portfolio`);
    }
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.path).subNavigations;
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
