import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { includes, startCase, get } from 'lodash';
import { Header, Icon, Button, Divider } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

@inject('userDetailsStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class AccountHeader extends Component {
  toggleConfirmModal = (e, action) => {
    e.preventDefault();
    this.props.history.push(`${this.props.pathname}/${action}`);
  }

  freezeAccountToggle = (userId, accountId, freeze) => {
    this.props.userDetailsStore.freezeAccountToggle(userId, accountId, freeze);
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const loadingVal = Boolean(inProgress);
    const {
      currentActiveAccountDetailsOfSelectedUsers,
    } = this.props.userDetailsStore;
    const accountStatus = get(currentActiveAccountDetailsOfSelectedUsers, 'details.accountStatus');
    const accountType = includes(this.props.pathname, 'individual') ? 'individual' : includes(this.props.pathname, 'ira') ? 'ira' : 'entity';
    const access = this.props.userStore.myAccessForModule('USERS');
    const isFullAccessUser = access.level === 'FULL';
    return (
      <>
        <div className="clearfix">
          <span className="pull-left">
            <Header as="h4">
              <Icon className={`ns-${accountType.toLocaleLowerCase()}-line`} color="green" />{(accountType === 'ira') ? accountType.toUpperCase() : startCase(accountType)} {this.props.module || ''}
            </Header>
          </span>
          {this.props.showFreezeCTA
            && (
              <>
                <span className="pull-right">
                  <Button.Group compact size="tiny" className="d-flex">
                    {accountStatus !== 'SOFT_FREEZE'
                      && <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'SOFT_FREEZE')}><Icon className="ns-freeze" />Soft Freeze</Button>
                    }

                    {accountStatus !== 'HARD_FREEZE'
                      && <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'HARD_FREEZE')}><Icon className="ns-freeze" />Hard Freeze</Button>
                    }
                  </Button.Group>
                  <Button.Group compact size="tiny" className="d-flex">
                    <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'UNFREEZE')}><Icon className="ns-freeze" />Unfreeze</Button>

                    {(isFullAccessUser)
                      && <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'close-account')}>Close account</Button>
                    }
                  </Button.Group>
                </span>
              </>
            )
          }
          {this.props.showAddWithdrawFundCta
            && (
              <span className="pull-right">
                <Button.Group floated="right" compact size="tiny">
                  <Button as={Link} to={`${this.props.refLink}/addfunds`} primary>Add Funds</Button>
                  <Button as={Link} to={`${this.props.refLink}/withdraw-funds`} primary>Withdraw Funds</Button>
                </Button.Group>
              </span>
            )
          }
        </div>
        <Divider hidden />
      </>
    );
  }
}
