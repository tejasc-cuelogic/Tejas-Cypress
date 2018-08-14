import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import PrivateLayout from '../../../shared/PrivateHOC';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import DeleteAppModal from '../components/DeleteAppModal';
import { InlineLoader } from '../../../../../theme/shared';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

export default class ManageApplications extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/prequal-failed`);
    }
  }

  search = (e) => {
    if (e.charCode === 13 && false) {
      // search goes here..
    }
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <PrivateLayout
        {...this.props}
      >
        <Switch>
          {
            navItems.map(item => (
              <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
          <Route exact path={`${match.url}/:id/confirm`} component={DeleteAppModal} />
        </Switch>
      </PrivateLayout>
    );
  }
}
