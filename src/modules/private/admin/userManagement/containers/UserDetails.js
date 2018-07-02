import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { List, Button } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import Helper from '../../../../../helper/utility';
import PrivateLayout from '../../../shared/PrivateHOC';
import { Spinner } from '../../../../../theme/shared';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';

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
    this.props.userDetailsStore.getUserProfileDetails(this.props.match.params.userId);
  }
  toggleState = (id) => {
    this.props.userDetailsStore.toggleState(id);
    Helper.toast('User Account status updated successfully.', 'success');
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const { detailsOfUser } = this.props.userDetailsStore;
    if (detailsOfUser.loading) {
      return (
        <div><Spinner loaderMessage="Loading..." /></div>
      );
    }
    const details = toJS({ ...detailsOfUser.data.user });
    const forceTitle = `${details.firstName} ${details.lastName}`;
    return (
      <PrivateLayout
        subNav
        forceTitle={forceTitle}
        {...this.props}
        P1={
          <List horizontal>
            <List.Item>
              <List.Icon
                circular
                color={details.accountStatus === 'LOCK' ? 'red' : 'green'}
                className={`ns-${details.accountStatus === 'LOCK' ? 'lock' : 'unlock'}`}
              />
              <List.Content verticalAlign="middle">
                <List.Description>
                  Account {details.accountStatus === 'LOCK' ? 'Locked' : 'Unlocked'} <br />
                  <Button
                    onClick={() => this.toggleState(details.id)}
                    size="tiny"
                    color={details.accountStatus === 'LOCK' ? 'green' : 'red'}
                    className="ghost-button"
                  >
                    {details.accountStatus === 'LOCK' ? 'Unlock' : 'Lock'}
                  </Button>
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
