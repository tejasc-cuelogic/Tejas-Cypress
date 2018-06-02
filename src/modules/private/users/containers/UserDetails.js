import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import Spinner from '../../../../theme/ui/Spinner';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';

const getModule = component => Loadable({
  loader: () => import(`../components/manage/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('userDetailsStore')
@observer
export default class AccountDetails extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.match.params.userId);
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const { currentUser } = this.props.userDetailsStore;
    if (currentUser.loading) {
      return (
        <div><Spinner loaderMessage="Loading..." /></div>
      );
    }
    const details = toJS({ ...currentUser.data.user });
    const forceTitle = `${details.firstName} ${details.lastName}`;
    return (
      <PrivateLayout
        subNav
        forceTitle={forceTitle}
        {...this.props}
        P1={
          <List horizontal>
            <List.Item>
              <List.Icon circular color="red" className="ns-lock" />
              <List.Content verticalAlign="middle">
                <List.Description>
                  Account locked <br />
                  <Link to="">Unlock</Link>
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
        }
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
