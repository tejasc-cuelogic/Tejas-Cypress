import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
// import PrivateLayout from '../../shared/PrivateLayout';
import { InlineLoader } from '../../../../theme/shared';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';


const getModule = component => Loadable({
  loader: () => import(`../${component}`),
  loading() {
    return <InlineLoader />;
  },
});
export default class Content extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.isExact) {
      this.props.history.push(`${match.url}/categories`);
    }
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], false).subNavigations;
    return (
      // <PrivateLayout {...this.props} >
      <Switch>
        {
          navItems.map((item) => {
            const CurrentComponent = getModule(item.component);
            return (
              <Route key={item.to} path={`${match.url}/${item.to}`} render={props => (<CurrentComponent refMatch={match} {...props} />)} />
            );
          })
        }
      </Switch>
      // </PrivateLayout>
    );
  }
}
