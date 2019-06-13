import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch } from 'react-router-dom';
import { Item, Header, Button, Icon, Modal, Card } from 'semantic-ui-react';
import { intersection, isEmpty, includes, get } from 'lodash';
import Loadable from 'react-loadable';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import UserTypeIcon from '../components/manage/UserTypeIcon';
import ActivityHistory from '../../../shared/ActivityHistory';
import { REACT_APP_DEPLOY_ENV } from '../../../../../constants/common';

const getModule = component => Loadable({
  loader: () => import(`../components/manage/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navMeta = [
  {
    title: 'Profile Data', to: 'profile-data', component: 'ProfileData',
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
    title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards', accessibleTo: ['investor'], env: ['localhost', 'develop'],
  },
  {
    title: 'Activity', to: 'activity', component: ActivityHistory, load: false,
  },
];

@inject('userStore', 'userDetailsStore', 'uiStore', 'bankAccountStore')
@observer
export default class AccountDetails extends Component {
  state = {
    errorMsg: '',
    copied: false,
  }

  // state = { isActivity: false };
  componentWillMount() {
    if (this.props.userDetailsStore.selectedUserId !== this.props.match.params.userId) {
      this.props.userDetailsStore.getUserProfileDetails(this.props.match.params.userId);
    }
  }

  toggleState = (id, accountStatus) => {
    this.props.userDetailsStore.toggleState(id, accountStatus);
  }

  handleDeleteProfile = () => {
    this.props.userDetailsStore.deleteProfile().then(() => {
      this.props.history.push(this.props.refLink);
    }).catch((res) => {
      this.setState({ errorMsg: res });
    });
  }

  // activityState = (state) => {
  //   this.setState({ isActivity: state });
  // }
  handleCloseModal = () => {
    this.props.bankAccountStore.resetRoutingNum();
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { match } = this.props;
    const { inProgressArray } = this.props.uiStore;
    const {
      getDetailsOfUserLoading, getDetailsOfUser,
    } = this.props.userDetailsStore;
    if (getDetailsOfUserLoading) {
      return <InlineLoader text="Loading User Details..." />;
    }
    const details = getDetailsOfUser;
    if (isEmpty(details)) {
      return <InlineLoader text="No Data Found" />;
    }
    const rolesRaw = details.roles.map(r => r.scope);
    let roles = [...new Set(rolesRaw)];
    if (roles.includes('investor')) {
      roles = [...roles, ...details.roles.map(r => r.name)];
    }
    const navItems = navMeta.filter(n => ((!n.accessibleTo || n.accessibleTo.length === 0
        || intersection(n.accessibleTo, roles).length > 0))
      && (!n.env || n.env.length === 0 || intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0));
    const { info } = details;
    const userAvatar = {
      firstName: info ? info.firstName : '', lastName: info ? info.lastName : '', avatarUrl: info ? info.avatar ? info.avatar.url : '' : '', roles,
    };
    return (
      <Aux>
        {/* <Route exact path={`${match.url}/individual/investments/investment-details/:id`}
      render={props => <InvestmentDetails isAdmin refLink={match.url} {...props} />} /> */}
        <Modal closeOnDimmerClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
          <Modal.Content className="transaction-details">
            <Item.Group>
              <Item className="user-intro">
                <div className="ui tiny circular image">
                  <UserAvatar size="mini" UserInfo={userAvatar} />
                </div>
                <Item.Content verticalAlign="middle">
                  <Header as="h3">
                    {details.info && details.info.firstName}
                    {' '}
                    {details.info && details.info.lastName}
                    <UserTypeIcon role={details.roles} />
                    <Header.Subheader>
                      {rolesRaw[0]}
                      {' '}
-
                      <CopyToClipboard
                        text={get(details, 'id')}
                        onCopy={() => this.setState({ copied: true })}
                      >
                        <span className="text-lowercase">
                          {' '}
                          {this.state.copied ? get(details, 'id') : get(details.id.split('-'), '[0]')}
                        </span>
                      </CopyToClipboard>
                    </Header.Subheader>
                  </Header>
                  <Button.Group floated="right">
                    {!includes(details.status, 'DELETED') && details.status !== 'ADMIN'
                      && <Button inverted color="red" loading={inProgressArray.includes('deleteProfile')} onClick={this.handleDeleteProfile} content="Delete Profile" />
                    }
                    <Button loading={inProgressArray.includes('lock')} onClick={() => this.toggleState(details.id, details.locked && details.locked.lock === 'LOCKED' ? 'UNLOCKED' : 'LOCKED')} color="red">
                      <Icon className={`ns-${details.locked && details.locked.lock === 'LOCKED' ? 'unlock' : 'lock'}`} />
                      {' '}
                      {details.locked && details.locked.lock === 'LOCKED' ? 'Unlock' : 'Lock'}
                      {' '}
Profile
                    </Button>
                  </Button.Group>
                </Item.Content>
              </Item>
              {this.state.errorMsg
                && <p className="negative-text right-align"><small>{this.state.errorMsg}</small></p>
              }
            </Item.Group>
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
              <div className="inner-content-spacer">
                <Switch>
                  {
                    navItems.map((item) => {
                      const CurrentModule = item.load === false
                        ? item.component : getModule(item.component);
                      return (
                        <Route
                          key={item.to}
                          path={`${match.url}/${item.to}`}
                          render={props => (
                            <CurrentModule
                              module={item.title === 'Activity' ? 'userDetails' : false}
                              showFilters={item.title === 'Activity' ? ['activityType', 'activityUserType'] : false}
                              {...props}
                              adminActivity={item.title === 'Activity' ? 'adminActivity' : false}
                              resourceId={details.id}
                            />
                          )
                                }
                        />
                      );
                    })
                  }
                </Switch>
              </div>
            </Card>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
