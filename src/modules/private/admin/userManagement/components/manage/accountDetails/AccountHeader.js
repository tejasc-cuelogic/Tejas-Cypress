import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { includes, startCase, get } from 'lodash';
import { Header, Icon, Button, Divider, Confirm } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

@inject('userDetailsStore', 'uiStore')
@withRouter
@observer
export default class AccountHeader extends Component {
  state = { showModal: false };

  toggleConfirmModal = (e, action) => {
    e.preventDefault();
    this.props.history.push(`${this.props.pathname}/${action}`);
  }

  freezeAccountToggle = (userId, accountId, freeze) => {
    this.props.userDetailsStore.freezeAccountToggle(userId, accountId, freeze);
    this.setState({ showModal: false });
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const loadingVal = Boolean(inProgress);
    const {
      currentActiveAccountDetailsOfSelectedUsers, getDetailsOfUser,
    } = this.props.userDetailsStore;
    const userId = get(getDetailsOfUser, 'id');
    const accountId = get(currentActiveAccountDetailsOfSelectedUsers, 'details.accountId');
    const freeze = get(currentActiveAccountDetailsOfSelectedUsers, 'details.accountStatus') === 'FROZEN';
    const accountType = includes(this.props.pathname, 'individual') ? 'individual' : includes(this.props.pathname, 'ira') ? 'ira' : 'entity';
    return (
      <Aux>
        <div className="clearfix">
          <span className="pull-left">
            <Header as="h4">
              <Icon className={`ns-${accountType.toLocaleLowerCase()}-line`} color="green" />{(accountType === 'ira') ? accountType.toUpperCase() : startCase(accountType)} {this.props.module || ''}
            </Header>
          </span>
          {this.props.showFreezeCTA
          && (
<span className="pull-right">
            <Button.Group compact size="tiny">
              <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, freeze ? 'unfreeze' : 'freeze')}><Icon className="ns-freeze" />{freeze ? 'Unfreeze' : 'Freeze'} account</Button>
            </Button.Group>
          </span>
          )
          }
        </div>
        <Divider hidden />
        <Confirm
          header="Confirm"
          content={`Are you sure you want to ${freeze ? 'unfreeze' : 'freeze'} this account`}
          open={this.state.showModal}
          onCancel={e => this.toggleConfirmModal(e, false)}
          onConfirm={() => this.freezeAccountToggle(userId, accountId, !freeze)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
