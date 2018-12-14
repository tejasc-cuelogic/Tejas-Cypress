import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Item, Header, Button, Icon, Modal, Card } from 'semantic-ui-react';
import { intersection } from 'lodash';
import Loadable from 'react-loadable';
import Helper from '../../../../../helper/utility';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import UserTypeIcon from '../components/manage/UserTypeIcon';
import ActivityHistory from '../../../shared/ActivityHistory';

const getModule = component => Loadable({
  loader: () => import(`../components/manage/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navMeta = [
  {
    title: 'Profile Data', to: 'profile-data', component: 'ProfileData', accessibleTo: [],
  },
  {
    title: 'Individual', to: 'individual', component: 'AccountDetails', accessibleTo: ['individual'],
  },
  {
    title: 'IRA', to: 'ira', component: 'AccountDetails', accessibleTo: ['ira'],
  },
  {
    title: 'Entity', to: 'entity', component: 'AccountDetails', accessibleTo: ['entity'],
  },
  {
    title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards', accessibleTo: ['investor'],
  },
  {
    title: 'Activity', to: 'activity', component: ActivityHistory, load: false, accessibleTo: [],
  },
];

@inject('userStore', 'userDetailsStore')
@observer
export default class AccountDetails extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUserProfileDetails(this.props.match.params.userId);
  }
  toggleState = (id, accountStatus) => {
    this.props.userDetailsStore.toggleState(id, accountStatus);
    Helper.toast('User Account status updated successfully.', 'success');
  }
  handleCloseModal = () => this.props.history.push('/app/users');
  render() {
    const { match } = this.props;
    const { detailsOfUser } = this.props.userDetailsStore;
    if (detailsOfUser.loading) {
      return <InlineLoader text="Loading User Details..." />;
    }
    const details = toJS({ ...detailsOfUser.data.user });
    const rolesRaw = details.roles.map(r => r.scope);
    let roles = [...new Set(rolesRaw)];
    if (roles.includes('investor')) {
      roles = [...roles, ...details.roles.map(r => r.name)];
    }
    const navItems = navMeta.filter(n =>
      n.accessibleTo.length === 0 || intersection(n.accessibleTo, roles).length > 0);
    const { info } = details;
    const userAvatar = {
      firstName: info ? info.firstName : '', lastName: info ? info.lastName : '', avatarUrl: info ? info.avatar ? info.avatar.url : '' : '', roles,
    };
    return (
      <Modal closeOnDimmerClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Item.Group>
            <Item className="user-intro">
              <div className="ui tiny circular image">
                <UserAvatar size="mini" UserInfo={userAvatar} />
              </div>
              <Item.Content verticalAlign="middle">
                <Header as="h3">
                  {details.info && details.info.firstName} {details.info && details.info.lastName}
                  <UserTypeIcon role={details.roles} />
                  <Header.Subheader>{rolesRaw[0]}</Header.Subheader>
                </Header>
                <Button.Group floated="right">
                  <Button inverted color="red" content="Delete Profile" />
                  <Button onClick={() => this.toggleState(details.id, details.locked && details.locked.lock === 'LOCKED' ? 'UNLOCKED' : 'LOCKED')} color="red">
                    <Icon className="ns-lock" />  {details.locked && details.locked.lock === 'LOCKED' ? 'Unlock' : 'Lock'} Profile
                  </Button>
                </Button.Group>
              </Item.Content>
            </Item>
          </Item.Group>
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <div className="inner-content-spacer">
              <Switch>
                {
                  navItems.map(item => (
                    <Route key={item.to} path={`${match.url}/${item.to}`} component={item.load === false ? item.component : getModule(item.component)} />
                  ))
                }
              </Switch>
            </div>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
